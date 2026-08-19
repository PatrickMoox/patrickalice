/* ============================================================
   WISHING TREE — persistence layer ("lightweight database")
   ----------------------------------------------------------
   Default mode : browser storage (works instantly, zero setup,
                  wishes persist and reload for this browser).
   Synced mode  : point WISH_API in src/config.ts at the bundled
                  Node server (server/wishes-server.mjs) and the
                  tree is shared between every visitor. The API
                  is optional — any failure falls back silently.
   ============================================================ */
import { WISH_API, SEED_WISHES } from "../config";

export interface Wish {
  id: string;
  name: string;
  message: string;
  ts: number; // epoch ms
}

const KEY = "ae-wishing-tree-v1";

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

function withSeedIds(): Wish[] {
  return SEED_WISHES.map((w, i) => ({
    id: `seed-${i}`,
    name: w.name,
    message: w.message,
    // spread sample wishes over the past few weeks
    ts: Date.now() - (SEED_WISHES.length - i) * 1000 * 60 * 60 * 30 - i * 12345,
  }));
}

/** Load every wish: try the shared API first, then local storage, then seed. */
export async function loadWishes(): Promise<Wish[]> {
  if (WISH_API) {
    try {
      const res = await fetch(`${WISH_API}/wishes`);
      if (res.ok) {
        const data = (await res.json()) as Wish[];
        if (Array.isArray(data)) return data;
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

/** Persist a new wish (API when configured, local storage always). */
export async function saveWish(wish: Wish): Promise<void> {
  if (WISH_API) {
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

export function newWishId(): string {
  return `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
