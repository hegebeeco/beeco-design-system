/* ============ Nagy szám + egyenérték ============ */
function renderBigstat(st, grid, rows){
  const errs = [];
  if (!rows.length) { grid.innerHTML = ""; return ["Legalább 1 sor kell (a fő szám)."]; }
  const [m, ...eq] = rows;
  if (eq.length > 3) errs.push("Legfeljebb 3 egyenérték fér el – a többit hagyd ki.");
  const n = fmtNum(m.value);
  const P = $("poster").style;
  P.setProperty("--bsfs", Math.min(230, 1250 / Math.max(5, n.length)) + "px");
  P.setProperty("--bsico", "190px");
  P.setProperty("--bsn", Math.max(1, Math.min(eq.length, 3)));
  grid.innerHTML = `<div class="bs">
    <div class="bs-main">${m.p[3] ? `<div class="bs-ico">${esc(m.p[3])}</div>` : ""}
      <div><div class="bs-num"><b>${n}</b><span>${esc(m.p[2] || "")}</span></div><div class="bs-lab">${esc(m.label)}</div></div></div>
    ${eq.length ? `<div class="bs-eqh">Ez annyi, mint…</div><div class="bs-cards">${eq.slice(0,3).map(r => `<div class="bs-card nb" style="--o:7px;--sc:var(--k)"><div class="sh"></div><div class="face">
      ${r.p[3] ? `<span class="e">${esc(r.p[3])}</span>` : ""}<div><b>${fmtNum(r.value)} ${esc(r.p[2] || "")}</b><span>${esc(r.label)}</span></div></div></div>`).join("")}</div>` : ""}
  </div>`;
  return errs;
}

