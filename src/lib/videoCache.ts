import {
  cacheDirectory,
  downloadAsync,
  deleteAsync,
  getInfoAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
} from "expo-file-system/legacy";

// Disk cache for activity loop videos. The deck prefetches upcoming cards so
// playback is instant; anything opened once stays cached on disk for the session
// (and beyond). Players read the local file:// uri instead of streaming.

const DIR = `${cacheDirectory}activity-videos/`;
const MAX_FILES = 50; // ~30MB at ~600KB each

const known = new Map<string, string>(); // remoteUrl -> local uri
const inFlight = new Map<string, Promise<string>>();
let dirReady: Promise<void> | null = null;

// filename from the storage path (…/activities%2Fvideos%2F<slug>.mp4), tagged
// with the download token so a re-uploaded asset (new token, same path) gets a
// fresh local file instead of serving the stale cached one.
function fileName(url: string): string {
  const m = url.match(/videos%2F([^?]+)/i) ?? url.match(/videos\/([^?]+)/i);
  const raw = m ? decodeURIComponent(m[1]) : encodeURIComponent(url).slice(-40);
  const safe = raw.replace(/[^a-zA-Z0-9._-]/g, "_");
  const token = url.match(/[?&]token=([a-f0-9-]+)/i)?.[1]?.slice(0, 8);
  if (!token) return safe;
  const dot = safe.lastIndexOf(".");
  return dot >= 0 ? `${safe.slice(0, dot)}__${token}${safe.slice(dot)}` : `${safe}__${token}`;
}

async function ensureDir() {
  if (!dirReady) {
    dirReady = (async () => {
      const info = await getInfoAsync(DIR);
      if (!info.exists) await makeDirectoryAsync(DIR, { intermediates: true });
    })();
  }
  return dirReady;
}

/** Local uri if already cached this session, else null (sync — safe for render). */
export function cachedUri(url: string | null | undefined): string | null {
  return url ? (known.get(url) ?? null) : null;
}

/** Download to disk if missing; resolves to the local file uri. Deduped. */
export function prefetchVideo(url: string | null | undefined): Promise<string> | null {
  if (!url) return null;
  const hit = known.get(url);
  if (hit) return Promise.resolve(hit);
  const pending = inFlight.get(url);
  if (pending) return pending;

  const task = (async () => {
    await ensureDir();
    const dest = `${DIR}${fileName(url)}`;
    const info = await getInfoAsync(dest);
    if (!info.exists) {
      await downloadAsync(url, dest);
      void evictIfNeeded();
    }
    known.set(url, dest);
    return dest;
  })().finally(() => inFlight.delete(url));

  inFlight.set(url, task);
  return task;
}

// keep the cache bounded — drop the oldest files past MAX_FILES
async function evictIfNeeded() {
  try {
    const names = await readDirectoryAsync(DIR);
    if (names.length <= MAX_FILES) return;
    const withTime = await Promise.all(
      names.map(async (n) => {
        const info = await getInfoAsync(`${DIR}${n}`);
        return { n, t: info.exists ? (info.modificationTime ?? 0) : 0 };
      }),
    );
    withTime.sort((a, b) => a.t - b.t);
    for (const { n } of withTime.slice(0, names.length - MAX_FILES)) {
      await deleteAsync(`${DIR}${n}`, { idempotent: true });
      for (const [url, uri] of known) if (uri.endsWith(`/${n}`)) known.delete(url);
    }
  } catch {
    // cache eviction is best-effort
  }
}
