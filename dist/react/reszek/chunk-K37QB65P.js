/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/pickers/date.ts
var MONTHS = ["janu\xE1r", "febru\xE1r", "m\xE1rcius", "\xE1prilis", "m\xE1jus", "j\xFAnius", "j\xFAlius", "augusztus", "szeptember", "okt\xF3ber", "november", "december"];
var WEEKDAYS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
var WEEKDAYS_LONG = ["h\xE9tf\u0151", "kedd", "szerda", "cs\xFCt\xF6rt\xF6k", "p\xE9ntek", "szombat", "vas\xE1rnap"];
var pad = (n) => String(n).padStart(2, "0");
var toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
var fromIso = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
var todayIso = () => toIso(/* @__PURE__ */ new Date());
var formatHuDate = (iso) => iso ? iso.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1. $2. $3.") : "";
function parseHuDate(text) {
  const t = text.trim();
  const m = t.match(/^(\d{4})[.\-/\s]*(\d{1,2})[.\-/\s]*(\d{1,2})\.?$/) || t.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d ? toIso(dt) : null;
}
function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i));
}
var addDays = (iso, n) => {
  const d = fromIso(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
};
var addMonths = (iso, n) => {
  const d = fromIso(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toIso(d);
};
var inRange = (iso, min, max) => (!min || iso >= min) && (!max || iso <= max);
var localToUtcIso = (date, time = "00:00") => {
  const [h, mi] = time.split(":").map(Number);
  const d = fromIso(date);
  d.setHours(h, mi, 0, 0);
  return d.toISOString();
};
var utcToLocal = (iso) => {
  const d = new Date(iso);
  return { date: toIso(d), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
};

export {
  MONTHS,
  WEEKDAYS,
  WEEKDAYS_LONG,
  toIso,
  fromIso,
  todayIso,
  formatHuDate,
  parseHuDate,
  monthGrid,
  addDays,
  addMonths,
  inRange,
  localToUtcIso,
  utcToLocal
};
