/* ============ Ikonrács ============ */
function renderIcongrid(st, grid, rows){
  const errs = [];
  const total = rows.reduce((s,r) => s + Math.round(r.value), 0);
  if (total !== 100) errs.push(`A darabszámok összege ${total}, nem 100 – a rács 100 cellás.`);
  const H = grid.offsetHeight, W = grid.offsetWidth;
  const size = Math.min(H, W * 0.56);
  const P = $("poster").style;
  P.setProperty("--igc", 10); P.setProperty("--iggap", Math.round(size / 90) + "px"); P.setProperty("--igfs", size / 10 * .5 + "px");
  let cells = "";
  rows.forEach((r, i) => {
    const c = col(r.p[2], i), rest = (r.p[2] || "").toLowerCase() === "f";
    for (let k = 0; k < Math.round(r.value) && k < 100; k++)
      cells += `<div class="igc ${rest ? "rest" : ""}" style="${rest ? "" : `background:${c}`}">${r.p[3] ? `<span>${esc(r.p[3])}</span>` : ""}</div>`;
  });
  const list = rows.map((r, i) => { const rest = (r.p[2] || "").toLowerCase() === "f";
    return `<div class="${rest ? "rest" : ""}"><i style="background:${rest ? "transparent;border-color:rgba(252,234,152,.6)" : col(r.p[2], i)}"></i><div><b>${fmtNum(r.value)}${esc(st.unit)}</b><span>${esc(r.label)}</span></div></div>`; }).join("");
  grid.innerHTML = `<div class="ig"><div class="igg" style="width:${size}px">${cells}</div><div class="iglist">${list}</div></div>`;
  return errs;
}

