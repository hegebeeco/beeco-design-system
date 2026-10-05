/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/kieg/audience.ts
var OPS = {
  select: [{ value: "eq", label: "ez" }, { value: "neq", label: "nem ez" }],
  number: [{ value: "gte", label: "legal\xE1bb" }, { value: "lte", label: "legfeljebb" }, { value: "eq", label: "pontosan" }],
  text: [{ value: "contains", label: "tartalmazza" }, { value: "eq", label: "pontosan ez" }]
};
var seq = 0;
var newRule = () => ({ id: `feltetel-${Date.now().toString(36)}-${++seq}`, field: "", op: "eq", value: null });
function ruleProblem(r, fields) {
  if (!r.field) return "V\xE1laszd ki, mire sz\u0171rj\xF6n ez a felt\xE9tel.";
  const f = fields.find((x) => x.key === r.field);
  if (!f) return "Ez a mez\u0151 m\xE1r nem v\xE1laszthat\xF3 \u2013 v\xE1lassz m\xE1sikat, vagy t\xF6r\xF6ld a felt\xE9telt.";
  if (r.value === null || typeof r.value === "string" && !r.value.trim()) return "Adj meg \xE9rt\xE9ket \u2013 en\xE9lk\xFCl ez a felt\xE9tel nem sz\u0171r.";
  if (f.type === "select" && !f.options?.some((o) => o.value === r.value)) return "A v\xE1lasztott \xE9rt\xE9k m\xE1r nem l\xE9tezik \u2013 v\xE1lassz \xFAjat.";
  return void 0;
}
function audienceProblems(a, fields) {
  const out = {};
  for (const r of a.rules) {
    const p = ruleProblem(r, fields);
    if (p) out[r.id] = p;
  }
  return out;
}
function describeAudience(a, fields) {
  const parts = a.rules.filter((r) => !ruleProblem(r, fields)).map((r) => {
    const f = fields.find((x) => x.key === r.field);
    const op = OPS[f.type].find((o) => o.value === r.op)?.label ?? "";
    const v = f.type === "select" ? f.options?.find((o) => o.value === r.value)?.label : String(r.value).replace(".", ",");
    if (f.type === "select") return `${f.label}: ${r.op === "neq" ? "nem " : ""}${v}`;
    return `${f.label} ${op} ${v}${f.unit ? ` ${f.unit}` : ""}`;
  });
  if (!parts.length) return "mindenki (nincs \xE9rv\xE9nyes felt\xE9tel)";
  return parts.join(a.join === "and" ? " \xC9S " : " VAGY ");
}

export {
  OPS,
  newRule,
  ruleProblem,
  audienceProblems,
  describeAudience
};
