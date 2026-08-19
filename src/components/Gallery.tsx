/* ============================================================
   5 · GALLERY — masonry photo grid. Hovering tints a photo
   sage-green and reveals its caption; clicking opens a
   keyboard-navigable lightbox.
   ============================================================ */
import { useCallback, useEffect, useState } from "react";
import { GALLERY } from "../config";
import { Reveal, SectionHeading } from "../lib/kit";

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setLightbox((cur) => (cur === null ? cur : (cur + dir + GALLERY.length) % GALLERY.length)),
    [],
  );

  /* lightbox keyboard controls */
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <section id="gallery" className="relative scroll-mt-20 overflow-hidden bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading no="04" kicker="Gallery" title="Moments We Keep" />
        <Reveal delay={150} className="mt-6 text-center">
          <p className="text-sm font-light text-ink/60">
            {GALLERY.length} photographs — hover for the story behind each one.
          </p>
        </Reveal>

        {/* masonry via CSS columns */}
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {GALLERY.map((g, i) => (
            <div key={g.src + i} className="mb-5 break-inside-avoid">
              <Reveal delay={(i % 3) * 110} variant="scale">
                <figure
                  className="group relative cursor-zoom-in overflow-hidden bg-mist"
                  onClick={() => setLightbox(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setLightbox(i)}
                  aria-label={`Open photo: ${g.caption}`}
                >
                  <img
                    src={g.src}
                    alt={g.caption}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.06] ${
                      g.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                    }`}
                  />
                  {/* sage tint + caption on hover */}
                  <figcaption className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-fern/65 p-6 text-center opacity-0 backdrop-blur-[1px] transition-all duration-500 group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 -translate-y-2 text-ivory transition-transform duration-500 group-hover:translate-y-0" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" strokeLinecap="round" />
                    </svg>
                    <p className="font-display translate-y-3 text-lg italic leading-snug text-ivory transition-transform duration-500 group-hover:translate-y-0">
                      {g.caption}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- lightbox ---------- */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-ink/94 p-4 backdrop-blur-sm sm:p-10"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-ivory/30 text-ivory transition-colors hover:bg-ivory hover:text-pine"
            onClick={close}
            aria-label="Close lightbox"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>

          <button
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-pine sm:left-8"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            aria-label="Previous photo"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-pine sm:right-8"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            aria-label="Next photo"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <figure className="flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY[lightbox].src}
              alt={GALLERY[lightbox].caption}
              className="max-h-[74vh] max-w-full border-4 border-ivory/90 object-contain shadow-2xl"
            />
            <figcaption className="mt-5 text-center">
              <p className="font-display text-xl italic text-ivory">{GALLERY[lightbox].caption}</p>
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                {lightbox + 1} / {GALLERY.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
