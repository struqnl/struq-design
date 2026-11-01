// Struq fonts: the exact Google Fonts family name for a face the canon names.
//
// The canon names a face the way a designer says it ("Big Shoulders Display"); Google Fonts and
// next/font may list it under its family ("Big Shoulders", with an opsz axis that does the display
// cut). googleName finds the listed family, so a canon pairing never falls back to a default.

/** Canon names that Google lists under another family. */
export const GOOGLE_ALIAS = {
  "Big Shoulders Display": "Big Shoulders",
  "Big Shoulders Text": "Big Shoulders",
  "Big Shoulders Inline Display": "Big Shoulders Inline",
  "Big Shoulders Stencil Display": "Big Shoulders Stencil",
};

/** The optical-size suffixes a canon name may carry that the Google family does not. */
const SUFFIXES = [" Display", " Text", " Headline", " Deck", " Micro", " Caption"];

/**
 * The Google family for a canon face name, or null when Google does not list it.
 * fontData is next/font's own font-data.json (family -> metadata), read from the project.
 */
export function googleName(name, fontData) {
  if (!name) return null;
  const has = (n) => Boolean(fontData && Object.prototype.hasOwnProperty.call(fontData, n));
  if (has(name)) return name;
  const alias = GOOGLE_ALIAS[name];
  if (alias && (has(alias) || !fontData)) return alias;
  for (const suffix of SUFFIXES) {
    if (name.endsWith(suffix)) {
      const base = name.slice(0, -suffix.length);
      if (has(base)) return base;
    }
  }
  return fontData ? null : name;
}

/** The Google Fonts CSS URL for a family, for checks and for agents without next/font data. */
export function googleCssUrl(family) {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}&display=swap`;
}
