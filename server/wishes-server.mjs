/* ============================================================
   WISHING TREE — lightweight backend (zero dependencies)
   ------------------------------------------------------------
   Run:      node server/wishes-server.mjs
   Listens:  http://localhost:8787
   Then set in src/config.ts:
             export const WISH_API = "http://localhost:8787/api";

   Wishes are stored in server/wishes.json next to this file,
   so they survive restarts and are shared by every visitor.
   Deploy anywhere Node runs (Render, Fly, a VPS…) and point
   WISH_API at the public URL.
   ============================================================ */
import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";

const PORT = process.env.PORT || 8787;
const FILE = new URL("./wishes.json", import.meta.url);

async function readWishes() {
  try {
    const raw = await readFile(FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeWishes(wishes) {
  await writeFile(FILE, JSON.stringify(wishes, null, 2), "utf8");
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

  /* GET /api/wishes — every wish the tree has grown */
  if (req.method === "GET" && url.pathname === "/api/wishes") {
    const wishes = await readWishes();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(wishes));
  }

  /* POST /api/wishes — hang a new leaf */
  if (req.method === "POST" && url.pathname === "/api/wishes") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const { name, message } = JSON.parse(body || "{}");
        if (typeof name !== "string" || typeof message !== "string" || !name.trim() || !message.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "name and message are required" }));
        }
        const wish = {
          id: `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          name: name.trim().slice(0, 40),
          message: message.trim().slice(0, 160),
          ts: Date.now(),
        };
        const wishes = await readWishes();
        wishes.push(wish);
        await writeWishes(wishes);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(wish));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  console.log(`🌿 wishing-tree server listening on http://localhost:${PORT}/api/wishes`);
});
