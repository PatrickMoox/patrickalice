/* ============================================================
   CONTENT CONFIG — everything you'll want to personalise lives
   in this one file. Swap the sample values for your own.
   Images are generated placeholders ([PHOTO]); drop your files
   into /public/images and update the paths.
   ============================================================ */

export const SITE = {
  // TODO: the couple's names
  partner1Short: "Amara",
  partner2Short: "Elias",
  partner1Full: "Amara Rose Ellison",
  partner2Full: "Elias James Thorne",
  monogram: "A · E",

  // TODO: wedding date & time (local time of the venue)
  weddingDate: "2026-10-17T15:00:00",
  weddingDateLabel: "Saturday, the Seventeenth of October, Two Thousand Twenty-Six",
  weddingDateShort: "17 . 10 . 2026",

  // TODO: the day the couple started dating — powers the live "together for" counter
  datingStart: "2019-06-14T18:30:00",

  // TODO: your wedding hashtag
  hashtag: "#AmaraAndElias",
  venueShort: "The Grove at Willow Creek",
};

/* WISHING TREE BACKEND ------------------------------------------------
   The page ships with a zero-setup local database (browser storage) so
   the tree works immediately. To share wishes between ALL visitors,
   run the bundled lightweight server:

       node server/wishes-server.mjs        (listens on :8787)

   …then set WISH_API below to "http://localhost:8787/api" (or your
   deployed URL). The client syncs automatically and falls back to
   local storage if the API is unreachable.                          */
export const WISH_API = ""; // e.g. "http://localhost:8787/api"

/* ------------------------------------------------------------
   PHOTOS — generated placeholders. Replace with real photos.
   ------------------------------------------------------------ */
export const PHOTOS = {
  hero: "https://image.qwenlm.ai/generated-images/7d874934-8690-4619-85cb-1e2ec668bbd1/_result.png",
  partner1: "https://image.qwenlm.ai/generated-images/5145eb13-c12e-4a65-a8eb-01d77fedf32f/_result.png",
  partner2: "https://image.qwenlm.ai/generated-images/06b99aef-2162-4156-8f0a-8576446fae34/_result.png",
  met: "https://image.qwenlm.ai/generated-images/af18fe2f-1408-4fdc-8c69-1a4eb8e56fac/_result.png",
  firstDate: "https://image.qwenlm.ai/generated-images/73acb184-2d28-4a20-ab61-0626d5127fd4/_result.png",
  proposal: "https://image.qwenlm.ai/generated-images/39d81285-c432-45e9-92dc-7dce6194e7e6/_result.png",
  rings: "https://image.qwenlm.ai/generated-images/44c37c32-4c03-4cf2-9e9a-309be0eb58ba/_result.png",
  decor: "https://image.qwenlm.ai/generated-images/68023b33-4e4c-4fea-b7de-2698d7248289/_result.png",
};

/* ------------------------------------------------------------
   1 · COUPLE — bios + "this or that" flip cards
   ------------------------------------------------------------ */
export const COUPLE = {
  p1: {
    name: SITE.partner1Short,
    role: "The Bride", // TODO
    photo: PHOTOS.partner1,
    line: "Botanical illustrator, keeper of every ticket stub.",
    bio: "Amara sketches ferns the way other people take notes. She cries at every wedding speech, grows herbs on every windowsill she's ever had, and has quietly been planning this day in a moss-green notebook since she was nine.",
    loves: ["Peonies & rain", "Earl Grey, extra hot", "Old bookshops"],
  },
  p2: {
    name: SITE.partner2Short,
    role: "The Groom", // TODO
    photo: PHOTOS.partner2,
    line: "Luthier, terrible pun enthusiast, excellent dance-floor diplomat.",
    bio: "Elias builds violins by hand and believes most problems can be solved with a long walk or a short nap. He proposed with a ring he'd been hiding in a sock drawer for eight nerve-wracking months.",
    loves: ["Trail runs at dawn", "Vinyl B-sides", "Amara's terrible jokes"],
  },
  thisOrThat: [
    { category: "First thing I noticed", p1: "His ink-stained fingers", p2: "The way she laughed mid-sentence" },
    { category: "Favourite memory", p1: "Getting lost in Lisbon", p2: "The night the power went out" },
    { category: "Ideal Sunday", p1: "Market, canvas, slow coffee", p2: "Trails, tools, takeaway" },
    { category: "Song that's ours", p1: "“Sea of Love”", p2: "“First Day of My Life”" },
    { category: "Who apologises first", p1: "Him — within minutes", p2: "Her — after a snack" },
    { category: "Dream honeymoon", p1: "Kyoto in maple season", p2: "A cabin, no Wi-Fi, anywhere" },
  ],
};

/* ------------------------------------------------------------
   2 · STORY — timeline milestones
   ------------------------------------------------------------ */
export const STORY = [
  {
    date: "June 2019",
    title: "How we met",
    text: "A rain-soaked Tuesday, one shared table at Fern & Fig café, and a borrowed pen he never asked for back. Two coffees became four hours.",
    photo: PHOTOS.met,
    alt: "Two coffee cups on a café table by a rainy window",
  },
  {
    date: "July 2019",
    title: "The first date",
    text: "A picnic that was 60% ants and 40% nervous laughter in Meadow Park. We stayed until the fireflies came out and neither of us wanted to say goodnight.",
    photo: PHOTOS.firstDate,
    alt: "A couple laughing on a picnic blanket at golden hour",
  },
  {
    date: "March 2025",
    title: "The proposal",
    text: "On the candlelit terrace at dusk — the one where we had our first anniversary dinner — Elias knelt. Amara said yes before he finished the question.",
    photo: PHOTOS.proposal,
    alt: "A proposal by candlelight in a garden at dusk",
  },
  {
    date: "October 2026",
    title: "The wedding",
    text: "Under an arch of eucalyptus, surrounded by everyone we love, we promise it all forever. And then: cake, candles, and dancing until the stars go home.",
    photo: PHOTOS.hero,
    alt: "The couple beneath a greenery arch",
  },
];

/* ------------------------------------------------------------
   3 · EVENTS — ceremony, reception, dress code, map
   ------------------------------------------------------------ */
export const EVENTS = {
  ceremony: {
    name: "The Ceremony",
    time: "3:00 in the afternoon",
    // TODO: real venue name + address
    venue: "The Grove at Willow Creek",
    address: "14 Orchard Lane, Willow Creek, Vermont",
    note: "Vows beneath the old oak — arrive by 2:30 for garden lemonade.",
  },
  reception: {
    name: "The Reception",
    time: "5:30 until late",
    venue: "The Glasshouse, Willow Creek",
    address: "2 Mill Road, Willow Creek, Vermont",
    note: "Long-table dinner, toasts, and dancing under the fairy lights.",
  },
  dressCode: {
    label: "Garden formal — sage, ivory & earthy neutrals",
    note: "Think the colours of a greenhouse: soft greens, creams and warm stone. We kindly ask guests to skip pure white (that's ours!) and neon.",
    swatches: [
      { name: "Sage", hex: "#9DB29A" },
      { name: "Ivory", hex: "#F5F1E6" },
      { name: "Olive", hex: "#6B7F5E" },
      { name: "Cream", hex: "#EDE6D4" },
      { name: "Pine", hex: "#2E4636" },
    ],
  },
  // TODO: venue address or coordinates for the embedded Google Map
  mapQuery: "Stowe, Vermont",
};

/* ------------------------------------------------------------
   4 · GALLERY — masonry items with hover captions
   ------------------------------------------------------------ */
export const GALLERY = [
  { src: PHOTOS.hero, caption: "Under the arch — our favourite frame of us", tall: true },
  { src: PHOTOS.rings, caption: "Two thin bands of gold, chosen on a rainy Tuesday" },
  { src: PHOTOS.firstDate, caption: "Meadow Park, and the picnic the ants audited" },
  { src: PHOTOS.partner1, caption: "Amara, mid-laugh, eucalyptus in hand", tall: true },
  { src: PHOTOS.decor, caption: "Candles, garlands, and 40 metres of linen" },
  { src: PHOTOS.met, caption: "Fern & Fig — the table where it began", tall: true },
  { src: PHOTOS.proposal, caption: "The terrace, the candles, the yes" },
  { src: PHOTOS.partner2, caption: "Elias, pretending he wasn't nervous", tall: true },
];

/* ------------------------------------------------------------
   5 · WISHING TREE — sample wishes seeded on first visit so the
   tree isn't bare. (Clearly marked: replace or delete freely.)
   ------------------------------------------------------------ */
export const SEED_WISHES = [
  { name: "Grandma June", message: "Sixty years of marriage says: keep laughing at his puns. Love you both to the moon." },
  { name: "Priya & Sam", message: "May your home always smell like fresh bread and eucalyptus." },
  { name: "Noah", message: "Finally! I get my plus-one back. Wishing you endless slow Sundays." },
  { name: "Aunt Cecile", message: "May your love grow wilder than Amara's windowsill garden." },
  { name: "The Hendersons", message: "From the first coffee to forever — we're so glad you found each other." },
  { name: "Maya", message: "Dance like nobody's watching, love like it's the first day. Congrats!" },
  { name: "Grandpa Al", message: "Advice: two words. 'Yes, dear.' Works every time." },
  { name: "Iris & Tom", message: "May every season of you two be greener than the last." },
  { name: "Beatrice", message: "Save us a seat at the golden anniversary. We plan to be there." },
];

/* ------------------------------------------------------------
   FOOTER — thank-you note + hidden easter-egg trivia
   ------------------------------------------------------------ */
export const FOOTER = {
  thanks:
    "Thank you for being part of our story. Whether you're travelling across oceans or across the street, having you under one roof — even for a day — is the greatest gift we could ask for.",
  funFacts: [
    "Secret trivia №1 — Elias hid the engagement ring in a sock drawer for 8 months. Amara found it in week 2 and said nothing. For 8 months.",
    "Secret trivia №2 — They've shared an estimated 1,214 cups of coffee. The café where they met still saves them the window table.",
    "Secret trivia №3 — Their first kiss happened during a fire alarm. The building was fine. The butterflies were not.",
    "Secret trivia №4 — Amara has a moss-green notebook with this exact wedding planned in it since 2011. Elias is only allowed to see it after the cake.",
  ],
  eggHint: "You found the hidden ring!",
};
