/* ============ Pontskála ============ */
function renderDotscale(st, grid, rows){
  const errs = [];
  if (st.sort) rows = [...rows].sort((a,b) => b.value - a.value);
  const n = Math.max(rows.length, 1);
  const H = grid.offsetHeight - 40;
  const rowH = Math.min(110, H / n);
  const P = $("poster").style;
  P.setProperty("--labw", "230px"); P.setProperty("--dsh", rowH + "px");
  P.setProperty("--dsfs", Math.max(21, Math.min(32, rowH * .48)) + "px"); P.setProperty("--dsd", Math.max(34, Math.min(74, rowH * .82)) + "px");
  const vals = rows.map(r => r.value);
  const max = Math.max(...vals, 1e-9), min = Math.min(...vals);
  let pos, ticks = [];
  if (st.log) {
    if (min <= 0) { errs.push("Logaritmikus skálán nem lehet 0 vagy negatív érték."); return errs; }
    const lo = Math.pow(10, Math.floor(Math.log10(min))), hi = Math.pow(10, Math.ceil(Math.log10(max)));
    pos = v => (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)) * 100;
    for (let d = lo; d <= hi * 1.0001; d *= 10) ticks.push(d);
  } else {
    const step = niceStep(max), top = Math.ceil(max / step) * step;
    pos = v => v / top * 100;
    for (let t = 0; t <= top + 1e-9; t += step) ticks.push(t);
  }
  const tickHtml = ticks.map((t, i) => `<span class="${i === 0 ? "first" : ""}" style="left:${pos(t)}%">${fmtNum(t)}${i === ticks.length - 1 ? " " + esc(st.unit) : ""}</span>`).join("");
  const lines = ticks.map((t, i) => `<div class="gl ${i === 0 ? "zero" : ""}" style="left:calc(var(--labw) + (100% - var(--labw)) * ${pos(t) / 100})"></div>`).join("");
  const rowHtml = rows.map((r, i) => { const x = pos(r.value);
    return `<div class="dsr"><div class="lab">${esc(r.label)}</div><div class="dstr">
      <div class="dsl" style="width:${x}%"></div>
      <div class="dsd" style="left:${x}%;background:${col(r.p[2], i)}">${esc(r.p[3] || "")}</div>
      <span class="dsv" style="${x > 82 ? `left:calc(${x}% - var(--dsd) * .5 - 12px);color:var(--w);transform:translate(-100%,-50%)` : `left:calc(${x}% + var(--dsd) * .5 + 12px)`}">${fmtNum(r.value)}</span>
    </div></div>`; }).join("");
  grid.innerHTML = `<div class="ds"><div class="axis"><div></div><div class="ticks">${tickHtml}</div></div><div class="dsrows">${lines}${rowHtml}</div></div>`;
  if (rows.length > 12) errs.push("12-nél több sor már zsúfolt.");
  if (st.log) errs.push("Logaritmikus skála: írd ki az alcímben is, különben félrevezető!");
  return errs;
}

