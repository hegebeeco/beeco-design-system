/* ============ Export ============ */
let downloadsPromise = null;
function getDownloads(){
  if (!downloadsPromise) downloadsPromise = (window.claude && window.claude.use) ? window.claude.use("downloads").catch(() => null) : Promise.resolve(null);
  return downloadsPromise;
}
const slug = s => s.replace(/\*/g,"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,50) || "infografika";
async function exportPng(){
  const status = $("status");
  if (!$("f-src").value.trim()) { status.textContent = "Adj meg forrást mentés előtt – forrás nélkül nem publikálunk számot."; return; }
  status.textContent = "Kép készítése…";
  try {
    await document.fonts.ready;
    const canvas = await html2canvas($("poster"), {scale:1, backgroundColor:null, useCORS:true,
      onclone: doc => { doc.getElementById("scaler").style.transform = "none"; }});
    const blob = await new Promise(r => canvas.toBlob(r, "image/png"));
    const filename = `beeco-${slug($("f-title").value)}-${$("f-fmt").value.slice(1)}.png`;
    const dl = await getDownloads();
    if (dl) { await dl.save({filename, data: blob}); status.textContent = "Elmentve: " + filename; }
    else { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); status.textContent = "Letöltés elindítva: " + filename; }
  } catch (e) {
    status.textContent = e && e.code === "declined" ? "A mentést megszakítottad." : "Nem sikerült a mentés: " + (e && e.message ? e.message : e);
  }
}
async function copyJson(){
  try { await navigator.clipboard.writeText(JSON.stringify(readForm(), null, 2)); $("status").textContent = "Az adatok a vágólapon – beillesztheted Claude-nak vagy egy fájlba."; }
  catch(e){ $("status").textContent = "A vágólap nem érhető el ebben a nézetben."; }
}

