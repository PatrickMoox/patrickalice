/* ============================================================
   CONTENT CONFIG — everything personal lives in this one file.
   Images are generated placeholders ([PHOTO]); drop your own
   files into /public/images and update the paths.
   ============================================================ */

export const SITE = {
  // the couple
  partner1Short: "Aime Patrick",
  partner2Short: "Alice",
  partner1Full: "U. Aime Patrick",
  partner2Full: "Ikirezi Alice",
  monogram: "A & A",

  // wedding date — 06 February 2027 (countdown targets the morning of the day)
  weddingDate: "2027-02-06T09:00:00",
  weddingDateLabel: "Saturday, the Sixth of February, Two Thousand Twenty-Seven",
  weddingDateShort: "06 . 02 . 2027",

  // TODO: the day the couple started dating — powers the live "together for" counter
  datingStart: "2021-02-14T18:00:00",

  hashtag: "#AimeAndAlice",
  venueShort: "Ubwiza Garden · Kagarama",
  locationLine: "Kicukiro · Kagarama · Kigali, Rwanda",

  // footer contacts
  contacts: [
    { name: "U. Aime Patrick", phone: "+250788360607", display: "+250 788 360 607" },
    { name: "Ikirezi Alice", phone: "+250783822287", display: "+250 783 822 287" },
  ],
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
  hero: "https://image.qwenlm.ai/generated-images/ce766ec0-8f53-4981-9b2b-037cd0e18b8f/_result.png", // [PHOTO] ceremony aisle, no people
  groomPortrait: "https://image.qwenlm.ai/generated-images/06b99aef-2162-4156-8f0a-8576446fae34/_result.png", // [PHOTO] groom portrait
  bridePortrait: "https://image.qwenlm.ai/generated-images/5145eb13-c12e-4a65-a8eb-01d77fedf32f/_result.png", // [PHOTO] bride portrait
  firstDate: "https://image.qwenlm.ai/generated-images/73acb184-2d28-4a20-ab61-0626d5127fd4/_result.png", // [PHOTO]
  proposal: "https://image.qwenlm.ai/generated-images/39d81285-c432-45e9-92dc-7dce6194e7e6/_result.png", // [PHOTO]
  rings: "https://image.qwenlm.ai/generated-images/44c37c32-4c03-4cf2-9e9a-309be0eb58ba/_result.png", // [PHOTO]
  decor: "https://image.qwenlm.ai/generated-images/68023b33-4e4c-4fea-b7de-2698d7248289/_result.png", // [PHOTO]
};

/* ------------------------------------------------------------
   1 · COUPLE — universal, humanised bios + flip cards
   ------------------------------------------------------------ */
export const COUPLE = {
  p1: {
    name: SITE.partner1Short,
    role: "The Groom",
    photo: PHOTOS.groomPortrait,
    line: "The steady one — with the warmest laugh in the room.",
    bio: "Aime Patrick is the kind of man people rely on without ever having to ask. Calm under pressure, generous with his time, and quietly romantic in ways he hopes no one notices — everyone notices. He has been counting down to this day far longer than he will ever admit.",
    loves: ["Slow Sunday mornings", "Good music, played loud", "Time with family"],
  },
  p2: {
    name: SITE.partner2Short,
    role: "The Bride",
    photo: PHOTOS.bridePortrait,
    line: "The light of every room she walks into.",
    bio: "Alice makes ordinary days feel like small celebrations. Thoughtful to a fault, quick to laugh, and fiercely loyal to the people she loves, she walks into this new chapter with an open heart — and a wedding playlist she has been saving for years.",
    loves: ["Fresh flowers, always", "Deep conversations", "Dancing badly, happily"],
  },
  thisOrThat: [
    { category: "First thing I noticed", p1: "Her smile", p2: "His confidence" },
    { category: "Favourite memory", p1: "Our first long drive", p2: "The night we laughed till we cried" },
    { category: "Ideal Sunday", p1: "Slow breakfast, no rush", p2: "Family, food & football" },
    { category: "Song that's ours", p1: "The one we always skip to", p2: "The one he sings in the car" },
    { category: "Who apologises first", p1: "Him — after one deep breath", p2: "Her — with food" },
    { category: "Dream honeymoon", p1: "The beach, anywhere", p2: "A city we've never seen" },
  ],
};

/* ------------------------------------------------------------
   2 · STORY — timeline milestones (no dates, no photos)
   ------------------------------------------------------------ */
export const STORY = [
  {
    title: "How we met",
    text: "An ordinary day, a simple hello, and a conversation neither of us wanted to end. Some stories don't start with fireworks — they start with the quiet feeling that you have known someone forever.",
  },
  {
    title: "The first date",
    text: "Nervous laughter, too much coffee, and a walk that lasted far longer than it should have. We both knew before the night was over — we just took our time admitting it.",
  },
  {
    title: "The proposal",
    text: "One knee, one ring, one question — and a yes before he could even finish asking. Surrounded by the people we love, it was the easiest decision we ever made.",
  },
  {
    title: "The wedding",
    text: "On the 6th of February 2027, in Kicukiro, we promise it all — forever. Family, friends, music and dancing until the stars go home.",
  },
];

/* ------------------------------------------------------------
   3 · EVENTS — one day, two locations in Kigali
   ------------------------------------------------------------ */
export const EVENTS = {
  church: {
    name: "Church Ceremony",
    time: "9:00 in the evening",
    venue: "Paroisse Saint Jean Bosco Kicukiro",
    address: "24C7+Q4X, KK 21 Ave, Kigali",
    note: "Holy matrimony before God, family and friends. Doors open from 8:15 in the evening.",
  },
  traditional: {
    name: "Traditional Wedding",
    time: "9:00 in the morning",
    venue: "Ubwiza Garden, Kagarama",
    address: "2437+HXF, KK 23 Ave, Kigali",
    note: "The traditional ceremony — two families become one, and the celebration begins in full colour.",
  },
  reception: {
    name: "The Reception",
    time: "6:00 in the evening",
    venue: "Ubwiza Garden, Kagarama",
    address: "2437+HXF, KK 23 Ave, Kigali",
    note: "Dinner, toasts, cake and dancing under the lights — stay until the stars go home.",
  },
  dressCode: {
    label: "Green, white & neutral tones",
    note: "Think the colours of a garden — sage, ivory, olive and cream. We kindly ask guests to skip pure white (that one is taken) and neon brights.",
    swatches: [
      { name: "Sage", hex: "#9DB29A" },
      { name: "Ivory", hex: "#F5F1E6" },
      { name: "Olive", hex: "#6B7F5E" },
      { name: "Cream", hex: "#EDE6D4" },
      { name: "Pine", hex: "#2E4636" },
    ],
  },
  // plus codes → Google Maps embeds
  mapQueryChurch: "24C7+Q4X Kigali, Rwanda",
  mapQueryGarden: "2437+HXF Kigali, Rwanda",
};

/* ------------------------------------------------------------
   4 · GALLERY — 6 photographs with hover captions
   ------------------------------------------------------------ */
export const GALLERY = [
  { src: PHOTOS.hero, caption: "The aisle, dressed and waiting for its moment", tall: true },
  { src: PHOTOS.rings, caption: "Two rings, one promise, a lifetime to keep it", tall: true },
  { src: PHOTOS.decor, caption: "Candles, greenery, and every detail in between", tall: false },
  { src: PHOTOS.bridePortrait, caption: "Alice — the bride, on her favourite morning", tall: true },
  { src: PHOTOS.firstDate, caption: "One of the very first photos we ever took", tall: false },
  { src: PHOTOS.proposal, caption: "The yes — and everything that came after it", tall: false },
];

/* ------------------------------------------------------------
   5 · WISHING TREE — starts from zero: no seeded wishes.
   The tree grows purely from real guests.
   ------------------------------------------------------------ */
export const SEED_WISHES: { name: string; message: string }[] = [];

/* ------------------------------------------------------------
   FOOTER — thank-you note + hidden easter-egg trivia
   ------------------------------------------------------------ */
export const FOOTER = {
  thanks:
    "Thank you for being part of our story. Whether you are travelling from far away or from just down the road, having you with us on this day is the greatest gift we could ever ask for.",
  funFacts: [
    "Secret trivia №1 — He rehearsed the proposal speech in the mirror for weeks… and still forgot every single word.",
    "Secret trivia №2 — Their first “I love you” was said twice: once by accident, once on purpose.",
    "Secret trivia №3 — She has had the wedding playlist ready for years. He is only allowed to hear it after the first dance.",
    "Secret trivia №4 — Between the two of them, they have changed their minds about the honeymoon exactly eleven times. It's still a secret.",
  ],
  eggHint: "You found the hidden ring!",
};
