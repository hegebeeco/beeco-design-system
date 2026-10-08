/* ============================================================
   beeco docs – átirányítások a régi Brand Book címeiről (tools/brandbook-build.js, 27 oldal) az új két oldalra

   Forrás: docs-site/leltar.json (régi fejezet → szakaszonként új oldal). Egy régi oldal oda megy, ahová a szakaszai
   többsége (a régi fejezet „cel” mezőinek leggyakoribbja az adott oldalon). Nincs kitalált alias: ha a leltár célja
   nincs a nav.json-ban, az hiba (a leltárt vagy a navot kell javítani).
   • Kész cél → 301. Ha a cél még tervezett (nincs kész oldal), ideiglenesen a csoport első kész oldalára, végül a
     kezdőlapra megy 302-vel – így nincs 404, és a kész oldal után a 301 magától beáll.
   • _site/brand/_redirects: a brand-célok, és – ha a DOCS_DS_URL abszolút cím – a DS-célok is (külső 301).
   • _site/ds/_redirects: a régi DS-tartalmú címek a DS-en belül (ha valaki a régi útvonalat a DS címével nyitja).
   ============================================================ */
'use strict';
const A = require('./alap');

// A régi kimenet oldalai, amelyek nincsenek a leltárban (aloldalak, segédoldalak) → melyik régi fejezet szerint menjenek
const ALOLDAL = {
  'felulet-admin': 'feluletek', 'felulet-partner': 'feluletek', 'felulet-app': 'feluletek', 'felulet-kaptar': 'feluletek', 'felulet-web': 'feluletek', 'felulet-jatek': 'feluletek',
  'elemek-atom': 'elemek', 'elemek-molekula': 'elemek', 'elemek-organizmus': 'elemek', 'elemek-sablon': 'elemek',
};
// a régi felület-aloldal a DS felületoldal horgonyára (a „felulet” gen-blokk id-je: felulet-<id>)
const HORGONY = Object.fromEntries(Object.keys(ALOLDAL).filter(k => k.startsWith('felulet-')).map(k => [k, `#${k}`]));
// a régi szint-oldalak (elemek-atom …) az áttekintő „Szintek” szakaszára
for (const k of Object.keys(ALOLDAL).filter(k => k.startsWith('elemek-'))) HORGONY[k] = '#szintek';
// ezek az új oldalakon is ugyanígy élnek (nem kell átirányítani)
const UGYANAZ = ['index', 'kereses', '404', 'belepes'];

/** @param {{ brand: {kesz:Set, tervezett:Set, nav}, ds: {...} }} oldalak  @returns {{ brand: string[][], ds: string[][], hibak: string[], jegyzet: string[] }} */
function atiranyitasok(oldalak, dsUrl, site0, vanHorgony = () => false) {
  const hibak = [], jegyzet = [];
  const leltar = A.json('docs-site/leltar.json');
  const cel = {};   // régi fejezet → [site, slug]
  for (const f of leltar.fejezetek) {
    const szam = {};
    for (const s of f.szakaszok) {
      if (s.muvelet === 'kivesz') continue;
      for (const c of String(s.cel).split('+')) { const m = c.match(/^(brand|ds)\/([a-z0-9-]+)(?:-\*)?$/); if (m) { const k = `${m[1]}/${m[2]}`; szam[k] = (szam[k] || 0) + (s.blokkok ? s.blokkok[1] - s.blokkok[0] + 1 : 1); } }
    }
    const leg = Object.entries(szam).sort((a, b) => b[1] - a[1])[0];
    if (!leg) { hibak.push(`leltar.json: ${f.regi}: nincs feloldható cél`); continue; }
    let [site, slug] = leg[0].split('/');
    if (f.regi === 'index') { site = 'brand'; slug = 'index'; }
    if (slug === 'komponens') slug = 'komponensek';   // „ds/komponens-*” = a komponensoldalak; az áttekintő a cél
    cel[f.regi] = [site, slug];
  }
  const feloldas = (site, slug) => {
    const o = oldalak[site];
    if (o.kesz.has(slug)) return { slug, kod: 301 };
    if (!o.tervezett.has(slug)) { hibak.push(`átirányítás: a leltár célja (${site}/${slug}) nincs a ${site} nav.json-jában – a leltárt vagy a navot javítsd`); }
    const cs = o.nav.csoportok.find(c => c.oldalak.some(x => x.slug === slug || (x.gyerekek || []).some(g => g.slug === slug)));
    const elso = cs && cs.oldalak.find(x => o.kesz.has(x.slug));
    const tart = elso ? elso.slug : 'index';
    jegyzet.push(`${site}/${slug} még nincs kész → ideiglenesen ${site}/${tart} (302)`);
    return { slug: tart, kod: 302 };
  };
  const regiOldalak = [...leltar.fejezetek.map(f => f.regi), ...Object.keys(ALOLDAL)].filter(r => !UGYANAZ.includes(r));
  const brand = [], ds = [];
  const kulso = /^https?:\/\//.test(dsUrl || '') ? dsUrl.replace(/[^/]*\.html$/, '').replace(/\/?$/, '/') : null;
  for (const r of regiOldalak) {
    const c = cel[ALOLDAL[r] || r];
    if (!c) continue;
    const [site, slug] = c;
    const f = feloldas(site, slug);
    // horgony csak akkor, ha a kész céloldalon tényleg van ilyen id (pl. a „felulet” gen-blokk felulet-<id>-je)
    const h = f.kod === 301 && HORGONY[r] && vanHorgony(site, f.slug, HORGONY[r].slice(1)) ? HORGONY[r] : '';
    const ugyanott = f.slug === r && !h;   // ugyanazon a címen él tovább: nem kell átirányítás (a saját oldalon)
    if (site === 'brand') { if (!ugyanott) brand.push([`/${r}.html`, `/${f.slug}.html${h}`, f.kod]); }
    else {
      if (!ugyanott) ds.push([`/${r}.html`, `/${f.slug}.html${h}`, f.kod]);
      if (kulso) brand.push([`/${r}.html`, `${kulso}${f.slug}.html${h}`, f.kod]);
      else if (site0 === 'brand') jegyzet.push('a régi DS-tartalmú címek (alapok, borok, feluletek, felulet-*, elemek, elemek-*) a Brand Book _redirects-be csak abszolút DOCS_DS_URL mellett kerülnek – a DS-en belül: _site/ds/_redirects');
    }
  }
  // a régi kimenet „ds/…” tükre (letöltési linkek) → a DS tükre, ha ismert a DS címe
  if (kulso) brand.push(['/ds/*', `${kulso}repo/:splat`, 301]);
  return { brand, ds, hibak, jegyzet: [...new Set(jegyzet)] };
}
const redirectsFajl = (sorok, cim) => `# GENERÁLT (tools/docs/atiranyitas.js) – ${cim}. Forrás: docs-site/leltar.json. Ne szerkeszd kézzel.\n`
  + sorok.map(([r, u, k]) => `${r}  ${u}  ${k}`).join('\n') + '\n';

module.exports = { atiranyitasok, redirectsFajl, ALOLDAL };
