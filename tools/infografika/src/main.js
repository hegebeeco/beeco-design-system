/* Indítás és eseménykezelők */
fillForm(load());
// a fajta váltásakor az új lista első figurája jön (még a közös render előtt)
$("f-kind").addEventListener("input", e => setFigure(FIGURES[e.target.value][0].id));
document.querySelectorAll(".panel input, .panel textarea, .panel select:not(#f-preset)").forEach(el => el.addEventListener("input", render));
$("f-preset").addEventListener("change", e => {
  const p = PRESETS[e.target.value]; if (!p) return;
  fillForm({...p, fmt: $("f-fmt").value, figure: p.figure || $("f-figure").value}); e.target.value = ""; render();
  $("status").textContent = "Minta betöltve.";
});
$("btn-png").addEventListener("click", exportPng);
$("btn-json").addEventListener("click", copyJson);
window.addEventListener("resize", () => { render(); });
document.fonts && document.fonts.ready.then(render);
render();
getDownloads();
