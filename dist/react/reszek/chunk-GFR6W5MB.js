/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/media/openingHours.ts
var WEEK = [
  { key: "Mon", label: "H\xE9tf\u0151" },
  { key: "Tue", label: "Kedd" },
  { key: "Wed", label: "Szerda" },
  { key: "Thu", label: "Cs\xFCt\xF6rt\xF6k" },
  { key: "Fri", label: "P\xE9ntek" },
  { key: "Sat", label: "Szombat" },
  { key: "Sun", label: "Vas\xE1rnap" }
];
function parseTime(text) {
  const t = text.trim().toLowerCase().replace(/\s+/g, "");
  if (!t) return null;
  const m = t.match(/^(\d{1,2})(?:[:.,h]?(\d{2}))?(am|pm|de|du)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const mi = Number(m[2] ?? 0);
  const ap = m[3];
  if (ap) {
    if (h < 1 || h > 12) return null;
    if (ap === "pm" || ap === "du") h = h % 12 + 12;
    else h = h % 12;
  }
  if (mi > 59 || h > 24 || h === 24 && mi > 0) return null;
  return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
}
function validateHours(v) {
  const err = {};
  for (const { key, label } of WEEK) {
    const d = v[key];
    if (!d.open) continue;
    if (!d.from || !d.to) {
      err[key] = `${label}: add meg a nyit\xE1st \xE9s a z\xE1r\xE1st is, vagy kapcsold \u201EZ\xE1rva\u201D-ra.`;
      continue;
    }
    if (d.to <= d.from) {
      err[key] = d.to === d.from ? `${label}: a nyit\xE1s \xE9s a z\xE1r\xE1s ugyanaz (${d.from}). Eg\xE9sz napos nyitvatart\xE1shoz \xEDrd: 00:00\u201324:00.` : `${label}: a z\xE1r\xE1s (${d.to}) a nyit\xE1s (${d.from}) el\u0151tt van. \xC9jf\xE9l ut\xE1ni z\xE1r\xE1st most nem tudunk t\xE1rolni \u2013 legk\xE9s\u0151bb 24:00 lehet.`;
    }
  }
  return err;
}
var emptyWeek = () => Object.fromEntries(WEEK.map(({ key }) => [key, { open: false, from: null, to: null }]));

export {
  WEEK,
  parseTime,
  validateHours,
  emptyWeek
};
