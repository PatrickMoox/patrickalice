/* ============================================================
   1 · HOME — full-bleed hero styled like a wedding invitation:
   Ken Burns photo, drifting leaves, corner flourishes and the
   live countdown to the wedding day.
   ============================================================ */
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { SITE, PHOTOS } from "../config";
import LeafCanvas from "./LeafCanvas";
import { CornerFlourish, LeafShape, Sprig, usePrefersReducedMotion } from "../lib/kit";

/* ---------- date helpers ---------- */
const pad = (n: number) => String(n).padStart(2, "0");

function countdownTo(target: Date, now: Date) {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    s: Math.floor((diff / 1_000) % 60),
  };
}

export default function Hero() {
  const [now, setNow] = useState(() => new Date());
  const [par, setPar] = useState({ x: 0, y: 0 });
  const reduced = usePrefersReducedMotion();

  const wedding = useMemo(() => new Date(SITE.weddingDate), []);

  /* one clock drives the countdown */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const cd = countdownTo(wedding, now);

  /* gentle pointer parallax on the invitation frame (desktop, motion-safe) */
  const onMouseMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const { innerWidth: w, innerHeight: h } = window;
    setPar({ x: (e.clientX / w - 0.5) * 10, y: (e.clientY / h - 0.5) * 8 });
  };

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-pine" onMouseMove={onMouseMove}>
      {/* background photo with slow Ken Burns breathing */}
      <div className="absolute inset-0">
        <img
          src={PHOTOS.hero}
          alt={`${SITE.partner1Short} and ${SITE.partner2Short} beneath a greenery arch`}
          className="kenburns h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine/85 via-pine/40 to-pine/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(34,49,42,0.55)_100%)]" />
      </div>

      {/* drifting leaves */}
      <LeafCanvas density={24} className="z-10" />

      {/* invitation frame with corner flourishes + parallax */}
      <div
        className="pointer-events-none absolute inset-3 z-20 transition-transform duration-700 ease-out sm:inset-6 lg:inset-10"
        style={{ transform: reduced ? undefined : `translate3d(${par.x}px, ${par.y}px, 0)` }}
      >
        <div className="relative h-full w-full border border-ivory/40">
          <div className="absolute inset-1.5 border border-ivory/20" />
          <CornerFlourish className="absolute -left-1 -top-1 h-14 w-14 text-ivory/70 sm:h-20 sm:w-20" />
          <CornerFlourish className="absolute -right-1 -top-1 h-14 w-14 rotate-90 text-ivory/70 sm:h-20 sm:w-20" />
          <CornerFlourish className="absolute -bottom-1 -right-1 h-14 w-14 rotate-180 text-ivory/70 sm:h-20 sm:w-20" />
          <CornerFlourish className="absolute -bottom-1 -left-1 h-14 w-14 -rotate-90 text-ivory/70 sm:h-20 sm:w-20" />
        </div>
      </div>

      {/* invitation content */}
      <div className="relative z-30 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-6 pb-24 pt-28 text-center text-ivory">
        <p className="text-[10px] font-light uppercase tracking-[0.42em] text-ivory/75 sm:text-xs">
          Together with their families
        </p>

        {/* names — full names, stacked like an invitation */}
        <h1 className="mt-7 flex flex-col items-center">
          <span className="font-script text-[12.5vw] leading-[1.2] text-ivory drop-shadow-[0_2px_18px_rgba(34,49,42,0.45)] sm:text-6xl lg:text-7xl">
            {SITE.heroName1}
          </span>
          <span className="font-display my-1 text-3xl italic text-gold sm:text-4xl">&amp;</span>
          <span className="font-script text-[12.5vw] leading-[1.2] text-ivory drop-shadow-[0_2px_18px_rgba(34,49,42,0.45)] sm:text-6xl lg:text-7xl">
            {SITE.heroName2}
          </span>
        </h1>

        {/* date line */}
        <div className="mt-7 flex items-center justify-center gap-4 text-ivory/85">
          <Sprig className="w-10 text-sage sm:w-14" />
          <p className="text-[11px] font-light uppercase tracking-[0.3em] sm:text-xs">
            <span className="sm:hidden">Saturday · {SITE.weddingDateShort}</span>
            <span className="hidden sm:inline">{SITE.weddingDateLabel}</span>
          </p>
          <Sprig className="w-10 -scale-x-100 text-sage sm:w-14" />
        </div>
        <p className="mt-2 text-[11px] font-light uppercase tracking-[0.3em] text-ivory/60">
          {SITE.locationLine}
        </p>

        {/* countdown to the wedding */}
        <div className="mt-10">
          <p className="text-[10px] uppercase tracking-[0.38em] text-ivory/60">
            {cd ? "Counting down to forever" : "Happily married"}
          </p>
          {cd ? (
            <div className="mt-4 flex items-stretch justify-center gap-2 sm:gap-4">
              {[
                { v: cd.d, l: "Days" },
                { v: cd.h, l: "Hours" },
                { v: cd.m, l: "Min" },
                { v: cd.s, l: "Sec" },
              ].map((b) => (
                <div
                  key={b.l}
                  className="flex w-[62px] flex-col items-center justify-center border border-ivory/30 bg-ivory/[0.06] py-3 backdrop-blur-[2px] sm:w-24 sm:py-4"
                >
                  <span className="font-display text-2xl font-medium tabular-nums sm:text-4xl">{pad(b.v)}</span>
                  <span className="mt-1 text-[8px] uppercase tracking-[0.24em] text-ivory/60 sm:text-[9px]">{b.l}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-script mt-3 text-3xl text-sage">forever &amp; a day</p>
          )}
        </div>
      </div>

      {/* scroll cue — a bobbing leaf */}
      <a
        href="#couple"
        className="group absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/80 transition-colors hover:text-ivory"
        aria-label="Scroll to the couple section"
      >
        <span className="text-[9px] uppercase tracking-[0.42em]">Scroll</span>
        <span className="bob block h-7 w-7 text-sage transition-transform duration-300 group-hover:scale-110">
          <LeafShape fill="currentColor" />
        </span>
      </a>
    </section>
  );
}
