/* ============ Összehasonlítás ============ */
function renderCompare(st, grid, rows){
  const errs = [];
  if (rows.length !== 2) errs.push("Az összehasonlításhoz pontosan 2 sor kell.");
  rows = rows.slice(0, 2);
  if (rows.length < 2) { grid.innerHTML = ""; return errs; }
  const u0 = (rows[0].p[2] || "").replace(/\s*\/.*$/, ""), u1 = (rows[1].p[2] || "").replace(/\s*\/.*$/, "");
  if (u0 !== u1) errs.push(`Eltérő mértékegység („${u0}” vs. „${u1}”) – így a két oszlop nem összevethető.`);
  const H = grid.offsetHeight;
  const P = $("poster").style;
  P.setProperty("--cfs", H > 800 ? "36px" : "30px"); P.setProperty("--cicos", Math.min(130, H * .16) + "px");
  P.setProperty("--cvfs", H > 800 ? "54px" : "44px");
  // a fejléc magasságát a leghosszabb címhez mérjük, hogy a két oszlop alja egy vonalba essen
  const max = Math.max(...rows.map(r => r.value));
  const head = 130, iconH = Math.min(130, H * .16);
  const avail = Math.max(120, H - head - iconH - 20);
  const cols = rows.map((r, i) => {
    const h = Math.max(10, r.value / max * avail);
    const inside = h >= 120;
    const val = `<div class="cval"><b>${fmtNum(r.value)}</b><span>${esc(r.p[2] || "")}</span></div>`;
    return `<div class="ccol">
      <div style="height:${head}px;display:flex;flex-direction:column;align-items:center"><h3>${esc(r.label)}</h3>${r.p[4] ? `<div class="cnote">${esc(r.p[4])}</div>` : ""}</div>
      <div class="cstack">
        ${inside ? "" : `<div class="cout">${val}</div>`}
        ${r.p[3] ? `<div class="cico">${esc(r.p[3])}</div>` : ""}
        <div class="cbarw" style="height:${h}px"><div class="cbarsh"></div><div class="cbar ${i ? "b" : "a"}" style="height:${h}px">${inside ? val : ""}</div></div>
      </div></div>`;
  });
  const big = rows[0].value >= rows[1].value ? 0 : 1, ratio = rows[big].value / Math.max(rows[1-big].value, 1e-9);
  grid.innerHTML = `<div class="cmp"><div class="divider"></div>${cols.join("")}
    <div class="ratio" style="--rtop:${head + 50}px"><div class="face"><b>kb. ${fmtNum(Math.round(ratio * 10) / 10)}×</b>${big === 0 ? "← ennyivel több" : "ennyivel több →"}</div></div></div>`;
  return errs;
}

