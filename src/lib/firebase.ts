// Single import point for Firebase modules (RNFB modular API).
import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { getFunctions } from "@react-native-firebase/functions";

export const app = getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
