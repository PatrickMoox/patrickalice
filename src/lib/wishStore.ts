/* ============================================================
   WISHING TREE — persistence layer ("lightweight database")
   ------------------------------------------------------------
   Priority chain (first configured source wins):
     1. Firebase Realtime Database  (FIREBASE_RTDB_URL — free,
        live sync between every visitor, no server to run)
     2. Bundled Node server         (WISH_API — server/wishes-server.mjs)
     3. Browser storage             (always used as an offline mirror)
   Whichever source is active, a copy is mirrored locally so the
   tree still renders if the network drops.
   ============================================================ */
import { WISH_API, FIREBASE_RTDB_URL, SEED_WISHES } from "../config";

export interface Wish {
  id: string;
  name: string;
  message: string;
  ts: number; // epoch ms
}

const KEY = "pa-wishing-tree-v1";

/* ---------- local mirror ---------- */
function readLocal(): Wish[] | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Wish[]) : null;
  } catch {
    return null;
  }
}

function writeLocal(wishes: Wish[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(wishes));
  } catch {
    /* storage full or blocked — the tree still works in memory */
  }
}

/* ---------- safety: only accept well-formed wishes ---------- */
function parseWishes(data: unknown): Wish[] {
  if (!data || typeof data !== "object") return [];
  const list = Array.isArray(data) ? data : Object.values(data as Record<string, unknown>);
  return (list as Wish[]).filter(
    (w) =>
      !!w &&
      typeof w === "object" &&
      typeof w.id === "string" &&
      typeof w.name === "string" &&
      typeof w.message === "string" &&
      typeof w.ts === "number",
  );
}

/* ---------- seed (empty by default — the tree starts bare) ---------- */
function withSeedIds(): Wish[] {
  return SEED_WISHES.map((w, i) => ({
    id: `seed-${i}`,
    name: w.name,
    message: w.message,
    ts: Date.now() - (SEED_WISHES.length - i) * 1000 * 60 * 60 * 30 - i * 12345,
  }));
}

/* ---------- Firebase Realtime Database (REST, no SDK needed) ---------- */
async function firebaseLoad(): Promise<Wish[] | null> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/wishes.json`);
    if (!res.ok) return null;
    const data = (await res.json()) as unknown; // null when the tree is empty
    return data === null ? [] : parseWishes(data);
  } catch {
    return null; // offline / misconfigured → fall through
  }
}

async function firebaseSave(wish: Wish): Promise<boolean> {
  try {
    const res = await fetch(`${FIREBASE_RTDB_URL}/wishes.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wish),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Load every wish: Firebase → bundled API → local mirror → seed. */
export async function loadWishes(): Promise<Wish[]> {
  if (FIREBASE_RTDB_URL) {
    const remote = await firebaseLoad();
    if (remote !== null) {
      writeLocal(remote); // mirror for offline resilience
      return remote;
    }
  }
  if (WISH_API) {
    try {
      const res = await fetch(`${WISH_API}/wishes`);
      if (res.ok) {
        const remote = parseWishes(await res.json());
        writeLocal(remote);
        return remote;
      }
    } catch {
      /* API unreachable — fall through to local storage */
    }
  }
  const local = readLocal();
  if (local) return local;
  const seeded = withSeedIds();
  writeLocal(seeded);
  return seeded;
}

/** Persist a new wish (Firebase / API when configured, local mirror always). */
export async function saveWish(wish: Wish): Promise<void> {
  if (FIREBASE_RTDB_URL) {
    await firebaseSave(wish);
  } else if (WISH_API) {
    try {
      await fetch(`${WISH_API}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wish),
      });
    } catch {
      /* keep local copy regardless */
    }
  }
  const all = [...(readLocal() ?? []), wish];
  writeLocal(all);
}

/**
 * LIVE SYNC — while Firebase is configured, subscribe to the tree and
 * receive updates the moment any guest hangs a leaf (from any device).
 * Returns an unsubscribe function. No-op when Firebase is not configured.
 */
export function subscribeWishes(onUpdate: (wishes: Wish[]) => void): () => void {
  if (!FIREBASE_RTDB_URL || typeof EventSource === "undefined") return () => {};
  let closed = false;
  const es = new EventSource(`${FIREBASE_RTDB_URL}/wishes.json`);

  const refresh = async () => {
    const fresh = await firebaseLoad();
    if (!closed && fresh !== null) {
      writeLocal(fresh);
      onUpdate(fresh);
    }
  };
  /* Firebase streams "put"/"patch" events on every change */
  const onEvent = () => {
    if (!closed) void refresh();
  };
  es.addEventListener("put", onEvent as EventListener);
  es.addEventListener("patch", onEvent as EventListener);
  es.onerror = () => {
    /* EventSource reconnects automatically; nothing to do */
  };

  return () => {
    closed = true;
    es.close();
  };
}

export function newWishId(): string {
  return `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
