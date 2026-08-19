/* ============================================================
   FOOTER — names, hashtag (click to copy), thank-you note,
   leaf divider, and a hidden easter egg: a tiny ring that
   bursts petals + reveals secret couple trivia.
   ============================================================ */
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { FOOTER, SITE } from "../config";
import { Sprig } from "../lib/kit";

const PETAL_COLORS = ["#9DB29A", "#2E4636", "#F5F1E6", "#B9986A", "#DCE5D8", "#8FA98A"];

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const factIdx = useRef(0);
  const ringRef = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  const copyHashtag = async () => {
    try {
      await navigator.clipboard.writeText(SITE.hashtag);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  /* the hidden ring — petal burst + rotating secret trivia */
  const triggerEgg = () => {
    const el = ringRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const origin = { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
    confetti({ particleCount: 70, spread: 78, startVelocity: 32, origin, colors: PETAL_COLORS, scalar: 0.9, ticks: 190, disableForReducedMotion: true });
    window.setTimeout(
      () => confetti({ particleCount: 45, spread: 110, startVelocity: 24, origin, colors: PETAL_COLORS, scalar: 0.7, ticks: 160, disableForReducedMotion: true }),
      240,
    );
    setToast(FOOTER.funFacts[factIdx.current % FOOTER.funFacts.length]);
    factIdx.current += 1;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 7500);
  };

  return (
    <footer className="relative overflow-hidden bg-ink py-20 text-ivory">
      {/* faint oversized monogram */}
      <span className="font-script pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 select-none whitespace-nowrap text-[26vw] leading-none text-ivory/[0.03]" aria-hidden="true">
        {SITE.partner1Short} &amp; {SITE.partner2Short}
      </span>

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="font-script text-5xl text-sage sm:text-6xl">
          {SITE.partner1Short} <span className="font-display text-3xl italic text-gold">&amp;</span> {SITE.partner2Short}
        </p>

        {/* hashtag — click to copy */}
        <button
          onClick={copyHashtag}
          className="group mt-6 inline-flex items-center gap-2 border border-ivory/25 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory/80 transition-all duration-300 hover:border-sage hover:text-sage"
          aria-live="polite"
        >
          {copied ? "copied to clipboard ✓" : SITE.hashtag}
          {!copied && (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 opacity-60 transition-opacity group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="9" y="9" width="12" height="12" rx="1" />
              <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
            </svg>
          )}
        </button>

        {/* thank-you note */}
        <p className="font-display mx-auto mt-8 max-w-xl text-lg italic leading-relaxed text-ivory/75">
          {FOOTER.thanks}
        </p>
        <p className="mt-4 text-[10px] uppercase tracking-[0.34em] text-ivory/45">
          — {SITE.partner1Full} &amp; {SITE.partner2Full}
        </p>

        {/* contact numbers */}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-10">
          {SITE.contacts.map((c) => (
            <a
              key={c.phone}
              href={`tel:${c.phone}`}
              className="group inline-flex items-center gap-2.5 text-sm font-light text-ivory/75 transition-colors hover:text-sage"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ivory/25 transition-colors group-hover:border-sage">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                  <path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                <span className="block text-[9px] uppercase tracking-[0.26em] text-ivory/45">{c.name}</span>
                <span className="tabular-nums">{c.display}</span>
              </span>
            </a>
          ))}
        </div>

        {/* decorative leaf divider */}
        <div className="mt-10 flex items-center justify-center gap-4 text-sage/70" aria-hidden="true">
          <span className="h-px w-16 bg-ivory/15 sm:w-28" />
          <Sprig className="w-16" />
          <span className="h-px w-16 bg-ivory/15 sm:w-28" />
        </div>

        {/* hidden easter egg — a tiny pair of rings */}
        <div className="mt-10">
          <button
            ref={ringRef}
            onClick={triggerEgg}
            className="group inline-flex flex-col items-center gap-2 text-gold/60 transition-colors duration-300 hover:text-gold"
            aria-label="A small decorative ring… I wonder what it does"
            title="a little something hidden…"
          >
            <svg viewBox="0 0 40 26" className="h-7 w-10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" fill="none" aria-hidden="true">
              <circle cx="15" cy="13" r="9" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="25" cy="13" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path d="M15 2.5 L 13.4 4.8 L 15 4 L 16.6 4.8 Z" fill="currentColor" />
            </svg>
            <span className="text-[8px] uppercase tracking-[0.3em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {FOOTER.eggHint}
            </span>
          </button>
        </div>

        {/* bottom line */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ivory/10 pt-6 text-[10px] uppercase tracking-[0.26em] text-ivory/35 sm:flex-row">
          <span>{SITE.weddingDateShort} · {SITE.venueShort}</span>
          <span>made with love &amp; a great deal of eucalyptus</span>
        </div>
      </div>

      {/* secret trivia toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[85] w-[min(92vw,440px)] -translate-x-1/2" role="status">
          <div className="pop-in relative border border-gold/60 bg-ivory px-6 py-5 text-center shadow-[0_24px_70px_rgba(15,25,20,0.5)]">
            <p className="font-script text-2xl leading-tight text-fern">a little secret…</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-ink/80">{toast}</p>
            <button
              onClick={() => setToast(null)}
              className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-gold/50 bg-ivory text-pine shadow transition-colors hover:bg-gold hover:text-ivory"
              aria-label="Dismiss secret"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
