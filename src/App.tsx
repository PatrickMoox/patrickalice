/* ============================================================
   APP — page composition.
   Order: Nav → Home(hero) → marquee band → Couple → Story →
   Events → Gallery → Wishing Tree → Footer, with the floating
   ambient-music toggle and a soft paper-grain overlay.
   ============================================================ */
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Couple from "./components/Couple";
import Story from "./components/Story";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import WishingTree from "./components/WishingTree";
import Footer from "./components/Footer";
import MusicToggle from "./components/MusicToggle";
import { LeafShape } from "./lib/kit";
import { SITE } from "./config";

/* a slow ribbon of names, dates and the hashtag — the page's pulse */
function MarqueeBand() {
  const items = [
    `${SITE.partner1Short} & ${SITE.partner2Short}`,
    SITE.weddingDateShort,
    SITE.venueShort,
    SITE.hashtag,
  ];
  const Half = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: 3 }).map((_, r) =>
        items.map((it, i) => (
          <span key={`${r}-${i}`} className="flex items-center">
            <span className="font-display px-6 text-sm italic tracking-wide text-pine/80 sm:px-10 sm:text-base">{it}</span>
            <span className="inline-block h-3.5 w-3.5 text-sage">
              <LeafShape fill="currentColor" />
            </span>
          </span>
        )),
      )}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-sage/40 bg-mist py-3">
      <div className="marquee-track flex">
        <Half />
        <Half hidden />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="grain relative">
      <Nav />
      <main>
        {/* 1 · Home */}
        <Hero />
        <MarqueeBand />
        {/* 2 · Couple */}
        <Couple />
        {/* 3 · Story */}
        <Story />
        {/* 4 · Events & Details */}
        <Events />
        {/* 5 · Gallery */}
        <Gallery />
        {/* 6 · Wishing Tree */}
        <WishingTree />
      </main>
      <Footer />
      <MusicToggle />
    </div>
  );
}
