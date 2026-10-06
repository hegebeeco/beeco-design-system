/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/inputs/number.ts
function formatHu(n, decimals) {
  if (n === null || Number.isNaN(n)) return "";
  const fixed = decimals > 0 ? n.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "") : String(Math.round(n));
  const [int, frac] = fixed.split(".");
  const neg = int.startsWith("-");
  const digits = neg ? int.slice(1) : int;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "-" : "") + grouped + (frac ? "," + frac : "");
}
function parseHu(text) {
  const t = text.replace(/\s/g, "").replace(",", ".");
  if (t === "" || t === "-" || t === "." || t === "-.") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}
function sanitize(text, decimals, allowNegative) {
  let out = "";
  let sep = false;
  for (const ch of text) {
    if (/\d/.test(ch)) out += ch;
    else if (ch === " ") out += ch;
    else if ((ch === "," || ch === ".") && decimals > 0 && !sep) {
      out += ",";
      sep = true;
    } else if (ch === "-" && allowNegative && out.trim() === "") out += ch;
  }
  if (decimals > 0 && sep) {
    const [a, b = ""] = out.split(",");
    out = a + "," + b.slice(0, decimals);
  }
  return out;
}
function numberRange(min, max, unit, decimals = 0) {
  const u = unit ? ` ${unit}` : "";
  const f = (n) => formatHu(n, decimals);
  if (min !== void 0 && max !== void 0) return `${f(min)}\u2013${f(max)}${u}`;
  if (max !== void 0) return `legfeljebb ${f(max)}${u}`;
  if (min !== void 0) return `legal\xE1bb ${f(min)}${u}`;
  return void 0;
}

export {
  formatHu,
  parseHu,
  sanitize,
  numberRange
};
