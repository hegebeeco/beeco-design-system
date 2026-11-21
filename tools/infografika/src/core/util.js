/* ============ Segédek ============ */
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmtNum = v => v.toLocaleString("hu-HU",{maximumFractionDigits:2});
const num = s => parseFloat(String(s || "").replace(/[\s\u00a0]/g,"").replace(",", "."));
function niceStep(max){
  const raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}
function parseLines(text){
  const rows = [], errs = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (!line.trim()) return;
    const p = line.split("|").map(s => s.trim());
    const v = num(p[1]);
    if (!p[0] || isNaN(v)) { errs.push(`${i+1}. sor: hiányzik a megnevezés vagy a szám.`); return; }
    rows.push({p, label:p[0], value:Math.abs(v)});
  });
  return {rows, errs};
}
let palCache = null;
function pal(){
  if (!palCache) {
    const cs = getComputedStyle($("poster")), p = Object.fromEntries(PAL_SEQ.map(k => [k, cs.getPropertyValue("--pal-" + k).trim()]));
    if (Object.values(p).some(v => !v)) throw new Error("Hiányzik a szeletpaletta (--pal-a…f) a tokens.css-ből.");
    palCache = p;
  }
  return palCache;
}
const col = (code, i) => pal()[(code || "").toLowerCase()] || pal()[PAL_SEQ[i % PAL_SEQ.length]];
