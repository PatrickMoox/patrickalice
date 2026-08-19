/* ============================================================
   3 · STORY — scroll-triggered timeline. A hand-drawn path
   "traces" the journey down the centre as it enters view, and
   each milestone fades/slides in with its photo.
   ============================================================ */
import { useState } from "react";
import { STORY } from "../config";
import { LeafShape, Reveal, SectionHeading } from "../lib/kit";

export default function Story() {
  const [traced, setTraced] = useState(false);

  return (
    <section id="story" className="relative scroll-mt-20 overflow-hidden bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading no="02" kicker="Our Story" title="The Road to Forever" />
        <Reveal delay={150} className="mx-auto mt-6 max-w-xl text-center">
          <p className="font-light leading-relaxed text-ink/70">
            Seven years, four chapters, and one very patient sock drawer. Trace the path with us —
            it winds a little, but it always led here.
          </p>
        </Reveal>

        {/* timeline body */}
        <div className="relative mt-20 pl-9 lg:pl-0" ref={(el) => {
          if (el && !traced) {
            const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTraced(true); io.disconnect(); } }, { threshold: 0.05 });
            io.observe(el);
          }
        }}>
          {/* mobile: straight quiet line on the left */}
          <div className="absolute bottom-6 left-[7px] top-2 w-px bg-sage/60 lg:hidden" aria-hidden="true" />

          {/* desktop: hand-drawn winding path, drawn in on scroll */}
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            className="absolute left-1/2 top-0 hidden h-full w-28 -translate-x-1/2 lg:block"
            aria-hidden="true"
          >
            <path
              d="M50 0 C 22 90, 78 170, 50 260 C 22 350, 78 430, 50 520 C 22 610, 78 690, 50 780 C 30 850, 62 930, 50 1000"
              pathLength={1}
              strokeDasharray="1"
              fill="none"
              stroke="var(--color-sage)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDashoffset={traced ? 0 : 1}
              style={{ transition: "stroke-dashoffset 3.2s ease-in-out 0.2s" }}
            />
          </svg>

          {STORY.map((s, i) => {
            const photoLeft = i % 2 === 0;
            return (
              <div key={s.title} className="relative mb-16 last:mb-0 lg:mb-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-24">
                {/* leaf milestone marker */}
                <span
                  className="absolute -left-[37px] top-1 inline-block h-6 w-6 text-fern lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
                  aria-hidden="true"
                >
                  <span className="pop-in block h-full w-full" style={{ animationDelay: `${0.4 + i * 0.5}s` }}>
                    <LeafShape fill="var(--color-fern)" />
                  </span>
                  <span className="absolute inset-[-6px] -z-10 rounded-full bg-cream" />
                </span>

                {/* photo */}
                <Reveal
                  variant="scale"
                  delay={i * 60}
                  className={`${photoLeft ? "lg:col-start-1" : "lg:col-start-2"} mb-6 lg:mb-0`}
                >
                  <figure className="group relative">
                    <div className={`absolute -inset-3 border border-sage/60 ${photoLeft ? "lg:-translate-x-2 lg:translate-y-2" : "lg:translate-x-2 lg:translate-y-2"} transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0`} />
                    <div className="relative overflow-hidden">
                      <img
                        src={s.photo}
                        alt={s.alt}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.05]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-pine/10 transition-opacity duration-500 group-hover:opacity-0" />
                    </div>
                  </figure>
                </Reveal>

                {/* text */}
                <Reveal
                  variant={photoLeft ? "right" : "left"}
                  delay={120 + i * 60}
                  className={`${photoLeft ? "lg:col-start-2 lg:row-start-1" : "lg:col-start-1 lg:row-start-1 lg:text-right"}`}
                >
                  <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.36em] text-fern lg:inline-flex">
                    <span className="inline-block h-3.5 w-3.5 shrink-0 text-sage"><LeafShape fill="currentColor" /></span>
                    {s.date}
                  </p>
                  <h3 className="font-display mt-3 text-3xl font-medium italic text-pine sm:text-4xl">{s.title}</h3>
                  <div className={`mt-4 h-px w-12 bg-sage ${photoLeft ? "" : "lg:ml-auto"}`} />
                  <p className="mt-4 max-w-md font-light leading-relaxed text-ink/75 lg:mx-0 mx-auto lg:max-w-none">
                    {s.text}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
