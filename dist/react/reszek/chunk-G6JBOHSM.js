/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/kieg/activity.ts
var pad = (n) => String(n).padStart(2, "0");
var toDate = (d) => d instanceof Date ? d : new Date(d);
var dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
var dayFmt = new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
var timeFmt = new Intl.DateTimeFormat("hu-HU", { hour: "2-digit", minute: "2-digit" });
function dayLabel(d, now = /* @__PURE__ */ new Date()) {
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (dayKey(d) === dayKey(now)) return "Ma";
  if (dayKey(d) === dayKey(y)) return "Tegnap";
  return dayFmt.format(d);
}
var timeLabel = (d) => {
  const x = toDate(d);
  return Number.isNaN(x.getTime()) ? "\u2013" : timeFmt.format(x);
};
var isoOf = (d) => {
  const x = toDate(d);
  return Number.isNaN(x.getTime()) ? void 0 : x.toISOString();
};
function groupByDay(items, now = /* @__PURE__ */ new Date()) {
  const sorted = items.map((it, i) => ({ it, i, t: toDate(it.at).getTime() || -Infinity })).sort((a, b) => b.t - a.t || a.i - b.i);
  const groups = [];
  for (const { it } of sorted) {
    const d = toDate(it.at);
    const key = Number.isNaN(d.getTime()) ? "ismeretlen" : dayKey(d);
    let g = groups[groups.length - 1];
    if (!g || g.key !== key) {
      g = { key, label: key === "ismeretlen" ? "Ismeretlen id\u0151pont" : dayLabel(d, now), items: [] };
      groups.push(g);
    }
    g.items.push(it);
  }
  return groups;
}

export {
  dayKey,
  dayLabel,
  timeLabel,
  isoOf,
  groupByDay
};
