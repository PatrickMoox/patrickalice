/* ============================================================
   4 · EVENTS / DETAILS — one day across two locations in
   Kigali: the church ceremony at Paroisse Saint Jean Bosco
   Kicukiro, and the traditional wedding + reception at
   Ubwiza Garden, Kagarama. Includes dress code, embedded
   Google Maps (plus codes) and an "add to calendar" (.ics)
   button.
   ============================================================ */
import { EVENTS, SITE } from "../config";
import { LeafShape, Reveal, SectionHeading } from "../lib/kit";

type DayEvent = { name: string; time: string; venue: string; address: string; note: string };

/* build a .ics calendar file containing all three moments of the day */
function downloadCalendar() {
  const d = "20270206"; // TODO: keep in sync with SITE.weddingDate
  const ev = (uid: string, start: string, end: string, e: DayEvent) =>
    [
      "BEGIN:VEVENT",
      `UID:${uid}-${d}@aimeandalice`,
      `DTSTAMP:${d}T090000`,
      `DTSTART:${d}T${start}`,
      `DTEND:${d}T${end}`,
      `SUMMARY:${SITE.partner1Short} & ${SITE.partner2Short} — ${e.name}`,
      `LOCATION:${e.venue}\\, ${e.address}`,
      `DESCRIPTION:${e.note}`,
      "END:VEVENT",
    ].join("\r\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aime Patrick and Alice//Wedding//EN",
    "CALSCALE:GREGORIAN",
    ev("traditional", "090000", "120000", EVENTS.traditional),
    ev("reception", "180000", "233000", EVENTS.reception),
    ev("church", "210000", "230000", EVENTS.church),
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aime-patrick-and-alice-wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* decorative corner ticks shared by every card */
function CornerTicks() {
  return (
    <>
      <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-sage/70" aria-hidden="true" />
      <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-sage/70" aria-hidden="true" />
      <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-sage/70" aria-hidden="true" />
      <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-sage/70" aria-hidden="true" />
    </>
  );
}

function VenueLine({ e }: { e: DayEvent }) {
  return (
    <>
      <p className="font-display mt-4 text-xl font-medium text-ink">{e.venue}</p>
      <p className="mt-1 text-sm font-light text-ink/60">{e.address}</p>
      <p className="mt-4 text-sm font-light italic leading-relaxed text-ink/70">{e.note}</p>
    </>
  );
}

export default function Events() {
  return (
    <section id="events" className="relative scroll-mt-20 bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading no="03" kicker="Events & Details" title="When & Where" />
        <Reveal delay={150} className="mx-auto mt-6 max-w-xl text-center">
          <p className="font-light leading-relaxed text-ink/70">
            One beautiful Saturday across two locations in Kigali — the morning and evening celebrations
            at Ubwiza Garden, Kagarama, and the church ceremony at Paroisse Saint Jean Bosco, Kicukiro.
          </p>
        </Reveal>

        {/* ---------- featured: church ceremony (first location) ---------- */}
        <Reveal className="mt-16">
          <article className="group relative border border-mist bg-ivory shadow-[0_14px_40px_rgba(46,70,54,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(46,70,54,0.13)]">
            <CornerTicks />
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
              <div className="text-center lg:text-left">
                <span className="inline-block h-9 w-9 text-fern transition-transform duration-500 group-hover:-rotate-12">
                  <LeafShape fill="currentColor" />
                </span>
                <p className="mt-4 text-[10px] uppercase tracking-[0.38em] text-moss">
                  {EVENTS.church.time} · First location
                </p>
                <h3 className="font-display mt-2 text-4xl font-medium italic text-pine sm:text-5xl">
                  {EVENTS.church.name}
                </h3>
                <div className="mx-auto mt-5 h-px w-14 bg-sage lg:mx-0" />
                <p className="font-display mt-5 text-2xl font-medium text-ink">{EVENTS.church.venue}</p>
                <p className="mt-1.5 text-sm font-light text-ink/60">{EVENTS.church.address}</p>
                <p className="mt-4 text-sm font-light italic leading-relaxed text-ink/70">{EVENTS.church.note}</p>
              </div>
              {/* embedded map of the church — Google Maps plus code */}
              <div className="relative min-h-[280px] overflow-hidden border border-mist bg-mist">
                <iframe
                  title={`Map to ${EVENTS.church.venue}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(EVENTS.mapQueryChurch)}&output=embed`}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENTS.church.address + ", Kigali")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-3 bg-ivory px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-pine shadow-lg transition-colors hover:bg-sage hover:text-ivory"
                >
                  Open in Maps ↗
                </a>
              </div>
            </div>
          </article>
        </Reveal>

        {/* ---------- second location: traditional wedding + reception ---------- */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {([EVENTS.traditional, EVENTS.reception] as DayEvent[]).map((e, i) => (
            <Reveal key={e.name} delay={i * 120} className="h-full">
              <article className="group relative flex h-full flex-col items-center border border-mist bg-cream px-8 py-12 text-center shadow-[0_14px_40px_rgba(46,70,54,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(46,70,54,0.12)]">
                <CornerTicks />
                <span className="inline-block h-9 w-9 text-fern transition-transform duration-500 group-hover:-rotate-12">
                  <LeafShape fill="currentColor" />
                </span>
                <p className="mt-4 text-[10px] uppercase tracking-[0.38em] text-moss">
                  {e.time} · Second location
                </p>
                <h3 className="font-display mt-2 text-3xl font-medium italic text-pine">{e.name}</h3>
                <div className="mt-4 h-px w-14 bg-sage" />
                <VenueLine e={e} />
              </article>
            </Reveal>
          ))}
        </div>

        {/* add to calendar + garden map link */}
        <Reveal delay={100} className="mt-10 flex flex-col items-center gap-4 text-center">
          <button
            onClick={downloadCalendar}
            className="group inline-flex items-center gap-3 border border-pine bg-pine px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory transition-all duration-300 hover:bg-transparent hover:text-pine"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="1" />
              <path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4" strokeLinecap="round" />
            </svg>
            Add all three to calendar
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENTS.traditional.address + ", Kigali")}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-light text-ink/55 underline decoration-sage/70 underline-offset-4 transition-colors hover:text-fern"
          >
            Map to Ubwiza Garden, Kagarama (2437+HXF) ↗
          </a>
        </Reveal>

        {/* ---------- dress code ---------- */}
        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
          <Reveal variant="left">
            <div className="flex h-full flex-col justify-center border border-mist bg-cream px-8 py-10">
              <p className="text-[10px] uppercase tracking-[0.38em] text-moss">Dress code</p>
              <h3 className="font-display mt-3 text-2xl font-medium italic leading-snug text-pine sm:text-3xl">
                {EVENTS.dressCode.label}
              </h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-ink/70">{EVENTS.dressCode.note}</p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                {EVENTS.dressCode.swatches.map((s) => (
                  <div key={s.name} className="group/sw text-center">
                    <span
                      className="block h-11 w-11 rounded-full border border-ivory shadow-[0_4px_14px_rgba(46,70,54,0.18)] transition-transform duration-300 group-hover/sw:-translate-y-1 group-hover/sw:scale-110"
                      style={{ backgroundColor: s.hex }}
                      title={s.name}
                    />
                    <span className="mt-2 block text-[9px] uppercase tracking-[0.22em] text-ink/55">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={100}>
            <div className="relative h-full min-h-[320px] overflow-hidden border border-mist bg-mist">
              <iframe
                title={`Map to ${EVENTS.reception.venue}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(EVENTS.mapQueryGarden)}&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute left-4 top-4 bg-pine px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ivory">
                Ubwiza Garden · Kagarama
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENTS.reception.address + ", Kigali")}`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 bg-ivory px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-pine shadow-lg transition-colors hover:bg-sage hover:text-ivory"
              >
                Open in Maps ↗
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
