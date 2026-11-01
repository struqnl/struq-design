// Struq beeldbank: which pack fits a brief, and which photos inside a pack fit this client.
//
// The pack rule mirrors Struq's MCP (public canon logic), in order:
//   1. A sector word in the brief picks that sector's pack, matched as whole words (neighbouring
//      words are also tried joined, so "e-bike" matches "ebike"). Most matches wins; table order
//      breaks a tie.
//   2. No sector word, but the brief launches or sells a product: vitrine (product photography),
//      and the hero scene carries the product.
//   3. Anything else: halide, because a wrong photograph is worse than an abstract one.
// Vehicle and mobility words are not freight words: transit is for logistics, never for a bike.
// The vocabulary is the MCP's Dutch list plus the English words a brief may use.
//
// Inside a pack, fitImages drops the photos whose alt names a subject this client does not do
// (a fish restaurant gets no flour and dough from the bakery half of proof) and puts the photos
// whose alt shares words with the brief first in each slot.

export function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export const PACK_SIGNALS = [
  ["proof", ["restaurant", "restaurants", "visrestaurant", "bistro", "brasserie", "eetcafe", "horeca", "keuken", "chef", "kok", "koken", "kookt", "bakkerij", "bakker", "patisserie", "lunchroom", "koffiebar", "bakery", "cafe", "wine", "wijnbar", "pizzeria", "catering", "kitchen", "dining"]],
  ["datum", ["architect", "architecten", "architectenbureau", "architectuur", "architectuurbureau", "woningbouw", "fabriekspand", "fabriekspanden", "stedenbouw", "vastgoed", "makelaar", "makelaardij", "projectontwikkelaar", "architects", "architecture", "realestate", "property"]],
  ["mortar", ["bouw", "bouwbedrijf", "aannemer", "aannemersbedrijf", "renovatie", "verbouwing", "timmerman", "dakdekker", "loodgieter", "installateur", "installatiebedrijf", "elektricien", "construction", "contractor", "builder", "plumber", "renovation"]],
  ["portico", ["hotel", "hotels", "resort", "vakantie", "vakantiehuis", "vakantiepark", "gastenverblijf", "reisbureau", "reizen", "travel", "holiday", "villa"]],
  ["transit", ["logistiek", "logistieke", "vracht", "vrachtvervoer", "distributie", "distributiecentrum", "transport", "transportbedrijf", "transporteur", "expeditie", "magazijn", "container", "containers", "depot", "pallets", "logistics", "freight", "warehouse", "haulage", "shipping"]],
  ["cadence", ["sport", "sportschool", "sportclub", "gym", "fitness", "crossfit", "boksen", "atletiek", "hardlopen", "wielrennen", "running", "boxing", "athletics"]],
  ["vessel", ["yoga", "yogastudio", "pilates", "fysio", "fysiotherapie", "fysiotherapeut", "wellness", "sauna", "massage", "physio", "spa"]],
  ["sable", ["kapper", "kapsalon", "barbier", "barbershop", "beauty", "schoonheidssalon", "nagelstudio", "salon", "hairdresser", "barber"]],
  ["bolt", ["mode", "kleding", "kledingmerk", "boetiek", "textiel", "stoffen", "maatpak", "naaiatelier", "fashion", "clothing", "textile", "tailor"]],
  ["linen", ["therapie", "therapeut", "coach", "coaching", "psycholoog", "praktijk", "zorg", "tandarts", "huisarts", "kliniek", "therapy", "therapist", "care", "clinic"]],
  ["ledger", ["advocaat", "advocaten", "advocatenkantoor", "notaris", "accountant", "boekhouder", "consultancy", "juridisch", "verzekering", "financieel", "lawyer", "law", "accounting", "finance", "consulting"]],
  ["forge", ["smid", "smederij", "metaal", "metaalbewerking", "lassen", "ambacht", "meubelmaker", "werkplaats", "blacksmith", "metalwork", "furniture", "workshop"]],
  ["vitrine", ["webshop", "winkel", "etalage", "retail", "ecommerce", "sieraden", "keramiek", "cosmetica", "shop", "store", "jewellery", "jewelry", "ceramics", "cosmetics"]],
  ["loam", ["boerderij", "kwekerij", "tuinderij", "landbouw", "akkerbouw", "oogst", "teler", "telers", "bloemen", "farm", "grower", "agriculture"]],
  ["primer", ["school", "basisschool", "kinderopvang", "onderwijs", "creche", "bso", "childcare", "kindergarten"]],
  ["quire", ["portfolio", "ontwerper", "designer", "illustrator", "fotograaf", "grafisch", "ontwerpstudio", "creatief", "photographer", "studio", "agency"]],
  ["circuit", ["hardware", "elektronica", "sensor", "sensoren", "robotica", "iot", "electronics", "robotics"]],
  ["assembly", ["festival", "festivals", "muziekfestival", "evenement", "evenementen", "congres", "conferentie", "theater", "podium", "poppodium", "concert", "concerten", "event", "events", "conference", "venue"]],
  ["brume", ["natuur", "landschap", "kust", "zee", "strand", "wandelen", "nature", "landscape", "coast", "hiking"]],
  ["halide", ["software", "saas", "softwarebedrijf", "app", "platform"]],
];

export const PRODUCT_LAUNCH_WORDS = ["lancering", "lanceren", "lanceert", "gelanceerd", "productlancering", "launch", "launches", "launching", "introductie", "product", "producten", "products"];

/** The pack a brief's own sector words point at, or null. */
export function packSignalForBrief(brief) {
  const words = normalize(brief).split(" ").filter(Boolean);
  const tokens = new Set(words);
  for (let i = 0; i < words.length - 1; i++) tokens.add(`${words[i]}${words[i + 1]}`);
  let best = null;
  for (const [pack, signals] of PACK_SIGNALS) {
    const score = signals.filter((s) => tokens.has(s)).length;
    if (score > 0 && (!best || score > best.score)) best = { pack, score };
  }
  return best?.pack ?? null;
}

/** The pack for a brief, with the stated fallbacks. */
export function packForBrief(brief) {
  const matched = packSignalForBrief(brief);
  if (matched) return matched;
  const words = new Set(normalize(brief).split(" ").filter(Boolean));
  return PRODUCT_LAUNCH_WORDS.some((w) => words.has(w)) ? "vitrine" : "halide";
}

/** Why a pack was picked, in one line for the log. */
export function packReason(brief) {
  const matched = packSignalForBrief(brief);
  if (matched) return `sector words in the brief point at ${matched}`;
  const words = new Set(normalize(brief).split(" ").filter(Boolean));
  return PRODUCT_LAUNCH_WORDS.some((w) => words.has(w))
    ? "no sector word, a product launch: vitrine, and the hero scene carries the product"
    : "no sector word: halide, a wrong photograph is worse than an abstract one";
}

// Per pack: photos whose alt names one of `terms` only fit a brief that says one of `unless`.
export const IMAGE_RULES = {
  proof: [
    {
      subject: "bakery",
      terms: ["meel", "meelafdrukken", "meelstof", "bestoven", "deeg", "deegbol", "brood", "broden", "desem", "desembroden", "zuurdesem", "zuurdesembrood", "bakker", "kruim", "korst", "bakproces", "bloem"],
      unless: ["bakkerij", "bakker", "brood", "patisserie", "bakery", "bread", "lunchroom", "desem", "zuurdesem", "deeg", "meel", "pizzeria", "pizza"],
    },
  ],
  vitrine: [
    { subject: "cosmetics", terms: ["flessen", "flacons", "fles", "parfum", "cosmetica"], unless: ["cosmetica", "cosmetics", "parfum", "skincare", "huidverzorging", "fles", "flessen", "glas", "drank", "drink", "olie"] },
  ],
  transit: [
    { subject: "freight", terms: ["containers", "zeecontainers", "container", "laadperron", "pallets", "heftruck", "depot"], unless: PACK_SIGNALS.find(([p]) => p === "transit")[1] },
  ],
};

const words = (text) => new Set(normalize(text).split(" ").filter((w) => w.length >= 4));

/**
 * Keep the photos that fit this client, best fit first per slot.
 * images: [{ slot, alt, description, ... }]. Returns { keep, dropped } in slot order.
 */
export function fitImages(pack, brief, images) {
  const b = words(brief);
  const rules = IMAGE_RULES[pack] ?? [];
  const keep = [];
  const dropped = [];
  for (const img of images) {
    const altWords = words(img.alt ?? "");
    // Dutch compounds carry the subject inside them (meelsporen, broodkorst), so a term counts
    // when an alt word contains it; the brief's own words still have to match whole.
    const names = (t) => [...altWords].some((w) => w.includes(t));
    const offSubject = rules.find((r) => r.terms.some(names) && !r.unless.some((u) => b.has(u)));
    if (offSubject) dropped.push({ ...img, reason: `shows ${offSubject.subject}, which the brief does not name` });
    else keep.push(img);
  }
  const score = (img) => {
    const w = words(`${img.alt ?? ""} ${img.description ?? ""}`);
    let n = 0;
    for (const x of b) if (w.has(x)) n++;
    return n;
  };
  const order = [];
  const slots = [...new Set(keep.map((i) => i.slot))];
  for (const slot of slots) {
    order.push(...keep.filter((i) => i.slot === slot).map((img, i) => ({ img, i, s: score(img) })).sort((x, y) => y.s - x.s || x.i - y.i).map((x) => x.img));
  }
  return { keep: order, dropped };
}
