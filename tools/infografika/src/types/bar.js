/* ============ Rangsor ============ */
function renderBar(st, grid, rows){
  rows = rows.map(r => ({...r, rank:r.p[2] || "", cat:((r.p[3]||"a").toLowerCase() === "b" || (r.p[3]||"").toLowerCase() === st.cb.trim().toLowerCase()) ? "b" : "a", icon:r.p[4] || ""}));
  if (st.sort) rows.sort((a,b) => b.value - a.value);
  const max = Math.max(1, ...rows.map(r => r.value)), step = niceStep(max), top = Math.ceil(max / step) * step;
  const slot = grid.offsetHeight / Math.max(rows.length, 1);
  const barh = Math.max(44, Math.min(96, slot * 0.5));
  const P = $("poster").style;
  P.setProperty("--barh", barh + "px"); P.setProperty("--labw", "300px");
  P.setProperty("--lfs", (barh > 80 ? 30 : 25) + "px"); P.setProperty("--vfs", Math.min(46, barh * .42) + "px");
  P.setProperty("--icos", Math.min(78, barh * .72) + "px");
  const pct = v => v / top * 100;
  let ticks = "", lines = "";
  for (let t = 0; t <= top + 1e-9; t += step) {
    ticks += `<span class="${t === 0 ? "first" : ""}" style="left:${pct(t)}%">${fmtNum(t)}${t >= top - 1e-9 ? " " + esc(st.unit) : ""}</span>`;
    lines += `<div class="gl ${t === 0 ? "zero" : ""}" style="left:calc(var(--labw) + (100% - var(--labw)) * ${pct(t) / 100})"></div>`;
  }
  const rowHtml = rows.map(r => {
    const w = pct(r.value), inside = w > 34, val = fmtNum(r.value);
    return `<div class="r">
      <div class="lab"><b>${esc(r.label)}</b>${r.rank ? `<span class="rank ${/^#?1(\D|$)/.test(r.rank) ? "top" : ""}">${esc(r.rank)}</span>` : ""}</div>
      <div class="track">
        <div class="barsh" style="width:${w}%"></div>
        <div class="bar ${r.cat}${r.icon ? " hasico" : ""}" style="width:${w}%">${inside ? `<span class="val in">${val}</span>` : ""}</div>
        ${inside ? "" : `<span class="val out" style="left:calc(${w}% + ${r.icon ? "var(--icos) * 1.05 + 22px" : "22px"})">${val}</span>`}
        ${r.icon ? `<span class="ico" style="left:${inside ? `${w}%` : `calc(${w}% + var(--icos) * .55 + 6px)`}">${esc(r.icon)}</span>` : ""}
      </div></div>`;
  }).join("");
  grid.innerHTML = `<div class="axis"><div></div><div class="ticks">${ticks}</div></div><div class="rows">${lines}${rowHtml}</div>`;
  return rows.length > 7 ? ["7-nél több sor már zsúfolt – bontsd két infografikára."] : [];
}

