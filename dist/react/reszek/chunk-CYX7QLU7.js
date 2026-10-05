/* beeco design system 1.42.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  MONTHS,
  WEEKDAYS_LONG,
  addDays,
  fromIso
} from "./chunk-B3IUPQPM.js";

// react/src/media/monthEvents.ts
var KIND_ROLE = { event: "info", special: "warning", education: "success" };
var KIND_LABEL = { event: "Esem\xE9ny", special: "Speci\xE1lis nap", education: "Oktat\xE1s" };
var ORDER = ["special", "event", "education"];
var CAL_KINDS = ["event", "special", "education"];
var isBuiltin = (k) => CAL_KINDS.includes(k);
function kindTone(k, defs) {
  return defs?.[k]?.tone ?? (isBuiltin(k) ? KIND_ROLE[k] : "neutral");
}
function kindLabel(k, labels, defs) {
  return labels?.[k] ?? defs?.[k]?.label ?? (isBuiltin(k) ? KIND_LABEL[k] : k);
}
function eventsByDay(events, days, hidden, order) {
  const map = new Map(days.map((d) => [d, []]));
  const first = days[0], last = days[days.length - 1];
  for (const e of events) {
    if (hidden.has(e.kind)) continue;
    if (e.yearly) {
      for (const y of /* @__PURE__ */ new Set([first.slice(0, 4), last.slice(0, 4)])) map.get(`${y}${e.date.slice(4)}`)?.push(e);
      continue;
    }
    const end = e.end && e.end > e.date ? e.end : e.date;
    for (let d = e.date < first ? first : e.date; d <= end && d <= last; d = addDays(d, 1)) map.get(d)?.push(e);
  }
  const rank = (k) => {
    const b = ORDER.indexOf(k);
    if (b >= 0) return b;
    const o = order?.indexOf(k) ?? -1;
    return ORDER.length + (o >= 0 ? o : 999);
  };
  for (const list of map.values()) list.sort((a, b) => rank(a.kind) - rank(b.kind) || a.title.localeCompare(b.title, "hu"));
  return map;
}
var dayTitle = (iso) => {
  const d = fromIso(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}., ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}`;
};

export {
  KIND_ROLE,
  KIND_LABEL,
  CAL_KINDS,
  kindTone,
  kindLabel,
  eventsByDay,
  dayTitle
};
