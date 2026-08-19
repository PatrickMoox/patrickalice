/* ============================================================
   3 · STORY — scroll-triggered timeline, text only. A
   hand-drawn path "traces" the journey down the centre as it
   enters view, and each milestone fades/slides in.
   ============================================================ */
import { useState } from "react";
import { STORY } from "../config";
import { LeafShape, Reveal, SectionHeading } from "../lib/kit";

export default function Story() {
  const [traced, setTraced] = useState(false);

  return (
    <section id="story" className="relative scroll-mt-20 overflow-hidden bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading no="02" kicker="Our Story" title="The Road to Forever" />
        <Reveal delay={150} className="mx-auto mt-6 max-w-xl text-center">
          <p className="font-light leading-relaxed text-ink/70">
            Four chapters and one winding path. Scroll slowly — it always led here.
          </p>
        </Reveal>

        {/* timeline body */}
        <div
          className="relative mt-20 pl-9 lg:pl-0"
          ref={(el) => {
            if (el && !traced) {
              const io = new IntersectionObserver(
                ([e]) => {
                  if (e.isIntersecting) {
                    setTraced(true);
                    io.disconnect();
                  }
                },
                { threshold: 0.05 },
              );
              io.observe(el);
            }
          }}
        >
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
            const left = i % 2 === 0;
            return (
              <div key={s.title} className="relative mb-16 last:mb-0 lg:grid lg:grid-cols-2 lg:gap-24 lg:mb-24">
                {/* leaf milestone marker on the path */}
                <span
                  className="absolute -left-[37px] top-1 inline-block h-6 w-6 text-fern lg:left-1/2 lg:top-2 lg:-translate-x-1/2"
                  aria-hidden="true"
                >
                  <span className="pop-in block h-full w-full" style={{ animationDelay: `${0.4 + i * 0.5}s` }}>
                    <LeafShape fill="var(--color-fern)" />
                  </span>
                  <span className="absolute inset-[-6px] -z-10 rounded-full bg-cream" />
                </span>

                {/* milestone text, alternating sides on desktop */}
                <Reveal
                  variant={left ? "left" : "right"}
                  delay={120}
                  className={`${left ? "lg:col-start-1 lg:text-right" : "lg:col-start-2"}`}
                >
                  <h3 className="font-display text-3xl font-medium italic text-pine sm:text-4xl">{s.title}</h3>
                  <div className={`mt-4 h-px w-12 bg-sage ${left ? "lg:ml-auto" : ""}`} />
                  <p className="mt-4 max-w-md font-light leading-relaxed text-ink/75">{s.text}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
