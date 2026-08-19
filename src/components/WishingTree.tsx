/* ============================================================
   6 · WISHING TREE — an illustrated bare tree that guests
   cover in leaves. Submitting the form sends a leaf flying
   from the button onto a branch (with a soft landing bounce);
   leaves stay forever and reveal their blessing on hover/tap.
   Wishes persist via src/lib/wishStore.ts.
   ============================================================ */
import { useEffect, useMemo, useRef, useState } from "react";
import { SITE } from "../config";
import { loadWishes, newWishId, saveWish, type Wish } from "../lib/wishStore";
import LeafCanvas from "./LeafCanvas";
import { Reveal, SectionHeading, usePrefersReducedMotion } from "../lib/kit";

/* ---------- tree geometry (viewBox 640 × 560) ---------- */
const ANCHORS: { x: number; y: number; r: number }[] = [
  // lower-left branch
  { x: 108, y: 264, r: -42 }, { x: 134, y: 278, r: -32 }, { x: 160, y: 287, r: -22 },
  { x: 190, y: 297, r: -14 }, { x: 222, y: 310, r: -8 }, { x: 252, y: 321, r: 0 },
  { x: 170, y: 251, r: -52 }, { x: 191, y: 269, r: -42 },
  // upper-left branch
  { x: 188, y: 148, r: -60 }, { x: 203, y: 173, r: -54 }, { x: 224, y: 203, r: -46 },
  { x: 244, y: 226, r: -36 }, { x: 269, y: 253, r: -26 }, { x: 294, y: 288, r: -16 },
  { x: 225, y: 174, r: -62 }, { x: 236, y: 196, r: -55 },
  // mid-left branch
  { x: 261, y: 88, r: -18 }, { x: 269, y: 118, r: -14 }, { x: 279, y: 149, r: -9 },
  { x: 291, y: 189, r: -5 }, { x: 301, y: 224, r: 0 },
  // crown
  { x: 330, y: 54, r: 10 }, { x: 325, y: 89, r: 6 }, { x: 322, y: 124, r: 2 },
  { x: 320, y: 159, r: -4 }, { x: 322, y: 199, r: 0 },
  // mid-right branch
  { x: 405, y: 119, r: 26 }, { x: 395, y: 149, r: 21 }, { x: 381, y: 179, r: 15 },
  { x: 364, y: 209, r: 10 }, { x: 347, y: 239, r: 5 },
  // upper-right branch
  { x: 478, y: 188, r: 46 }, { x: 461, y: 210, r: 40 }, { x: 439, y: 231, r: 34 },
  { x: 414, y: 249, r: 26 }, { x: 389, y: 268, r: 20 },
  { x: 430, y: 204, r: 42 }, { x: 424, y: 224, r: 36 },
  // lower-right branch
  { x: 520, y: 287, r: 36 }, { x: 494, y: 299, r: 30 }, { x: 464, y: 311, r: 24 },
  { x: 434, y: 321, r: 18 }, { x: 399, y: 334, r: 10 },
  { x: 478, y: 273, r: 42 }, { x: 469, y: 289, r: 36 },
];

const LEAF_COLORS = ["#9DB29A", "#8FA98A", "#A9BEA4", "#7E9B7C", "#B7C9AE", "#C3B087"];
const LEAF_PATH = "M11 0 C 18 5, 20 12, 11 24 C 2 12, 4 5, 11 0 Z";

const hash = (s: string) => s.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/* the illustrated tree — bare, hand-drawn branches */
function TreeSvg() {
  return (
    <svg viewBox="0 0 640 560" className="h-auto w-full" aria-hidden="true">
      {/* soft ground */}
      <ellipse cx="320" cy="549" rx="170" ry="11" fill="var(--color-pine)" opacity="0.07" />
      <path d="M170 552 C 240 545, 400 545, 470 552" stroke="var(--color-sage)" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
      <g stroke="var(--color-pine)" fill="none" strokeLinecap="round">
        {/* trunk + roots */}
        <path d="M320 556 C 315 484, 323 424, 314 352 C 311 328, 317 314, 318 298" strokeWidth="11" />
        <path d="M320 556 C 302 551, 291 553, 279 557" strokeWidth="5" />
        <path d="M321 556 C 340 551, 352 553, 363 556" strokeWidth="5" />
        {/* lower-left */}
        <path d="M317 362 C 282 332, 242 321, 192 301 C 162 289, 132 285, 105 268" strokeWidth="5.5" />
        <path d="M206 297 C 196 276, 181 262, 166 249" strokeWidth="3" />
        {/* upper-left */}
        <path d="M315 322 C 291 282, 266 251, 231 211 C 212 189, 196 175, 186 150" strokeWidth="5" />
        <path d="M241 223 C 229 206, 225 190, 223 172" strokeWidth="2.6" />
        {/* mid-left */}
        <path d="M316 302 C 301 252, 291 212, 276 161 C 269 136, 263 116, 261 90" strokeWidth="4.4" />
        {/* crown */}
        <path d="M318 300 C 322 252, 318 202, 325 152 C 330 117, 323 87, 330 56" strokeWidth="5" />
        {/* mid-right */}
        <path d="M320 312 C 340 262, 355 227, 381 187 C 392 167, 400 147, 405 121" strokeWidth="4.6" />
        {/* upper-right */}
        <path d="M319 332 C 351 297, 386 272, 426 242 C 448 226, 465 212, 478 192" strokeWidth="5.2" />
        <path d="M416 251 C 426 233, 429 219, 429 202" strokeWidth="2.8" />
        {/* lower-right */}
        <path d="M318 372 C 356 347, 396 337, 441 322 C 470 312, 496 307, 521 292" strokeWidth="5.6" />
        <path d="M456 316 C 469 301, 476 289, 479 273" strokeWidth="3" />
      </g>
    </svg>
  );
}

export default function WishingTree() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Wish | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const treeWrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    loadWishes().then((w) => {
      setWishes(w);
      setLoaded(true);
    });
  }, []);

  const anchorFor = (index: number) => ANCHORS[index % ANCHORS.length];
  const leafStyle = useMemo(() => new Map<string, { color: string; jr: number; dur: string; delay: string }>(), []);
  const styleFor = (w: Wish) => {
    if (!leafStyle.has(w.id)) {
      const h = hash(w.id);
      leafStyle.set(w.id, {
        color: LEAF_COLORS[h % LEAF_COLORS.length],
        jr: (h % 21) - 10,
        dur: `${(2.8 + ((h >> 3) % 10) / 6).toFixed(2)}s`,
        delay: `${-(((h >> 5) % 100) / 100) * 3}s`,
      });
    }
    return leafStyle.get(w.id)!;
  };

  /* ---------- the flying-leaf ceremony ---------- */
  const flyToTree = (wish: Wish, anchorIdx: number) => {
    const wrap = treeWrapRef.current;
    const btn = btnRef.current;
    if (!wrap || !btn || reduced) {
      setWishes((w) => [...w, wish]);
      setJustAdded(wish.id);
      return;
    }
    const a = anchorFor(anchorIdx);
    const wr = wrap.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const sx = br.left + br.width / 2;
    const sy = br.top + br.height / 2;
    const tx = wr.left + (a.x / 640) * wr.width;
    const ty = wr.top + (a.y / 560) * wr.height;
    const dx = tx - sx;
    const dy = ty - sy;

    const el = document.createElement("div");
    el.style.cssText = `position:fixed;z-index:90;left:${sx - 13}px;top:${sy - 15}px;width:26px;height:30px;pointer-events:none;`;
    el.innerHTML = `<svg viewBox="0 0 22 26" width="26" height="30"><path d="${LEAF_PATH}" fill="#8FBF7F" stroke="rgba(34,49,42,.35)" stroke-width=".7"/><path d="M11 4 L 11 20" stroke="rgba(250,248,240,.6)" stroke-width=".8" stroke-linecap="round"/></svg>`;
    document.body.appendChild(el);

    const anim = el.animate(
      [
        { transform: "translate(0,0) rotate(0deg) scale(1.2)", opacity: 1 },
        { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 110}px) rotate(320deg) scale(1.05)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy + 12}px) rotate(660deg) scale(0.92)`, offset: 0.82 },
        { transform: `translate(${dx}px, ${dy}px) rotate(640deg) scale(1)`, opacity: 1 },
      ],
      { duration: 1350, easing: "cubic-bezier(.3,.55,.25,1)" },
    );
    anim.onfinish = () => {
      el.remove();
      setWishes((w) => [...w, wish]);
      setJustAdded(wish.id);
    };
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError("Please add both your name and a little blessing.");
      return;
    }
    setError("");
    const wish: Wish = { id: newWishId(), name: name.trim(), message: message.trim(), ts: Date.now() };
    const anchorIdx = wishes.length; // next free spot on the tree
    void saveWish(wish); // persist — fire and forget
    setName("");
    setMessage("");
    setSelected(null);
    flyToTree(wish, anchorIdx);
  };

  const recent = [...wishes].sort((a, b) => b.ts - a.ts).slice(0, 3);

  return (
    <section id="wishes" className="relative scroll-mt-20 overflow-hidden bg-pine py-24 text-ivory sm:py-32">
      {/* drifting leaves behind everything */}
      <LeafCanvas density={14} className="z-0 opacity-70" />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,rgba(20,32,26,0.5)_100%)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading no="05" kicker="Wishing Tree" title="Leave a Leaf of Love" light />
        <Reveal delay={150} className="mx-auto mt-6 max-w-xl text-center">
          <p className="font-light leading-relaxed text-ivory/70">
            Our tree starts bare. Every blessing from someone we love adds a leaf — and every leaf stays,
            growing quietly on this page forever. Hover (or tap) any leaf to read its wish.
          </p>
        </Reveal>

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          {/* ---------- the tree ---------- */}
          <Reveal variant="left" className="order-1">
            <div
              ref={treeWrapRef}
              onClick={() => setSelected(null)}
              className="relative border border-sage/40 bg-[radial-gradient(ellipse_at_center,#fdfcf7_0%,#eef0e4_78%,#e2e7d6_100%)] p-4 shadow-[0_30px_80px_rgba(15,25,20,0.45)] sm:p-6"
            >
              <div className="pointer-events-none absolute inset-2 border border-sage/30" aria-hidden="true" />
              <div className="relative">
                <TreeSvg />
                {/* wish leaves */}
                {loaded && (
                  <svg viewBox="0 0 640 560" className="absolute inset-0 h-full w-full">
                    {wishes.map((w, i) => {
                      const a = anchorFor(i);
                      const st = styleFor(w);
                      const sel = selected?.id === w.id;
                      return (
                        <g
                          key={w.id}
                          transform={`translate(${a.x} ${a.y}) rotate(${a.r + st.jr})`}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(sel ? null : w);
                          }}
                        >
                          <circle r="15" fill="transparent" />
                          <g
                            className={`wish-leaf ${w.id === justAdded ? "pop-in" : ""}`}
                            style={{
                              ["--sway-rot" as string]: "0deg",
                              ["--sway-dur" as string]: st.dur,
                              ["--sway-delay" as string]: st.delay,
                            }}
                          >
                            <path
                              d={LEAF_PATH}
                              transform="translate(-11 -2)"
                              fill={st.color}
                              stroke={sel ? "var(--color-gold)" : "rgba(34,49,42,.28)"}
                              strokeWidth={sel ? 1.6 : 0.7}
                            />
                            <path d="M0 1 L 0 18 M0 6 L -3.4 4 M0 10 L 3.6 8 M0 14 L -3.2 12" transform="translate(0 0)" stroke="rgba(250,248,240,.55)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* wish tooltip */}
              {selected && (
                (() => {
                  const idx = wishes.findIndex((w) => w.id === selected.id);
                  const a = anchorFor(idx < 0 ? 0 : idx);
                  const left = Math.min(86, Math.max(14, (a.x / 640) * 100));
                  const top = (a.y / 560) * 100;
                  return (
                    <div
                      className="pointer-events-none absolute z-20 w-56"
                      style={{ left: `${left}%`, top: `calc(${top}% - 46px)`, transform: "translate(-50%, -100%)" }}
                    >
                      <div
                        className="pop-in pointer-events-auto border border-sage/60 bg-ivory px-4 py-3 text-center shadow-[0_18px_44px_rgba(20,32,26,0.35)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                      <p className="font-script text-2xl leading-tight text-fern">{selected.name}</p>
                      <p className="mt-1 text-[13px] font-light italic leading-snug text-ink/80">“{selected.message}”</p>
                      <p className="mt-1.5 text-[9px] uppercase tracking-[0.26em] text-moss">{fmtDate(selected.ts)}</p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
            <p className="mt-4 text-center text-xs font-light italic text-ivory/50">
              psst — tap any leaf on the tree to read the wish it carries.
            </p>
          </Reveal>

          {/* ---------- form + counter ---------- */}
          <Reveal variant="right" delay={120} className="order-2">
            {/* live counter */}
            <div className="border-b border-ivory/15 pb-8 text-center lg:text-left">
              <p key={wishes.length} className="count-pop font-display text-6xl font-medium text-sage tabular-nums sm:text-7xl">
                {loaded ? wishes.length : "…"}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.34em] text-ivory/60">
                wishes and counting
              </p>
              {loaded && wishes.length === 0 && (
                <p className="font-display mt-4 text-lg italic text-sage/90">
                  The tree is bare — be the first to hang a blessing.
                </p>
              )}
            </div>

            <form onSubmit={onSubmit} className="mt-8" noValidate>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/60">Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  placeholder="e.g. Cousin Rosie"
                  className="mt-2 w-full border border-ivory/25 bg-ivory/[0.05] px-4 py-3 font-light text-ivory placeholder:text-ivory/35 transition-colors focus:border-sage focus:bg-ivory/[0.08] focus:outline-none"
                />
              </label>
              <label className="mt-5 block">
                <span className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em] text-ivory/60">
                  Your blessing
                  <span className="tabular-nums tracking-normal text-ivory/40">{message.length}/160</span>
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={160}
                  rows={4}
                  placeholder={`May your mornings be slow and your garden wild…`}
                  className="mt-2 w-full resize-none border border-ivory/25 bg-ivory/[0.05] px-4 py-3 font-light text-ivory placeholder:text-ivory/35 transition-colors focus:border-sage focus:bg-ivory/[0.08] focus:outline-none"
                />
              </label>

              {error && <p className="font-display mt-3 text-sm italic text-gold">{error}</p>}

              <button
                ref={btnRef}
                type="submit"
                className="group mt-6 flex w-full items-center justify-center gap-3 border border-sage bg-sage/15 px-6 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory transition-all duration-300 hover:bg-sage hover:text-pine active:scale-[0.98]"
              >
                <span className="inline-block h-4 w-4 transition-transform duration-500 group-hover:-rotate-45">
                  <svg viewBox="0 0 22 26" className="h-full w-full" aria-hidden="true">
                    <path d={LEAF_PATH} fill="currentColor" />
                  </svg>
                </span>
                Hang a leaf on our tree
              </button>
            </form>

            {/* freshest leaves */}
            {loaded && recent.length > 0 && (
              <div className="mt-9">
                <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/60">Fresh leaves</p>
                <ul className="mt-4 space-y-4">
                  {recent.map((w) => (
                    <li key={w.id} className="border-l-2 border-sage/50 pl-4">
                      <p className="font-script text-xl leading-none text-sage">
                        {w.name} <span className="font-body text-[9px] uppercase tracking-[0.2em] text-ivory/40">· {fmtDate(w.ts)}</span>
                      </p>
                      <p className="mt-1.5 text-sm font-light italic leading-relaxed text-ivory/75">“{w.message}”</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-8 text-xs font-light leading-relaxed text-ivory/45">
              Wishes are kept safe in our little guestbook database, so {SITE.partner1Short} &amp; {SITE.partner2Short}{" "}
              can read them all on a rainy first anniversary.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
