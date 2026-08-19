/* ============================================================
   SHARED TOOLKIT — scroll reveals, reduced-motion, botanical
   SVG ornaments and the recurring section-heading motif.
   ============================================================ */
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/* ---------- prefers-reduced-motion ---------- */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* ---------- scroll-triggered reveal wrapper ---------- */
interface RevealProps {
  children: ReactNode;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number; // ms
  className?: string;
  as?: "div" | "figure" | "li" | "span";
  onInView?: (inView: boolean) => void;
}

export function Reveal({ children, variant = "up", delay = 0, className = "", as = "div", onInView }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            onInView?.(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Tag = as as "div";
  const variantClass = variant === "up" ? "" : `rv-${variant}`;
  return (
    <Tag
      ref={ref as never}
      className={`rv ${variantClass} ${inView ? "is-in" : ""} ${className}`}
      style={{ "--rv-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ---------- tiny botanical line-art ---------- */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 24" fill="none" className={className} aria-hidden="true">
      <path d="M2 12 C 18 12, 46 12, 62 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 12 C 18 6, 24 4, 28 5 C 26 10, 20 12, 16 12 Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M30 12 C 32 18, 38 20, 42 19 C 40 14, 34 12, 30 12 Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path d="M46 12 C 48 7, 53 5, 57 6 C 55 10, 50 12, 46 12 Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </svg>
  );
}

/* one leaf, used by the tree, the flight animation and the scroll cue */
export function LeafShape({ fill = "currentColor", vein = true }: { fill?: string; vein?: boolean }) {
  return (
    <svg viewBox="0 0 24 26" className="h-full w-full" aria-hidden="true">
      <path d="M12 1 C 19 6, 21.5 13, 12 25 C 2.5 13, 5 6, 12 1 Z" fill={fill} />
      {vein && <path d="M12 4 L 12 21 M12 9 L 8.6 7 M12 13 L 15.6 11 M12 17 L 8.8 15" stroke="rgba(250,248,240,.55)" strokeWidth="0.9" strokeLinecap="round" fill="none" />}
    </svg>
  );
}

/* corner flourish for the hero invitation frame */
export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" fill="none" className={className} aria-hidden="true">
      <path d="M4 86 C 4 40, 40 4, 86 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
      <path d="M18 52 C 20 40, 30 32, 40 32 C 37 42, 28 50, 18 52 Z" stroke="currentColor" strokeWidth="1" />
      <path d="M52 18 C 40 20, 32 30, 32 40 C 42 37, 50 28, 52 18 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/* ---------- recurring section heading: "N° 01 · Kicker" + display title ---------- */
interface SectionHeadingProps {
  no: string;
  kicker: string;
  title: string;
  light?: boolean; // for dark-background sections
}
export function SectionHeading({ no, kicker, title, light = false }: SectionHeadingProps) {
  const words = title.split(" ");
  return (
    <Reveal className="text-center">
      <div className={`flex items-center justify-center gap-4 ${light ? "text-sage" : "text-moss"}`}>
        <Sprig className="hidden w-16 sm:block" />
        <p className="font-body text-[11px] font-medium uppercase tracking-[0.34em]">
          <span className={light ? "text-gold" : "text-fern"}>N° {no}</span>
          <span className="mx-3 opacity-50">·</span>
          {kicker}
        </p>
        <Sprig className="hidden w-16 -scale-x-100 sm:block" />
      </div>
      <h2 className={`font-display mt-5 text-4xl leading-[1.05] font-medium sm:text-5xl lg:text-6xl ${light ? "text-ivory" : "text-pine"}`}>
        {words.map((w, i) => (
          <span key={i} className="mask-line inline-block align-bottom">
            <span style={{ "--rv-delay": `${i * 90}ms` } as CSSProperties}>{w}&nbsp;</span>
          </span>
        ))}
      </h2>
    </Reveal>
  );
}
