/* ============================================================
   AMBIENT MUSIC — floating toggle (bottom corner) that plays a
   soft generative instrumental loop synthesised with WebAudio
   (no audio file needed). Off by default; the preference is
   remembered for the browsing session's browser.
   ============================================================ */
import { useEffect, useRef, useState } from "react";

/* a gentle Cmaj9 → Am9 → Fmaj9 → Gsus progression, in midi */
const CHORDS = [
  [48, 55, 62, 64, 71],
  [45, 52, 60, 64, 69],
  [41, 48, 57, 64, 69],
  [43, 50, 59, 62, 69],
];
const PENTATONIC = [72, 74, 76, 79, 81, 84, 86];
const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private delaySend: GainNode | null = null;
  private timer: number | null = null;
  private chordIdx = 0;
  private nextChord = 0;
  private nextPluck = 0;

  async start() {
    if (this.ctx) {
      await this.ctx.resume();
      this.schedule();
      return;
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1500;
    master.connect(lp);
    lp.connect(ctx.destination);
    this.master = master;

    /* a little space: feedback delay for the plucked melody */
    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.44;
    const fb = ctx.createGain();
    fb.gain.value = 0.36;
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    const send = ctx.createGain();
    send.gain.value = 0.6;
    send.connect(delay);
    this.delaySend = send;

    master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.8);
    this.chordIdx = 0;
    this.nextChord = 0;
    this.nextPluck = 0;
    this.schedule();
  }

  stop() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    const ctx = this.ctx;
    const master = this.master;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.25);
      window.setTimeout(() => {
        void ctx.close().catch(() => undefined);
      }, 900);
    }
    this.ctx = null;
    this.master = null;
    this.delaySend = null;
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx || this.timer !== null) return;
    const step = () => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      if (this.nextChord === 0) this.nextChord = t + 0.15;
      while (this.nextChord < t + 0.4) {
        this.playChord(this.nextChord, CHORDS[this.chordIdx % CHORDS.length]);
        this.chordIdx += 1;
        this.nextChord += 6.5;
      }
      if (this.nextPluck === 0) this.nextPluck = t + 1.4;
      while (this.nextPluck < t + 0.4) {
        this.pluck(this.nextPluck);
        this.nextPluck += 1.5 + Math.random() * 1.9;
      }
    };
    step();
    this.timer = window.setInterval(step, 120);
  }

  /* slow-breathing pad: two detuned voices per note, long attack/release */
  private playChord(t: number, notes: number[]) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    notes.forEach((m, i) => {
      const base = midi(m);
      const peak = 0.045 - i * 0.005;
      [
        { type: "triangle" as OscillatorType, detune: -4, mul: 1 },
        { type: "sine" as OscillatorType, detune: 6, mul: 0.5 },
      ].forEach((v) => {
        const osc = ctx.createOscillator();
        osc.type = v.type;
        osc.frequency.value = base;
        osc.detune.value = v.detune;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(peak * v.mul, t + 2.6);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 9.2);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 9.4);
      });
    });
  }

  /* sparse pentatonic plucks drifting over the pad */
  private pluck(t: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const m = PENTATONIC[(Math.random() * PENTATONIC.length) | 0];
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = midi(m);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    osc.connect(g);
    g.connect(master);
    if (this.delaySend) g.connect(this.delaySend);
    osc.start(t);
    osc.stop(t + 2.6);
  }
}

const engine = new AmbientEngine();
const PREF_KEY = "ae-ambient-music";

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);

  /* remember the visitor's choice while browsing */
  useEffect(() => {
    try {
      if (localStorage.getItem(PREF_KEY) === "on") {
        setPlaying(true);
        void engine.start();
      }
    } catch { /* private mode — default off */ }
    return () => engine.stop();
  }, []);

  const toggle = async () => {
    if (playing) {
      engine.stop();
      setPlaying(false);
      try { localStorage.setItem(PREF_KEY, "off"); } catch { /* noop */ }
    } else {
      await engine.start();
      setPlaying(true);
      try { localStorage.setItem(PREF_KEY, "on"); } catch { /* noop */ }
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Turn ambient music off" : "Turn ambient music on"}
      className="group fixed bottom-5 right-5 z-[65] flex h-12 w-12 items-center justify-center rounded-full border bg-ivory/95 shadow-[0_10px_30px_rgba(34,49,42,0.25)] backdrop-blur transition-all duration-300 hover:scale-105 active:scale-95 sm:bottom-7 sm:right-7"
      style={{ borderColor: playing ? "var(--color-fern)" : "var(--color-mist)" }}
    >
      {playing && <span className="pulse-soft pointer-events-none absolute inset-0 rounded-full border border-fern/50" />}
      {playing ? (
        /* tiny equalizer */
        <span className="flex h-4 items-end gap-[3px] text-fern" aria-hidden="true">
          <span className="eq-bar w-[3px] bg-current" />
          <span className="eq-bar w-[3px] bg-current" />
          <span className="eq-bar w-[3px] bg-current" />
        </span>
      ) : (
        /* muted note */
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-pine" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 18V6l10-2v11.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="15.5" r="2.5" />
        </svg>
      )}
      <span className="pointer-events-none absolute right-[52px] whitespace-nowrap border border-mist bg-ivory px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-pine opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
        {playing ? "music off" : "ambient music"}
      </span>
    </button>
  );
}
