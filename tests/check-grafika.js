#!/usr/bin/env node
/* ============================================================
   check-grafika – a grafikai katalógus (grafika/katalogus.json, Javaslat 28) őre
   - minden tételnek van id-je (kebab-case, egyedi), családja, hu és en neve, licence, eredete, állapota;
   - a web-alias (a repóban lévő fájl) létezik, és egy fájl csak egy tételhez tartozik;
   - az apiKey (az app profilkép-enumja, backend-szerződés) egyedi, és pontosan a grafika/api-kulcsok.json befagyasztott listája:
     érték nem tűnhet el, nem nevezhető át, új csak a listába felvéve jöhet;
   - a tokens/hangnem.json minden szerep-képe és tiltott képe feloldható a katalógusból, és fordítva: a katalógusban csak
     létező szerep áll, egy szerep egy tételé; a tiltott tétel forbidden: true, nincs szerepe és nincs kimenete;
   - ha van infografika-generátor (tools/infografika/src/figures.js), a figurái a katalógusban vannak, és nem tiltottak
     (ha a fájl megvan, de egy figurát sem talál benne, az is hiba: valószínűleg megváltozott a formátuma).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const hibak = [];
const hiba = m => hibak.push(m);

const FAMILIES = ['bee', 'bee-role', 'gabee', 'bird-madarka', 'bird-robin', 'bird-species', 'sticker', 'icon', 'art', 'ill', 'logo'];
const LICENSES = ['beeco-marka', 'nyilvanos', 'harmadik-fel', 'mi-generalt'];
const ORIGINS = ['illusztrator', 'figma', 'kod', 'madargyar', 'mi'];
const STATUSES = ['aktiv', 'kivezetendo', 'csak-api'];
const OUTPUTS = ['flutter', 'web', 'infografika', 'figma', 'webflow'];

const items = JSON.parse(rd('grafika/katalogus.json')).items || [];
if (!items.length) hiba('grafika/katalogus.json: nincs egy tétel sem');

const byId = new Map();
const byWeb = new Map();
const byApi = new Map();
for (const it of items) {
  const id = it.id || '(id nélkül)';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) hiba(`${id}: az id kisbetűs kebab-case legyen`);
  if (byId.has(id)) hiba(`${id}: ismétlődő id`);
  byId.set(id, it);
  if (!FAMILIES.includes(it.family)) hiba(`${id}: ismeretlen család „${it.family}”`);
  if (!it.hu) hiba(`${id}: hiányzik a magyar név (hu)`);
  if (typeof it.en !== 'string') hiba(`${id}: hiányzik az en mező (lehet üres, ha még nincs angol név)`);
  if (!LICENSES.includes(it.license)) hiba(`${id}: ismeretlen licenc „${it.license}”`);
  if (!it.origin || !ORIGINS.includes(it.origin.kind)) hiba(`${id}: ismeretlen vagy hiányzó eredet (origin.kind)`);
  if (it.license === 'mi-generalt' && it.origin && it.origin.kind !== 'mi') hiba(`${id}: MI-licencű tétel eredete is „mi” legyen`);
  if (!STATUSES.includes(it.status)) hiba(`${id}: ismeretlen állapot „${it.status}”`);
  for (const o of it.outputs || []) if (!OUTPUTS.includes(o)) hiba(`${id}: ismeretlen kimenet „${o}”`);
  const a = it.aliases || {};
  if (a.web) {
    if (!fs.existsSync(path.join(ROOT, a.web))) hiba(`${id}: a web-alias fájlja nincs meg: ${a.web}`);
    if (byWeb.has(a.web)) hiba(`${id}: a ${a.web} már a(z) ${byWeb.get(a.web)} tételé`);
    byWeb.set(a.web, id);
  }
  if (a.apiKey) {
    if (!/^[A-Z0-9_]+$/.test(a.apiKey)) hiba(`${id}: az apiKey a backend-enum értéke, nagybetűs (${a.apiKey})`);
    if (byApi.has(a.apiKey)) hiba(`${id}: az apiKey ${a.apiKey} már a(z) ${byApi.get(a.apiKey)} tételé`);
    byApi.set(a.apiKey, id);
  }
  if (it.forbidden && (it.outputs || []).length) hiba(`${id}: tiltott tételnek nem lehet kimenete`);
  if (it.forbidden && (it.roles || []).length) hiba(`${id}: tiltott tételnek nem lehet szerepe`);
}

// A profilkép-értékek befagyasztott listája (backend-szerződés)
const fagyott = new Set(JSON.parse(rd('grafika/api-kulcsok.json')).apiKeys || []);
for (const k of fagyott) if (!byApi.has(k)) hiba(`apiKey ${k}: eltűnt vagy átnevezték a katalógusban (grafika/api-kulcsok.json) – backend-szerződés, nem szabad`);
for (const [k, id] of byApi) if (!fagyott.has(k)) hiba(`${id}: az apiKey ${k} nincs a grafika/api-kulcsok.json listában (új backend-érték? vedd fel oda is)`);

// tokens/hangnem.json: a szerepek képei és a tiltott képek a web-aliasra képeződnek (pl. bee-happy, moods/help)
const webKep = kep => `web/assets/brand/${kep}.webp`;
const hang = JSON.parse(rd('tokens/hangnem.json'));
for (const [szerep, v] of Object.entries(hang.szerepek || {})) {
  const id = byWeb.get(webKep(v.kep));
  if (!id) { hiba(`hangnem ${szerep}: a „${v.kep}” kép nincs a katalógusban`); continue; }
  if (!(byId.get(id).roles || []).includes(szerep)) hiba(`${id}: a roles-ból hiányzik a(z) „${szerep}” szerep (tokens/hangnem.json)`);
}
const szerepGazda = new Map();
for (const it of items) for (const sz of it.roles || []) {
  if (!(hang.szerepek || {})[sz]) hiba(`${it.id}: a „${sz}” szerep nincs a tokens/hangnem.json-ban`);
  if (szerepGazda.has(sz)) hiba(`a „${sz}” szerep két tételé: ${szerepGazda.get(sz)} és ${it.id}`);
  szerepGazda.set(sz, it.id);
}
for (const kep of hang.tiltott_kepek || []) {
  const id = byWeb.get(webKep(kep));
  if (!id) hiba(`hangnem tiltott kép „${kep}”: nincs a katalógusban`);
  else if (!byId.get(id).forbidden) hiba(`${id}: a tokens/hangnem.json tiltja, a katalógusban is forbidden: true kell`);
}

// Az infografika-generátor figurái (ha a generátor már a repóban van)
const FIG = 'tools/infografika/src/figures.js';
let figurak = 0;
if (fs.existsSync(path.join(ROOT, FIG))) {
  for (const m of rd(FIG).matchAll(/src:"\.\.\/\.\.\/([^"]+)"/g)) {
    figurak++;
    const id = byWeb.get(m[1]);
    if (!id) hiba(`infografika: a ${m[1]} figura nincs a katalógusban`);
    else if (byId.get(id).forbidden) hiba(`infografika: tiltott figura (${id})`);
  }
  if (!figurak) hiba(`${FIG}: egy figurát sem találtam (src:"../../…" formában) – változott a formátum? Igazítsd az őrt is.`);
}

if (hibak.length) { console.log(`check-grafika: ${hibak.length} hiba\n- ` + hibak.join('\n- ')); process.exit(1); }
const csalad = items.reduce((m, it) => (m[it.family] = (m[it.family] || 0) + 1, m), {});
console.log(`check-grafika: rendben – ${items.length} tétel (${Object.entries(csalad).map(([k, v]) => `${k} ${v}`).join(', ')}), `
  + `${byApi.size} apiKey, ${Object.keys(hang.szerepek || {}).length} hangnem-szerep feloldva` + (figurak ? `, ${figurak} infografika-figura` : ''));
