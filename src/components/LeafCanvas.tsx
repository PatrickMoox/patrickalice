/* ============================================================
   LEAF CANVAS — continuous, subtle falling-leaf particle drift
   Used over the hero and the wishing-tree sections. Renders
   nothing when the visitor prefers reduced motion.
   ============================================================ */
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../lib/kit";

const PALETTE = ["#c9d6c0", "#a9bea4", "#8fa98a", "#d9cba4", "#b7c9ae"];

interface Particle {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rot: number;
  rotSpeed: number;
  color: string;
  alpha: number;
}

function drawLeaf(ctx: CanvasRenderingContext2D, s: number) {
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.72, s * 0.62, 0, s);
  ctx.bezierCurveTo(-s * 0.72, s * 0.62, -s * 0.95, -s * 0.55, 0, -s);
  ctx.fill();
}

export default function LeafCanvas({ density = 22, className = "" }: { density?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (topOnly: boolean): Particle => ({
      x: Math.random() * w,
      y: topOnly ? -20 - Math.random() * 40 : Math.random() * h,
      size: 5 + Math.random() * 7,
      vy: 18 + Math.random() * 26, // px per second — a lazy drift
      vx: -6 + Math.random() * 12,
      swayAmp: 14 + Math.random() * 26,
      swayFreq: 0.4 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: -0.6 + Math.random() * 1.2,
      color: PALETTE[(Math.random() * PALETTE.length) | 0],
      alpha: 0.35 + Math.random() * 0.4,
    });

    resize();
    particles = Array.from({ length: density }, () => spawn(false));
    window.addEventListener("resize", resize);

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy * dt;
        p.x += (p.vx + Math.sin(t * p.swayFreq + p.phase) * p.swayAmp * 0.6) * dt;
        p.rot += p.rotSpeed * dt;
        if (p.y > h + 24 || p.x < -40 || p.x > w + 40) particles[i] = spawn(true);
        ctx.save();
        ctx.translate(p.x + Math.sin(t * p.swayFreq + p.phase) * p.swayAmp, p.y);
        ctx.rotate(p.rot + Math.sin(t * p.swayFreq + p.phase) * 0.5);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        drawLeaf(ctx, p.size);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, reduced]);

  if (reduced) return null;
  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
