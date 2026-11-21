/* ============ Mozaik (squarified treemap) ============ */
function squarify(items, x, y, w, h){
  const out = [], rect = {x, y, w, h};
  const worst = (row, len) => { const s = row.reduce((a,b) => a + b.area, 0), mx = Math.max(...row.map(r => r.area)), mn = Math.min(...row.map(r => r.area));
    return Math.max(len*len*mx/(s*s), (s*s)/(len*len*mn)); };
  let row = [];
  const place = () => {
    const s = row.reduce((a,b) => a + b.area, 0);
    if (rect.w >= rect.h) { const cw = s / rect.h; let yy = rect.y;
      row.forEach(r => { const hh = r.area / cw; out.push({...r, x:rect.x, y:yy, w:cw, h:hh}); yy += hh; }); rect.x += cw; rect.w -= cw; }
    else { const rh = s / rect.w; let xx = rect.x;
      row.forEach(r => { const ww = r.area / rh; out.push({...r, x:xx, y:rect.y, w:ww, h:rh}); xx += ww; }); rect.y += rh; rect.h -= rh; }
    row = [];
  };
  items.forEach(it => {
    const len = Math.min(rect.w, rect.h);
    if (row.length && worst([...row, it], len) > worst(row, len)) place();
    row.push(it);
  });
  if (row.length) place();
  return out;
}
function renderTreemap(st, grid, rows){
  grid.innerHTML = `<div class="tmbox"><div class="tmarea" id="tmarea"></div><div class="tmlegend" id="tmlegend"></div></div>`;
  const total = rows.reduce((s,r) => s + r.value, 0) || 1;
  const items = rows.map((r, i) => ({...r, color:col(r.p[2], i), icon:r.p[3] || ""})).sort((a,b) => b.value - a.value);
  // A kis cellák felirata a jelmagyarázatba kerül; a jelmagyarázat helyet foglal,
  // ezért addig számolunk újra, amíg a kis cellák köre nem változik.
  const area = $("tmarea");
  const small = c => c.w < 200 || c.h < 130;
  let cells = [], key = null;
  for (let pass = 0; pass < 4; pass++) {
    const W = area.offsetWidth - 10, H = area.offsetHeight - 10;
    cells = squarify(items.map(it => ({...it, area: it.value / total * W * H})), 0, 0, W, H);
    const leg = cells.filter(small), k = leg.map(c => c.label).join("|");
    if (k === key) break;
    key = k;
    $("tmlegend").innerHTML = leg.map(c => `<span><i style="background:${c.color}"></i>${esc(c.label)} ${fmtNum(c.value)}${esc(st.unit)}</span>`).join("");
  }
  const P = $("poster").style;
  P.setProperty("--tfs", "28px"); P.setProperty("--tvfs", "34px"); P.setProperty("--tes", "52px");
  const g = 5;
  area.innerHTML = cells.map(c => {
    const cls = (c.w < 130 || c.h < 90) ? "xs" : small(c) ? "sm" : "";
    const box = `left:${c.x + g}px;top:${c.y + g}px;width:${Math.max(c.w - 2*g, 4)}px;height:${Math.max(c.h - 2*g, 4)}px`;
    const shb = `left:${c.x + g + 6}px;top:${c.y + g + 6}px;width:${Math.max(c.w - 2*g, 4)}px;height:${Math.max(c.h - 2*g, 4)}px`;
    const big = !cls;
    return `<div class="tsh" style="${shb}"></div><div class="tc ${cls}" style="${box};background:${c.color}">
      ${c.icon && (big || cls === "sm") ? `<span class="te" style="${big ? "" : "font-size:34px"}">${esc(c.icon)}</span>` : ""}
      <b>${esc(c.label)}</b><em style="${big ? "" : "font-size:24px"}">${fmtNum(c.value)}${esc(st.unit)}</em></div>`;
  }).join("");
  const errs = [];
  if (Math.abs(total - 100) > 1.5 && st.unit.trim() === "%") errs.push(`Az értékek összege ${fmtNum(total)}%, nem 100% – ellenőrizd az adatokat.`);
  return errs;
}

