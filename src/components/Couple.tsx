/* ============================================================
   2 · COUPLE — two-column portraits & bios, plus a row of
   "This or That" flip cards (hover on desktop, tap on mobile).
   ============================================================ */
import { useState } from "react";
import { COUPLE, SITE } from "../config";
import { LeafShape, Reveal, SectionHeading, Sprig } from "../lib/kit";

interface PartnerProps {
  data: typeof COUPLE.p1;
  flip?: boolean; // mirror the layout for the second column
  delay?: number;
}

function Partner({ data, flip = false, delay = 0 }: PartnerProps) {
  return (
    <Reveal variant={flip ? "right" : "left"} delay={delay} className="group">
      <div className={`flex flex-col items-center gap-8 ${flip ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        {/* portrait with offset sage frame */}
        <div className="relative w-full max-w-[340px] shrink-0">
          <div className={`absolute inset-0 border border-sage/70 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0 ${flip ? "-translate-x-3 translate-y-3" : "translate-x-3 translate-y-3"}`} />
          <div className="relative overflow-hidden bg-mist">
            <img
              src={data.photo}
              alt={`Portrait of ${data.name}`}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pine/25 via-transparent to-transparent" />
          </div>
          <span className="font-script absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ivory px-4 text-3xl text-fern">
            {data.name}
          </span>
        </div>

        {/* bio */}
        <div className={`text-center lg:text-left ${flip ? "lg:text-right" : ""}`}>
          <p className="text-[10px] uppercase tracking-[0.38em] text-moss">{data.role}</p>
          <p className="font-display mt-3 text-xl italic leading-snug text-fern">“{data.line}”</p>
          <p className="mt-4 max-w-md font-light leading-relaxed text-ink/75 lg:mx-0 mx-auto">{data.bio}</p>
          <ul className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 ${flip ? "lg:justify-end" : ""} justify-center`}>
            {data.loves.map((l) => (
              <li key={l} className="flex items-center gap-1.5 text-sm text-ink/60">
                <span className="inline-block h-3.5 w-3.5 text-sage"><LeafShape fill="currentColor" /></span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- "This or That" flip card ---------- */
function FlipCard({ c, i }: { c: (typeof COUPLE.thisOrThat)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Reveal delay={i * 90} className="h-full">
      <div
        className={`flip h-56 cursor-pointer select-none ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setFlipped((v) => !v)}
        aria-label={`${c.category} — flip for answers`}
      >
        <div className="flip-inner">
          {/* front: the category */}
          <div className="flip-face flex flex-col items-center justify-center gap-3 border border-mist bg-ivory px-4 text-center shadow-[0_10px_30px_rgba(46,70,54,0.06)] transition-shadow duration-500 hover:shadow-[0_16px_44px_rgba(46,70,54,0.12)]">
            <span className="inline-block h-6 w-6 text-sage"><LeafShape fill="currentColor" /></span>
            <p className="font-display text-lg italic leading-tight text-pine">{c.category}</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-moss/80">tap to flip</p>
          </div>
          {/* back: both answers */}
          <div className="flip-back flip-face flex flex-col items-center justify-center gap-4 bg-pine px-4 text-center text-ivory">
            <div>
              <p className="font-script text-xl text-sage">{SITE.partner1Short}</p>
              <p className="mt-0.5 text-[13px] font-light leading-snug text-ivory/90">{c.p1}</p>
            </div>
            <span className="h-px w-8 bg-ivory/30" />
            <div>
              <p className="font-script text-xl text-sage">{SITE.partner2Short}</p>
              <p className="mt-0.5 text-[13px] font-light leading-snug text-ivory/90">{c.p2}</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Couple() {
  return (
    <section id="couple" className="relative scroll-mt-20 overflow-hidden bg-ivory py-24 sm:py-32">
      {/* faint botanical flourish in the background */}
      <svg viewBox="0 0 200 200" className="pointer-events-none absolute -right-16 top-10 h-72 w-72 text-mist" aria-hidden="true">
        <path d="M100 190 C 100 120, 100 60, 100 10 M100 60 C 70 50, 55 25, 60 5 C 85 15, 98 35, 100 60 M100 110 C 130 100, 145 75, 140 55 C 115 65, 102 85, 100 110 M100 155 C 72 148, 58 128, 60 110 C 84 118, 97 135, 100 155" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading no="01" kicker="The Couple" title="Two Hearts, One Garden" />

        <div className="mt-20 space-y-20 lg:space-y-24">
          <Partner data={COUPLE.p1} />
          <div className="mx-auto flex max-w-xs items-center gap-4 text-sage" aria-hidden="true">
            <span className="h-px flex-1 bg-mist" />
            <span className="font-script text-3xl text-sage">&amp;</span>
            <span className="h-px flex-1 bg-mist" />
          </div>
          <Partner data={COUPLE.p2} flip delay={100} />
        </div>

        {/* This or That */}
        <Reveal className="mt-24 text-center">
          <div className="flex items-center justify-center gap-4 text-moss">
            <Sprig className="w-12" />
            <p className="text-[11px] uppercase tracking-[0.34em]">This or That</p>
            <Sprig className="w-12 -scale-x-100" />
          </div>
          <h3 className="font-display mt-3 text-3xl font-medium text-pine sm:text-4xl">A Few Things We Agree (and Don't) On</h3>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {COUPLE.thisOrThat.map((c, i) => (
            <FlipCard key={c.category} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
