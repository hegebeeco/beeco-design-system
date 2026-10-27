/* ============ Fánk ============ */
function arc(cx, cy, r0, r1, a0, a1){
  const p = (r, a) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0,y0] = p(r1,a0), [x1,y1] = p(r1,a1), [x2,y2] = p(r0,a1), [x3,y3] = p(r0,a0);
  return `M${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
}
function renderDonut(st, grid, rows){
  const total = rows.reduce((s,r) => s + r.value, 0) || 1;
  const H = grid.offsetHeight, W = grid.offsetWidth;
  const size = Math.min(H, W * 0.55);
  const R = 260, r0 = 140, C = 280;
  let a = 0, paths = "", icons = "";
  rows.forEach((r, i) => {
    const sw = r.value / total * Math.PI * 2, mid = a + sw / 2;
    paths += `<path d="${arc(C, C, r0, R, a, a + sw)}" fill="${col(r.p[2], i)}" stroke="#14180F" stroke-width="5" stroke-linejoin="round"/>`;
    if (r.p[3] && sw > 0.42) {
      const rr = (R + r0) / 2;
      icons += `<span class="dico" style="left:${(C + rr * Math.sin(mid)) / (2*C) * 100}%;top:${(C - rr * Math.cos(mid)) / (2*C) * 100}%">${esc(r.p[3])}</span>`;
    }
    a += sw;
  });
  const [big, small] = (st.center || "").split("|").map(s => s.trim());
  const P = $("poster").style;
  const n = rows.length;
  P.setProperty("--dbig", size * .17 + "px"); P.setProperty("--dsmall", Math.max(18, size * .052) + "px");
  P.setProperty("--dicos", size * .13 + "px");
  P.setProperty("--pfs", (n > 5 ? 24 : 27) + "px"); P.setProperty("--pvfs", (n > 5 ? 30 : 36) + "px");
  P.setProperty("--pgap", Math.min(26, (H - n * 40) / Math.max(n - 1, 1)) + "px");
  const list = rows.map((r, i) => `<div class="pitem ${/x/i.test(r.p[4] || "") ? "hl" : ""}"><i style="background:${col(r.p[2], i)}"></i><b>${esc(r.label)}</b><em>${fmtNum(r.value)}${esc(st.unit)}</em></div>`).join("");
  grid.innerHTML = `<div class="donutwrap"><div class="donut" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 ${2*C} ${2*C}">${paths}</svg>${icons}
      ${big ? `<div class="dcenter"><b>${esc(big)}</b>${small ? `<span>${esc(small)}</span>` : ""}</div>` : ""}
    </div><div class="plist">${list}</div></div>`;
  const errs = [];
  if (Math.abs(total - 100) > 1.5 && st.unit.trim() === "%") errs.push(`Az értékek összege ${fmtNum(total)}%, nem 100% – ellenőrizd az adatokat.`);
  if (n > 7) errs.push("7-nél több szelet olvashatatlan – vond össze a kicsiket „Egyéb”-be.");
  return errs;
}

