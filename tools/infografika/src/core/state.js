/* ============ Állapot ============ */
function load(){
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch(e) {}
  return Object.assign({}, PRESETS.drawdown, s || {});
}
function save(st){ try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch(e) {} }
function readForm(){ const st = {}; for (const k in fields) st[k] = $(fields[k]).value; st.sort = $("f-sort").checked; st.log = $("f-log").checked; st.figure = $("f-figure").value || DEFAULT_FIGURE; return st; }
function fillForm(st){ for (const k in fields) $(fields[k]).value = st[k] ?? ""; $("f-sort").checked = !!st.sort; $("f-log").checked = !!st.log; setFigure(st.figure); }
// A figura: a fajta (méh/madár) a figura azonosítójából következik, csak a választó listáját szűri.
function setFigure(id){
  const fig = findFigure(id), kind = figureKind(fig.id);
  $("f-kind").value = kind;
  $("f-figure").innerHTML = FIGURES[kind].map(f => `<option value="${f.id}">${esc(f.label)}</option>`).join("");
  $("f-figure").value = fig.id;
}
