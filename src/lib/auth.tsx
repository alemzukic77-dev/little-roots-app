import {
  AppleAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { httpsCallable } from "@react-native-firebase/functions";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { useEffect, useMemo, type ReactNode } from "react";
import { create } from "zustand";

import { GOOGLE_WEB_CLIENT_ID } from "@/lib/config";
import { auth, db, functions } from "@/lib/firebase";

GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });

export type AuthUser = FirebaseAuthTypes.User;

// Zustand store instead of context: onAuthStateChanged does NOT fire when
// user.reload() flips emailVerified, so refreshVerificationStatus() bumps
// `version` to force every useAuth() consumer to recompute.
const useAuthStore = create<{
  user: AuthUser | null;
  initializing: boolean;
  version: number;
}>(() => ({
  user: null,
  initializing: true,
  version: 0,
}));

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      useAuthStore.setState((s) => ({ user: u, initializing: false, version: s.version + 1 }));
    });
  }, []);

  return <>{children}</>;
}

export function useAuth() {
  const { user, initializing, version } = useAuthStore();
  return useMemo(
    () => ({
      user,
      initializing,
      /** Password-provider users must verify their email before entering the app. */
      needsVerification:
        !!user &&
        user.providerData.some((p) => p.providerId === "password") &&
        !user.emailVerified,
    }),
    // version forces recompute after user.reload() mutates the user in place
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, initializing, version],
  );
}

// ---------- profile helpers ----------

const DEFAULT_NAME = "Parent";

/** Trim, collapse inner whitespace, and bound a display name. */
const cleanName = (raw: string) => raw.trim().replace(/\s+/g, " ").slice(0, 50);

/** Creates (or overwrites) the users/{uid} profile document. */
async function createProfile(user: AuthUser, name: string, provider: string) {
  await setDoc(doc(db, "users", user.uid), {
    name,
    email: user.email ?? "",
    photoUrl: user.photoURL ?? null,
    provider,
    createdAt: serverTimestamp(),
  });
}

/** For OAuth sign-ins: create a profile on first login (display name from the provider). */
async function ensureProfile(user: AuthUser, provider: string) {
  const existing = await getDoc(doc(db, "users", user.uid));
  if (existing.exists()) return;
  const name = cleanName(user.displayName ?? user.email?.split("@")[0] ?? DEFAULT_NAME) || DEFAULT_NAME;
  await createProfile(user, name, provider);
}

// ---------- sign-in methods ----------

export async function signUpWithEmail(name: string, email: string, password: string) {
  const trimmed = cleanName(name);
  if (trimmed.length < 3) {
    throw new Error("Please enter your name (at least 3 characters).");
  }
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await createProfile(cred.user, trimmed, "password");
  await sendEmailVerification(cred.user);
  return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  // Heal accounts whose profile write failed mid-signup
  await ensureProfile(cred.user, "password").catch(() => {});
  return cred.user;
}

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (response.type !== "success") return null; // user cancelled
  const idToken = response.data.idToken;
  if (!idToken) throw new Error("Google sign-in did not return a token.");
  const cred = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  await ensureProfile(cred.user, "google.com");
  return cred.user;
}

export async function signInWithApple() {
  const rawNonce = Crypto.randomUUID();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce,
  );
  let appleCred: AppleAuthentication.AppleAuthenticationCredential;
  try {
    appleCred = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "ERR_REQUEST_CANCELED") return null;
    throw e;
  }
  if (!appleCred.identityToken) throw new Error("Apple sign-in did not return a token.");
  const cred = await signInWithCredential(
    auth,
    AppleAuthProvider.credential(appleCred.identityToken, rawNonce),
  );
  await ensureProfile(cred.user, "apple.com");
  return cred.user;
}

export async function resendVerificationEmail() {
  const user = auth.currentUser;
  if (user) await sendEmailVerification(user);
}

export async function refreshVerificationStatus(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  await reload(user);
  const verified = auth.currentUser?.emailVerified ?? false;
  // reload() mutates the user in place — notify subscribers so the gate re-runs
  useAuthStore.setState((s) => ({ user: auth.currentUser, version: s.version + 1 }));
  return verified;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signOut() {
  try {
    await GoogleSignin.signOut();
  } catch {
    // not signed in with Google — fine
  }
  await fbSignOut(auth);
}

export async function deleteAccount() {
  await httpsCallable(functions, "deleteAccount")();
  await signOut();
}
