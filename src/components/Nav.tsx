/* ============================================================
   NAVIGATION — sticky top bar: transparent over the hero,
   solid ivory on scroll, scrollspy + hash sync, mobile menu,
   and a hairline reading-progress bar.
   ============================================================ */
import { useEffect, useState } from "react";
import { SITE } from "../config";
import { usePrefersReducedMotion } from "../lib/kit";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "couple", label: "Couple" },
  { id: "story", label: "Story" },
  { id: "events", label: "Events" },
  { id: "gallery", label: "Gallery" },
  { id: "wishes", label: "Wishing Tree" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  /* solid background + progress bar on scroll */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scrollspy — highlight the current section & keep the hash in sync */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
            history.replaceState(null, "", `#${e.target.id}`);
          }
        });
      },
      { rootMargin: "-42% 0px -52% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* lock body scroll while the mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  const solid = scrolled || open;

  return (
    <>
      {/* reading progress */}
      <div className="fixed left-0 top-0 z-[70] h-[2.5px] w-full bg-transparent">
        <div className="h-full bg-fern transition-[width] duration-150 ease-out" style={{ width: `${progress * 100}%` }} />
      </div>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? "border-b border-mist bg-ivory/92 shadow-[0_2px_24px_rgba(46,70,54,0.08)] backdrop-blur-md" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[72px] sm:px-8">
          {/* monogram logo */}
          <button onClick={() => goTo("home")} className="group flex items-center gap-2.5" aria-label="Back to top">
            <span
              className={`font-script text-[26px] leading-none tracking-wide transition-colors duration-500 sm:text-[29px] ${
                solid ? "text-pine group-hover:text-fern" : "text-ivory group-hover:text-mist"
              }`}
            >
              P<span className={`font-display text-xl italic sm:text-[22px] ${solid ? "text-gold" : "text-gold/90"}`}>&amp;</span>A
            </span>
          </button>

          {/* desktop links */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => goTo(l.id)}
                className={`relative py-2 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 ${
                  solid ? "text-pine/70 hover:text-pine" : "text-ivory/80 hover:text-ivory"
                } ${active === l.id ? (solid ? "!text-fern" : "!text-ivory") : ""}`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-fern transition-transform duration-300 ${
                    active === l.id ? "scale-x-100" : "scale-x-0"
                  } ${solid ? "" : "!bg-ivory"}`}
                />
              </button>
            ))}
          </nav>

          {/* mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex h-10 w-10 items-center justify-center lg:hidden"
          >
            <span
              className={`absolute h-px w-6 transition-all duration-300 ${solid ? "bg-pine" : "bg-ivory"} ${
                open ? "translate-y-0 rotate-45" : "-translate-y-[5px]"
              }`}
            />
            <span
              className={`absolute h-px w-6 transition-all duration-300 ${solid ? "bg-pine" : "bg-ivory"} ${
                open ? "translate-y-0 -rotate-45" : "translate-y-[5px]"
              }`}
            />
          </button>
        </div>
      </header>

      {/* mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-1 bg-ivory transition-all duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="font-script mb-8 text-4xl text-sage">{SITE.monogram}</span>
        {LINKS.map((l, i) => (
          <button
            key={l.id}
            onClick={() => goTo(l.id)}
            className={`font-display py-2.5 text-3xl font-medium transition-all duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            } ${active === l.id ? "text-fern italic" : "text-pine hover:text-fern"}`}
            style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
          >
            {l.label}
          </button>
        ))}
        <p className="mt-10 text-[11px] uppercase tracking-[0.3em] text-moss">{SITE.weddingDateShort}</p>
      </div>
    </>
  );
}
