/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/csapat/geometria.ts
function tengelySzog(i, n) {
  return -Math.PI / 2 + 2 * Math.PI * i / n;
}
var ket = (x) => Math.round(x * 100) / 100;
function radarPont(i, n, ertek, { cx = 0, cy = 0, r = 100, max = 10 } = {}) {
  const arany = ertek === null || ertek === void 0 || Number.isNaN(Number(ertek)) ? 0 : Math.max(0, Math.min(1, Number(ertek) / max));
  const szog = tengelySzog(i, n);
  return { x: ket(cx + Math.cos(szog) * r * arany), y: ket(cy + Math.sin(szog) * r * arany) };
}
function radarPoligon(ertekek, opciok) {
  return ertekek.map((e, i) => e === null || e === void 0 ? null : radarPont(i, ertekek.length, e, opciok)).filter((p) => p !== null).map((p) => `${p.x},${p.y}`).join(" ");
}
function cimkeIgazitas(i, n) {
  const c = Math.cos(tengelySzog(i, n));
  if (Math.abs(c) < 0.2) return "middle";
  return c > 0 ? "start" : "end";
}
function cimkeTordeles(szoveg, max, sorok = 3) {
  const m = Math.max(4, Math.floor(max));
  const ki = [];
  let cur = "";
  for (let w of String(szoveg).trim().split(/\s+/).filter(Boolean)) {
    while (w.length > m) {
      if (cur) {
        ki.push(cur);
        cur = "";
      }
      ki.push(`${w.slice(0, m - 1)}-`);
      w = w.slice(m - 1);
    }
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= m) cur += ` ${w}`;
    else {
      ki.push(cur);
      cur = w;
    }
  }
  if (cur) ki.push(cur);
  if (ki.length > sorok) {
    const v = ki.slice(0, sorok);
    v[sorok - 1] = `${v[sorok - 1].replace(/-$/, "").slice(0, m - 1)}\u2026`;
    return v;
  }
  return ki;
}

export {
  tengelySzog,
  radarPont,
  radarPoligon,
  cimkeIgazitas,
  cimkeTordeles
};
