/* ============================================================
   4 · EVENTS / DETAILS — ceremony & reception cards, dress
   code palette, embedded Google Map and an "add to calendar"
   button that downloads a real .ics file.
   ============================================================ */
import { EVENTS, SITE } from "../config";
import { LeafShape, Reveal, SectionHeading } from "../lib/kit";

/* build a .ics calendar file containing both events */
function downloadCalendar() {
  const icsDate = (iso: string) => iso.replace(/[-:]/g, ""); // 2026-10-17T15:00 → 20261017T1500
  const start = icsDate(SITE.weddingDate);
  const ceremonyEnd = icsDate(SITE.weddingDate).slice(0, 13) + "4500"; // ~3:45pm TODO: adjust
  const receptionStart = icsDate(SITE.weddingDate).slice(0, 13) + "1730"; // 5:30pm
  const receptionEnd = icsDate(SITE.weddingDate).slice(0, 13) + "2330"; // 11:30pm
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amara and Elias//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:ceremony-${start}@${SITE.hashtag.slice(1).toLowerCase()}`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${ceremonyEnd}`,
    `SUMMARY:${SITE.partner1Short} & ${SITE.partner2Short} — Wedding Ceremony`,
    `LOCATION:${EVENTS.ceremony.venue}\\, ${EVENTS.ceremony.address}`,
    `DESCRIPTION:${EVENTS.ceremony.note}`,
    "END:VEVENT",
    "BEGIN:VEVENT",
    `UID:reception-${start}@${SITE.hashtag.slice(1).toLowerCase()}`,
    `DTSTAMP:${start}`,
    `DTSTART:${receptionStart}`,
    `DTEND:${receptionEnd}`,
    `SUMMARY:${SITE.partner1Short} & ${SITE.partner2Short} — Wedding Reception`,
    `LOCATION:${EVENTS.reception.venue}\\, ${EVENTS.reception.address}`,
    `DESCRIPTION:${EVENTS.reception.note}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "amara-and-elias-wedding.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function EventCard({ ev, i }: { ev: typeof EVENTS.ceremony; i: number }) {
  return (
    <Reveal delay={i * 120} variant="up" className="h-full">
      <article className="group relative flex h-full flex-col items-center border border-mist bg-ivory px-8 py-12 text-center shadow-[0_14px_40px_rgba(46,70,54,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(46,70,54,0.13)]">
        {/* decorative corner ticks */}
        <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-sage/70" aria-hidden="true" />
        <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-sage/70" aria-hidden="true" />
        <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-sage/70" aria-hidden="true" />
        <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-sage/70" aria-hidden="true" />

        <span className="inline-block h-9 w-9 text-fern transition-transform duration-500 group-hover:-rotate-12">
          <LeafShape fill="currentColor" />
        </span>
        <p className="mt-4 text-[10px] uppercase tracking-[0.38em] text-moss">{ev.time}</p>
        <h3 className="font-display mt-2 text-3xl font-medium italic text-pine">{ev.name}</h3>
        <div className="mt-4 h-px w-14 bg-sage" />
        <p className="font-display mt-4 text-xl font-medium text-ink">{ev.venue}</p>
        <p className="mt-1 text-sm font-light text-ink/60">{ev.address}</p>
        <p className="mt-4 text-sm font-light italic leading-relaxed text-ink/70">{ev.note}</p>
      </article>
    </Reveal>
  );
}

export default function Events() {
  return (
    <section id="events" className="relative scroll-mt-20 bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading no="03" kicker="Events & Details" title="When & Where" />

        {/* ceremony + reception */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:gap-10">
          <EventCard ev={EVENTS.ceremony} i={0} />
          <EventCard ev={EVENTS.reception} i={1} />
        </div>

        {/* add to calendar */}
        <Reveal delay={150} className="mt-10 text-center">
          <button
            onClick={downloadCalendar}
            className="group inline-flex items-center gap-3 border border-pine bg-pine px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.3em] text-ivory transition-all duration-300 hover:bg-transparent hover:text-pine"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="1" />
              <path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4" strokeLinecap="round" />
            </svg>
            Add to calendar
          </button>
          <p className="mt-3 text-xs font-light text-ink/50">Downloads an .ics file — works with any calendar app.</p>
        </Reveal>

        {/* dress code + map */}
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
              {/* TODO: replace mapQuery in src/config.ts with your venue */}
              <iframe
                title={`Map to ${EVENTS.ceremony.venue}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(EVENTS.mapQuery)}&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute left-4 top-4 bg-pine px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ivory">
                {EVENTS.ceremony.venue}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENTS.ceremony.address)}`}
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
