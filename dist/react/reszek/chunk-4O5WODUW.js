/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/kieg/merge.ts
var isBlank = (v) => v === null || v === void 0 || typeof v === "string" && !v.trim() || Array.isArray(v) && v.length === 0;
var norm = (v) => isBlank(v) ? null : typeof v === "string" ? v.trim() : Array.isArray(v) ? v.map(norm) : v;
var sameValue = (a, b) => JSON.stringify(norm(a)) === JSON.stringify(norm(b));
function showValue(v) {
  if (isBlank(v)) return "";
  if (Array.isArray(v)) return v.map(showValue).join(", ");
  if (typeof v === "boolean") return v ? "igen" : "nem";
  if (typeof v === "number") return String(v).replace(".", ",");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
var differing = (records, fields) => fields.filter((f) => records.some((r) => !sameValue(r.values[f.key], records[0].values[f.key])));
function suggest(records, fields, choices) {
  const out = { ...choices };
  for (const f of differing(records, fields)) {
    if (out[f.key]) continue;
    const filled = records.filter((r) => !isBlank(r.values[f.key]));
    if (filled.length === 1) out[f.key] = filled[0].id;
  }
  return out;
}
function mergedValues(records, fields, choices) {
  const diff = new Set(differing(records, fields).map((f) => f.key));
  const out = {};
  for (const f of fields) {
    if (!diff.has(f.key)) {
      out[f.key] = records[0].values[f.key];
      continue;
    }
    const r = records.find((x) => x.id === choices[f.key]);
    out[f.key] = r ? r.values[f.key] : void 0;
  }
  return out;
}

export {
  isBlank,
  sameValue,
  showValue,
  differing,
  suggest,
  mergedValues
};
