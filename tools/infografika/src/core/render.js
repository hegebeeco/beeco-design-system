/* ============ Fő renderelés ============ */
function render(){
  const st = readForm(); save(st);
  const poster = $("poster");
  poster.className = "poster " + st.fmt;
  document.querySelectorAll(".only-bar, .only-dot").forEach(el => el.style.display = (el.classList.contains("only-bar") && st.type === "bar") || (el.classList.contains("only-dot") && st.type === "dotscale") ? "" : "none");
  document.querySelectorAll(".row2.only-bar").forEach(el => el.style.display = st.type === "bar" ? "" : "none");
  document.querySelectorAll(".only-donut").forEach(el => el.style.display = st.type === "donut" ? "" : "none");
  document.querySelectorAll(".not-compare").forEach(el => el.style.display = (st.type === "compare" || st.type === "bigstat") ? "none" : "");
  $("data-hint").innerHTML = TYPE_HINTS[st.type];
  $("p-title").innerHTML = esc(st.title).replace(/\*(.+?)\*/g, '<span class="hl">$1</span>');
  $("p-sub").textContent = st.sub;
  $("p-bubble").textContent = st.bubble;
  $("p-bubblewrap").style.visibility = st.bubble.trim() ? "" : "hidden";
  $("p-src").textContent = st.src;
  renderFigure(st);
  const legend = $("p-legend");
  legend.classList.toggle("hide", st.type !== "bar");
  legend.innerHTML = `<span><i style="background:var(--y)"></i>${esc(st.ca)}</span>` + (st.cb.trim() ? `<span><i style="background:var(--w)"></i>${esc(st.cb)}</span>` : "");

  const {rows, errs} = parseLines(st.data);
  const grid = $("p-grid");
  grid.innerHTML = "";
  const R = {bar:renderBar, donut:renderDonut, treemap:renderTreemap, compare:renderCompare, bigstat:renderBigstat, icongrid:renderIcongrid, dotscale:renderDotscale}[st.type];
  errs.push(...R(st, grid, rows));
  // a hosszú buborékszöveg felfelé nő, és rálóghat a diagramra (az árnyékával együtt mérve)
  const chartBottom = Math.max(poster.querySelector(".chart").getBoundingClientRect().bottom, poster.querySelector(".chart > .sh").getBoundingClientRect().bottom);
  if (st.bubble.trim() && $("p-bubblewrap").getBoundingClientRect().top < chartBottom) errs.push("A buborék szövege túl hosszú: rálóg a diagramra. Rövidítsd!");
  $("errors").textContent = errs.join("\n");

  const H = HEIGHTS[st.fmt];
  const fp = {
    f45:"M 220 1150 C 40 1040, 20 700, 40 520 S 120 330, 60 210 S 20 70, 150 40",
    f11:"M 190 900 C 30 820, 20 560, 36 430 S 110 280, 50 190 S 20 70, 150 36",
    f916:"M 240 1650 C 40 1500, 20 1000, 40 760 S 120 470, 60 330 S 20 110, 160 70"
  }[st.fmt];
  $("flight").setAttribute("viewBox", `0 0 1080 ${H}`);
  $("flightpath").setAttribute("d", fp);
  fit();
}
// Arányos méret a formátum dobozában – kiírt szélesség/magasság, mert a html2canvas nem ismeri az object-fit-et.
function renderFigure(st){
  const fig = findFigure(st.figure), kind = figureKind(fig.id), [bw, bh] = FIGURE_BOX[st.fmt];
  const w = Math.min(bw, bh * fig.w / fig.h), h = w * fig.h / fig.w;
  const img = $("p-figure");
  if (img.getAttribute("src") !== fig.src) img.setAttribute("src", fig.src);
  img.style.width = w + "px"; img.style.height = h + "px";
  $("poster").style.setProperty("--figw", w + "px");
  $("l-figure").textContent = FIGURE_LABELS[kind].pick;
  $("l-bubble").textContent = FIGURE_LABELS[kind].bubble;
}
function fit(){
  const stage = $("stage"), sc = $("scaler"), H = HEIGHTS[$("f-fmt").value];
  const pad = window.innerWidth <= 860 ? 32 : 56;
  const availW = stage.clientWidth - pad;
  const availH = window.innerWidth <= 860 ? Infinity : stage.clientHeight - pad;
  const s = Math.min(1, availW / 1080, availH / H);
  sc.style.transform = `scale(${s})`;
  sc.style.width = 1080 * s + "px"; sc.style.height = H * s + "px";
}

