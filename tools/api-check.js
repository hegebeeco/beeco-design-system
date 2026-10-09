#!/usr/bin/env node
/* ============================================================
   api-check – a DS nyilvános felületének pillanatképe és a törő változás elleni őr (docs/ai-munkamod.md 4.)
   A pillanatkép (api/api.json):
     react   – a @beeco/design-system/react exportjai (dist/react/types/index.d.ts): fajta + komponensnél a saját propok (típus, kötelező-e)
     css     – termékbőr: bc-* osztályok és is-* módosítók (termek/css) · játékbőr: osztályok a kit-sync-elt web/css fájlokban
     tokenek – CSS-változók (dist/css + web/css/tokens.css), SCSS-változók/-függvények, Tailwind-kulcsok, Dart-nevek
     jatekJs – a játékok globális JS-nevei (KIT-FILES „sync” web/js fájljai) + a DS objektum tagjai
   Használat:
     node tools/api-check.js            friss-e az api/api.json + összevetés a legutóbbi v* címkével (CI)
     node tools/api-check.js --write    api/api.json újraírása + viszonyítás (a változás után; a diffet nézd át a PR-ban)
     --nincs-ellen                      viszonyítás nélkül (az npm run build így hívja)
     node tools/api-check.js --ellen v1.52.1   másik viszonyítási pont
   Szabály: eltűnt/átnevezett név vagy új KÖTELEZŐ prop → hiba, kivéve FŐ verzióemelésnél. Új név/opcionális prop → rendben.
   ============================================================ */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const API = path.join(ROOT, 'api/api.json');
const rendez = (a) => [...new Set(a)].sort();

/* ---------- 1. React: d.ts → exportok és propok ---------- */
function reactApi(root, { docs = false } = {}) {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const belepo = path.join(root, 'dist/react/types/index.d.ts');
  if (!fs.existsSync(belepo)) return {};
  const program = ts.createProgram([belepo], { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, noEmit: true, types: [] });
  const ch = program.getTypeChecker();
  const typesDir = path.join(root, 'dist/react/types') + path.sep;
  const sajat = (d) => d.getSourceFile().fileName.startsWith(typesDir);
  const modul = ch.getSymbolAtLocation(program.getSourceFile(belepo));
  const ki = {};
  const tipusSzoveg = (t) => { const s = ch.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope); return s.length > 160 ? s.slice(0, 157) + '...' : s; };
  for (const exp of ch.getExportsOfModule(modul).sort((a, b) => a.name.localeCompare(b.name))) {
    const sym = exp.flags & ts.SymbolFlags.Alias ? ch.getAliasedSymbol(exp) : exp;
    const decl = (sym.declarations || [])[0];
    const e = {};
    // feloldhatatlan export (pl. kis-/nagybetű-eltérés a fájlnévben Linuxon – így volt a v1.52.1 Timeline-ja)
    if (!decl) { ki[exp.name] = { fajta: 'ismeretlen' }; continue; }
    if (!(sym.flags & ts.SymbolFlags.Value)) { e.fajta = 'tipus'; }
    else {
      const t = ch.getTypeOfSymbolAtLocation(sym, decl);
      const sig = t.getCallSignatures()[0];
      const nagy = /^[A-Z]/.test(exp.name) && !/^[A-Z0-9_]+$/.test(exp.name);
      if (sig && nagy) {
        e.fajta = 'komponens';
        const p0 = sig.getParameters()[0];
        const props = {}; let tobb = false;
        if (p0) {
          const pt = ch.getTypeOfSymbolAtLocation(p0, decl);
          for (const p of pt.getApparentProperties()) {
            const pd = (p.declarations || [])[0];
            if (!pd || !sajat(pd)) { tobb = true; continue; }
            props[p.name] = { t: tipusSzoveg(ch.getTypeOfSymbolAtLocation(p, pd)), ...(p.flags & ts.SymbolFlags.Optional ? {} : { kotelezo: true }) };
          }
        }
        e.props = Object.fromEntries(Object.entries(props).sort(([a], [b]) => a.localeCompare(b)));
        if (tobb) e.htmlAttr = true; // a natív/könyvtári attribútumok is átmennek (pl. ...rest az <input>-ra)
      } else if (sig) e.fajta = /^use[A-Z]/.test(exp.name) ? 'hook' : 'fuggveny';
      else e.fajta = 'ertek';
    }
    if (docs && decl) {
      // JSDoc: a változó/függvény deklarációján (a d.ts megőrzi)
      const jd = ts.getJSDocCommentsAndTags(decl.kind === ts.SyntaxKind.VariableDeclaration ? decl.parent.parent : decl);
      const szoveg = jd.map((j) => typeof j.comment === 'string' ? j.comment : (j.comment || []).map((c) => c.text).join('')).join(' ').replace(/\s+/g, ' ').trim();
      if (szoveg) e.doc = szoveg;
      e.fajl = path.relative(typesDir, decl.getSourceFile().fileName).replace(/\.d\.ts$/, '');
    }
    ki[exp.name] = e;
  }
  return ki;
}

/* ---------- 2. CSS-osztályok ---------- */
const kommentNelkul = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
function osztalyok(root, fajlok, re) {
  const ki = [];
  for (const f of fajlok) { const p = path.join(root, f); if (!fs.existsSync(p)) continue;
    const s = kommentNelkul(fs.readFileSync(p, 'utf8')).replace(/url\([^)]*\)/g, '');
    for (const m of s.matchAll(re)) ki.push(m[1]); }
  return rendez(ki);
}
function kitFajlok(root, elotag, kiterjesztes) {
  const kf = path.join(root, 'KIT-FILES.json'); if (!fs.existsSync(kf)) return [];
  const ki = [];
  for (const f of JSON.parse(fs.readFileSync(kf, 'utf8')).sync.filter((x) => x.startsWith(elotag))) {
    const p = path.join(root, f);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) (function bejar(d) { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const t = path.join(d, x.name);
      if (x.isDirectory()) bejar(t); else if (t.endsWith(kiterjesztes)) ki.push(path.relative(root, t)); } })(p);
    else if (f.endsWith(kiterjesztes)) ki.push(f);
  }
  return rendez(ki);
}
function cssApi(root) {
  const termek = fs.existsSync(path.join(root, 'termek/css')) ? fs.readdirSync(path.join(root, 'termek/css')).filter((f) => f.endsWith('.css')).map((f) => `termek/css/${f}`) : [];
  const jatek = kitFajlok(root, 'web/css/', '.css');
  return {
    bc: osztalyok(root, termek, /\.(bc-[A-Za-z0-9_-]+)/g),
    is: osztalyok(root, termek, /\.(is-[A-Za-z0-9_-]+)/g),
    jatek: osztalyok(root, jatek, /\.(-?[A-Za-z_][A-Za-z0-9_-]*)(?![^{]*;)/g).filter((c) => !/^\d/.test(c)),
  };
}

/* ---------- 3. Tokenek ---------- */
function tokenApi(root) {
  const rd = (f) => (fs.existsSync(path.join(root, f)) ? fs.readFileSync(path.join(root, f), 'utf8') : '');
  const valtozok = (s, re) => rendez([...kommentNelkul(s).matchAll(re)].map((m) => m[1]));
  const tw = [];
  try {
    const p = path.join(root, 'dist/tailwind/preset.cjs'); delete require.cache[p];
    const th = require(p).theme || {};
    const lapit = (o, elo) => { for (const [k, v] of Object.entries(o)) { if (k === 'extend') continue; const n = elo ? `${elo}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v) && elo.split('.').length < 2) lapit(v, n); else tw.push(n); } };
    lapit(th, ''); if (th.extend) lapit(th.extend, '');
  } catch { /* nincs preset */ }
  const dart = []; let osztaly = null;
  for (const sor of rd('dist/dart/beeco_tokens.dart').split('\n')) {
    const c = /class (\w+)/.exec(sor); if (c) { osztaly = c[1]; continue; }
    const m = /^\s+(?:static const|final \w+) (\w+)/.exec(sor); if (m && osztaly) dart.push(`${osztaly}.${m[1]}`);
  }
  const scss = rd('dist/scss/_beeco.scss');
  return {
    css: valtozok(rd('dist/css/beeco-tokens.css'), /(--bc-[A-Za-z0-9_-]+)\s*:/g),
    jatekCss: valtozok(rd('web/css/tokens.css'), /(--[A-Za-z0-9_-]+)\s*:/g),
    scss: rendez([...valtozok(scss, /^\$([A-Za-z0-9_-]+)\s*:/gm), ...valtozok(scss, /@function ([\w-]+)/g).map((f) => `${f}()`)]),
    tailwind: rendez(tw),
    dart: rendez(dart),
  };
}

/* ---------- 4. Játékok globális JS-nevei ---------- */
function jatekJsApi(root) {
  const ki = [];
  for (const f of kitFajlok(root, 'web/js/', '.js')) {
    const s = fs.readFileSync(path.join(root, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    if (/^\s*(import|export)\s/m.test(s)) {
      for (const m of s.matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|var|class)\s+([\w$]+)/gm)) ki.push(`${f}: ${m[1]}`);
      for (const m of s.matchAll(/^export\s*\{([^}]*)\}/gm)) m[1].split(',').map((x) => x.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => ki.push(`${f}: ${n}`));
      if (/^export\s+default\b/m.test(s)) ki.push(`${f}: default`);
      continue;
    }
    for (const m of s.matchAll(/\b(?:window|root|globalThis|self)\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) ki.push(m[1]);
    for (const m of s.matchAll(/^(?:async\s+)?function\s*\*?\s*([\w$]+)/gm)) ki.push(m[1]);
    for (const m of s.matchAll(/^(?:const|let|var|class)\s+([\w$]+)/gm)) ki.push(m[1]);
  }
  // A DS objektum tagjai (Node-ban betölthető: require('web/js/ds.js'))
  try {
    const p = path.join(root, 'web/js/ds.js'); delete require.cache[p];
    const DS = require(p);
    for (const [k, v] of Object.entries(DS || {})) { ki.push(`DS.${k}`);
      if (v && typeof v === 'object' && !Array.isArray(v) && !/^(color|world|scene)$/i.test(k)) Object.keys(v).forEach((x) => ki.push(`DS.${k}.${x}`)); }
  } catch { /* nincs ds.js */ }
  return rendez(ki);
}

function pillanatkep(root, opt) {
  return { _readme: 'GENERÁLT (node tools/api-check.js --write) – a DS nyilvános felülete. Eltűnő név = törő változás (docs/ai-munkamod.md 4.).',
    react: reactApi(root, opt), css: cssApi(root), tokenek: tokenApi(root), jatekJs: jatekJsApi(root) };
}
module.exports = { pillanatkep, reactApi, osszevet };

/* ---------- 5. Viszonyítási pont: a legutóbbi címke ---------- */
/** A dist/tokens.json értékeinek összevetése a viszonyítási címkével (a verzió mezőt kihagyja). */
function tokenErtekValtozas(ref) {
  let regi; try { regi = JSON.parse(git(['show', `${ref}:dist/tokens.json`])); } catch { return []; }
  const uj = JSON.parse(fs.readFileSync(path.join(ROOT, 'dist/tokens.json'), 'utf8'));
  const lapit = (o, ut = '', ki = {}) => { for (const [k, v] of Object.entries(o)) { if ((!ut && k === 'version') || k === '_readme') continue; if (v && typeof v === 'object') lapit(v, `${ut}${k}.`, ki); else ki[`${ut}${k}`] = v; } return ki; };
  const a = lapit(regi), b = lapit(uj), ki = [];
  for (const k of Object.keys(b)) if (k in a && a[k] !== b[k]) ki.push(`${k}: ${a[k]} → ${b[k]}`);
  return ki;
}
function git(args) { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 << 20 }).trim(); }
function alapPillanatkep(ref) {
  try { return JSON.parse(git(['show', `${ref}:api/api.json`])); } catch { /* a címkében még nincs pillanatkép → a fájlaiból építjük */ }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bc-api-'));
  try {
    const utak = ['dist/react/types', 'dist/css', 'dist/scss', 'dist/tailwind', 'dist/dart', 'termek/css', 'web/css', 'web/js', 'KIT-FILES.json'];
    const tar = execFileSync('git', ['archive', '--format=tar', ref, ...utak], { cwd: ROOT, maxBuffer: 512 << 20 });
    execFileSync('tar', ['-x', '-C', tmp], { input: tar });
    fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(tmp, 'node_modules'));
    return pillanatkep(tmp);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

function osszevet(regi, uj) {
  const torik = []; const figy = [];
  for (const [nev, r] of Object.entries(regi.react || {})) {
    const u = uj.react[nev];
    if (!u) { torik.push(`react: eltűnt export „${nev}”`); continue; }
    if (r.fajta !== u.fajta && !(r.fajta === 'tipus')) figy.push(`react: „${nev}” fajtája ${r.fajta} → ${u.fajta}`);
    if (r.fajta !== 'komponens') continue; // propokat csak komponens→komponens között hasonlítunk (az alap lehetett feloldhatatlan)
    if (r.htmlAttr && !u.htmlAttr) torik.push(`react: „${nev}” már nem ad át natív attribútumokat`);
    for (const [p, rp] of Object.entries(r.props || {})) {
      const up = (u.props || {})[p];
      if (!up) { if (!u.htmlAttr || !/^(on[A-Z]|aria-|data-)/.test(p)) torik.push(`react: „${nev}” propja eltűnt: ${p}`); }
      else { if (up.kotelezo && !rp.kotelezo) torik.push(`react: „${nev}.${p}” kötelező lett`); if (up.t !== rp.t) figy.push(`react: „${nev}.${p}” típusa: ${rp.t} → ${up.t}`); }
    }
    for (const [p, up] of Object.entries(u.props || {})) if (up.kotelezo && !(r.props || {})[p]) torik.push(`react: „${nev}” új KÖTELEZŐ propot kapott: ${p}`);
  }
  const lista = (cim, a = [], b = []) => { const bs = new Set(b); a.filter((x) => !bs.has(x)).forEach((x) => torik.push(`${cim}: eltűnt „${x}”`)); };
  for (const k of Object.keys(regi.css || {})) lista(`css.${k}`, regi.css[k], uj.css[k]);
  for (const k of Object.keys(regi.tokenek || {})) lista(`tokenek.${k}`, regi.tokenek[k], uj.tokenek[k]);
  lista('jatekJs', regi.jatekJs, uj.jatekJs);
  const db = (o) => Object.keys(o.react || {}).length;
  return { torik, figy, uj: db(uj) - db(regi) };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const ir = args.includes('--write');
  const most = pillanatkep(ROOT);
  const szoveg = JSON.stringify(most, null, 1) + '\n';
  let hiba = 0;
  if (ir) { fs.mkdirSync(path.dirname(API), { recursive: true }); if (!fs.existsSync(API) || fs.readFileSync(API, 'utf8') !== szoveg) { fs.writeFileSync(API, szoveg); console.log('írva: api/api.json'); } }
  else if (!fs.existsSync(API) || fs.readFileSync(API, 'utf8') !== szoveg) { console.log('ELAVULT: api/api.json → node tools/api-check.js --write (és nézd át a diffjét)'); hiba = 1; }
  if (args.includes('--nincs-ellen')) process.exit(hiba); // npm run build: csak írás, viszonyítás nélkül
  // Viszonyítás: --ellen <ref>, különben a legutóbbi v* címke
  let ref = args.includes('--ellen') ? args[args.indexOf('--ellen') + 1] : null;
  if (!ref) { try { ref = git(['describe', '--tags', '--abbrev=0', '--match', 'v*']); } catch { ref = null; } }
  if (!ref) { console.log('api-check: nincs v* címke (sekély klón?) – a törő-változás-őr kimarad. CI-ben: fetch-depth: 0'); process.exit(hiba); }
  const verzio = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf8').trim();
  const fo = (v) => Number(String(v).replace(/^v/, '').split('.')[0]);
  const r = osszevet(alapPillanatkep(ref), most);
  const foEmeles = fo(verzio) > fo(ref);
  console.log(`api-check: ${ref} → most (${verzio}): ${Object.keys(most.react).length} React-export (${r.uj >= 0 ? '+' : ''}${r.uj}), ${most.css.bc.length} bc-osztály, ${most.tokenek.css.length} CSS-token, ${most.jatekJs.length} játék-JS név`);
  r.figy.slice(0, 10).forEach((f) => console.log(`  ! ${f}`)); if (r.figy.length > 10) console.log(`  ! … és még ${r.figy.length - 10} figyelmeztetés`);
  if (r.torik.length) {
    r.torik.slice(0, 40).forEach((t) => console.log(`  ✗ ${t}`)); if (r.torik.length > 40) console.log(`  ✗ … és még ${r.torik.length - 40}`);
    if (foEmeles) console.log(`  (FŐ verzióemelés ${ref} → ${verzio}: a törő változás megengedett – a CHANGELOG írja le, mit kell a fogyasztóknak átírni)`);
    else { console.log('  → törő változás FŐ verzióemelés nélkül. Csak bővíts (docs/rendszer.md 7.), vagy egyeztess Kristóffal a FŐ verzióról.'); hiba = 1; }
  } else console.log('  nincs törő változás');
  // Tokenérték-őr (1.55): a nevek változatlanok, de az ÉRTÉKEK (színszerepek, árnyék, sarok, idő…) a fogyasztók kinézetét változtatják.
  // Ha változott érték, a CHANGELOG mostani szakaszában kell egy ⚠ sor, amely leírja – különben bukik (az 1.54.0 sötét danger/ink-muted MELLÉK kiadásként ment ki, szó nélkül).
  const ertekValtozas = tokenErtekValtozas(ref);
  if (ertekValtozas.length) {
    console.log(`  ⚠ ${ertekValtozas.length} tokenérték változott ${ref} óta (a fogyasztók kinézete változik):`);
    ertekValtozas.slice(0, 12).forEach((v) => console.log(`    ${v}`)); if (ertekValtozas.length > 12) console.log(`    … és még ${ertekValtozas.length - 12}`);
    const cl = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
    const m = cl.match(new RegExp(`^## (?:Készül|${verzio.replace(/\./g, '\\.')})\\b[\\s\\S]*?(?=^## )`, 'm'));
    if (!m || !m[0].includes('⚠')) { console.log('  → a CHANGELOG mostani szakaszában nincs ⚠ sor az értékváltozásról. Írd le, mit lát a fogyasztó, és tedd a sor elé: ⚠'); hiba = 1; }
  }
  process.exit(hiba);
}
