#!/usr/bin/env node
// beeco szöveg-ellenőr: AI-szagú, magyartalan minták jelölése beeco-szövegben.
// Bemenet: URL (Playwright, a main látható szövege, nav/header/footer/form nélkül), fájl (.txt/.md/.html) vagy stdin ("-").
// Használat:
//   node szoveg-ellenor.mjs <URL|fájl|-> [--b2b] [--json] [--max N] [--csak id1,id2] [--teljes]
//   node szoveg-ellenor.mjs --onteszt
// Playwright: NODE_PATH vagy PLAYWRIGHT_PATH, különben a repó node_modules-a (a szkripttől 4 szinttel feljebb).
// Ha nincs Playwright, a HTML-t letölti és egyszerű bontással dolgozik (a Webflow szerveroldalon renderel).
// A szabályok a reference/tiltolista.md mintáival egyeznek (szabály-azonosítók ugyanazok).

import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// ---------- argumentumok ----------
const args = process.argv.slice(2);
const opt = { b2b: false, json: false, ossz: false, max: null, csak: null, teljes: false, onteszt: false, src: null };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--b2b') opt.b2b = true;
  else if (a === '--json') opt.json = true;
  else if (a === '--ossz') opt.ossz = true;
  else if (a === '--teljes') opt.teljes = true;
  else if (a === '--onteszt') opt.onteszt = true;
  else if (a === '--max') opt.max = Number(args[++i]);
  else if (a === '--csak') opt.csak = new Set(args[++i].split(','));
  else if (a === '-h' || a === '--help') { usage(); process.exit(0); }
  else opt.src = a;
}
function usage() {
  console.log(`beeco szöveg-ellenőr
  node szoveg-ellenor.mjs <URL|fájl|-> [kapcsolók]
    --b2b        személytelen B2B-regiszter: a tegezés/magázás is találat
    --json       gépi kimenet: [{szabaly, sulyossag, idezet, javaslat, hely}]
    --ossz       összesítő JSON: {forras, szavak, blokkok, osszes, per_1000_szo, sulyossag, szabalyonkent}
    --max N      kilépési kód 1, ha N-nél több a találat
    --csak a,b   csak ezek a szabályok
    --teljes     URL-nél a menü és a lábléc is
    --onteszt    a beépített rossz/jó párok ellenőrzése`);
}

// ---------- szabályleírások ----------
const RULES = {
  'kettospont':       { nev: 'Kettőspontos felvezetés', s: 'magas', jav: 'Írd ki egész mondatban, kettőspont nélkül; a felsorolásból legyen mondat, vagy bontsd két mondatra.' },
  'jelszopar':        { nev: 'Jelszószerű pár', s: 'magas', jav: 'Mondd el egyszerűen, mi történik és kivel („A kollégák az appban teljesítik a kihívásokat…”).' },
  'pontos-harmas':    { nev: 'Pontokkal tagolt hármas / „Ne csak…”', s: 'magas', jav: 'Egy rendes mondat: ki mit csinál. A szlogenszerű staccato reklámhang, nem beszéd.' },
  'nem-hanem':        { nev: '„nem X, hanem Y” / „…, nem Y.”', s: 'magas', jav: 'Állítsd, ami igaz, a szembeállítás nélkül. Ha kell az ellentét, „de”-vel, külön mondatban.' },
  'tukorforditas':    { nev: 'Angol tükörszerkezet', s: 'magas', jav: 'Kérdezd meg: így mondaná egy magyar ember szóban? Kérdő cím („Mit kap a csapat?”) vagy egyszerű kijelentés.' },
  'szerepsor':        { nev: 'Szerepsoros mondat (X-ként…, Y-ként…)', s: 'kozepes', jav: 'Szerepenként külön, rövid mondat, vagy csak a legfontosabb szerep.' },
  'tulhasznalt':      { nev: 'Túlhasznált szó', s: 'kozepes', jav: 'Hagyd el, vagy mondd konkrétan (szám, hely, idő, eszköz).' },
  'ismetles':         { nev: 'Ismétlés', s: 'kozepes', jav: 'Másodszorra névmás, szinonima vagy hagyd el. A jóváhagyó szabálya: ne ismételd magad feleslegesen.' },
  'gondolatjel':      { nev: 'Gondolatjeles betoldás / em dash', s: 'alacsony', jav: 'Két mondat vagy vessző. Az em dash (—) nem magyar; a gondolatjel „ – ”.' },
  'hosszu-mondat':    { nev: 'Túl hosszú', s: 'alacsony', jav: 'Bontsd két mondatra. Cím ≤ 10 szó, gomb ≤ 4 szó, mondat ≤ 25 szó.' },
  'fonevi':           { nev: 'Főnévi, hivatali stílus', s: 'kozepes', jav: 'Igével mondd: „biztosít” → „ad”, „bevonás” → „bevonjuk / részt vesz”.' },
  'azonos-szerkezet': { nev: 'Azonos szerkezet egymás után', s: 'kozepes', jav: 'Változtass a kezdésen és a ritmuson: kérdés, rövid mondat, felszólítás.' },
  'beeco-nev':        { nev: 'A „beeco” név írása', s: 'kozepes', jav: 'A „beeco” mindig kisbetűs, mondat elején és címben is (beecós, beecóval, beeco-csapat).' },
  'magazas':          { nev: 'Magázás lakossági szövegben', s: 'kozepes', jav: 'A lakossági szöveg tegez: „Fedezze fel” → „Fedezd fel”, „Kattintson ide” → „Kattints ide”.' },
  'riogatas':         { nev: 'Riogatás, katasztrófa-tét', s: 'magas', jav: 'A tét csak kimaradás lehet (elúszik a kedvezmény, egyedül marad a kérdéseivel, kimarad a helyi vásárló). Katasztrófa, bűntudat, szorongás nem; egy szövegben legfeljebb egy ilyen mondat, utána a terv vagy a siker.' },
  'tegezes':          { nev: 'Tegezés/magázás B2B-szövegben', s: 'magas', jav: 'B2B-ben személytelenül: alany „a csapat”, „a település”, „a cég”; gomb: „Ajánlatkérés”, „Bemutató kérése”.' },
};

// ---------- szókincs ----------
const STOP = new Set(('a az és is hogy nem de egy meg már még csak van lesz ha mi te ti mint vagy el be ki fel le ez ezt azt ami amit aki akik ahol mert pedig vagyis sem se itt ott most majd így úgy azért ezért csak sőt nagyon minden mindig sok több kell lehet tud tudsz vagyunk vannak volt lett még nincs igen egyik másik saját együtt közös utána előtt alatt után között mellett nélkül szerint által hozzá neki nekik nektek nekünk velünk veletek benne rajta onnan innen hol hogyan mikor mennyi mivel miért melyik mit mire míg vele olyan ilyen amely amelyek ahogy amikor akkor ekkor ugyanis tehát viszont valamint illetve azonban szintén').split(' '));
const BRAND = /^(beeco|csicserg|vízadá|vizadá|önkénte|madár|madara|nektár|appban|appot|appal|alkalmaz)/i;
const LABEL_OK = /^(forrás|források|szakmai partner|névadó|módszer|kapcsolódás|mondhatod|kerüld|megjegyzés|tipp|kihívás|figyelem|határidő|helyszín|időpont|dátum|szervezők|további támogatók|támogatók|részletek|példa|pl|ár|árak|belépő|eredmény|helyszínek|nyitva|sajtókapcsolat|kapcsolat|telefon|e-mail|cím|például|fontos|most fut|most|újra indul|indul)$/i;
const MONTHS = /^(január|február|március|április|május|június|július|augusztus|szeptember|október|november|december)\w*$/i;

const ALWAYS_WORDS = [
  [/\btényleg\b/i, 'tényleg'], [/\bvalójában\b/i, 'valójában'], [/\bigazán\b/i, 'igazán'],
  [/\bvalód[iy]\w*/i, 'valódi'], [/\bkézzelfogható\w*/i, 'kézzelfogható'], [/\bzökkenőmentes\w*/i, 'zökkenőmentes'],
  [/\bkulcsfontosságú\w*/i, 'kulcsfontosságú'], [/\begyedülálló\w*/i, 'egyedülálló'], [/\bátfogó\w*/i, 'átfogó'],
  [/\ba gyakorlatban\b/i, 'a gyakorlatban'], [/\bnem titok\b/i, 'nem titok'],
];
const DENSE_WORDS = [
  [/\b(mért|mérhető\w*|mérjük|mérünk|mérni|mérés\w*|mérőszám\w*)\b/gi, 'mért/mérhető'],
  [/\begyszerű(en|bb|bben)?\b/gi, 'egyszerű(en)'],
  [/\bkönnyed(én|en)?\b/gi, 'könnyed(én)'],
  [/\bhiteles\w*/gi, 'hiteles'],
  [/\bizgalmas\w*/gi, 'izgalmas'],
  [/\binspiráló\w*/gi, 'inspiráló'],
  [/\bélmény\w*/gi, 'élmény'],
  [/\bigazolt\w*/gi, 'igazolt'],
];
const FIXED_PHRASES = [[/\btöbb mint\b/gi, '„több mint”']];

const TUKOR = [
  [/\ba te utad\b|\bnem ez a te\b/i, '„a te utad” (your journey)'],
  [/\bmegmutatjuk az utat\b/i, '„megmutatjuk az utat” (show you the way)'],
  [/\bkeresd meg magad\b/i, '„keresd meg magad” (magyarul önismeretet jelent)'],
  [/\bés ez látszik is\b/i, '„és ez látszik is” (and it shows)'],
  [/^így néz ki,? amikor\b/i, '„Így néz ki, amikor…” (this is what it looks like when)'],
  [/^ezt látják\b/i, '„Ezt látják…” (this is what they see)'],
  [/\bkezdd kicsiben\b|\bépítkezz(etek|enek)?\b/i, '„kezdd kicsiben, építkezz” (start small, scale)'],
  [/\ba zsebben\b|\ba zsebedben\b/i, '„a zsebben” (in your pocket)'],
  [/\bami (igazán |tényleg )?számít\b/i, '„ami számít” (what matters)'],
  [/\ba nap végén\b/i, '„a nap végén” (at the end of the day)'],
  [/\bvidd (az egész|az eredményt|a jelentésbe)\b/i, '„vidd az egész cégre / a jelentésbe” (take it to…)'],
  [/\bkövetkező szintre\b/i, '„a következő szintre” (next level)'],
  [/\bjátékváltó\b|\bgame.?changer\b/i, '„játékváltó” (game changer)'],
];
// riogatás (F23, a jóváhagyó döntése 2026-11-25): katasztrófa, végzet, bűntudat, szorongás; szó eleji egyezés,
// így az „erdőpusztítás” vagy a „veszélyes hulladék” nem találat; a „kihalófélben” szakkifejezés kimarad
const RIOGATAS = /(?<!\p{L})(?:katasztróf\p{L}*|apokalip\p{L}*|pusztul\p{L}*|pusztít\p{L}*|összeoml\p{L}*|haldokl\p{L}*|végzet\p{L}*|tragédi\p{L}*|tragikus\p{L}*|rettenet\p{L}*|retteg\p{L}*|riasztó\p{L}*|ijesztő\p{L}*|félelmetes\p{L}*|pánik\p{L}*|kihal(?!ófélben)\p{L}*|visszafordíthatatlan\p{L}*|élhetetlen\p{L}*|szégyell\p{L}*|túl késő|késő lesz|nincs visszaút|(?:a )?te hibád|miattad)(?!\p{L})/iu;

const FONEVI = [
  /\bbiztosít(?!ás)\w*/i, /\blehetőséget (nyújt|ad|biztosít)\w*/i, /\b\w+(ásra|ésre) kerül\w*/i, /\belköteleződés\w*/i,
  /\bmegoldást kínál\w*/i, /\bfókusz\w*/i, /\bökoszisztém\w*/i, /\bszinergi\w*/i, /\bholisztikus\w*/i,
  /\bbevonás\w*/i, /\bmegvalósít\w*/i, /\bkiegészítő bizonyíték\w*/i,
];

// B2B: tegezés (E/2, T/2) és magázás jelei
const T2_PRON = /^(te|téged|neked|nálad|tőled|hozzád|veled|rólad|érted|tiéd|magad|magadnak|ti|titeket|nektek|nálatok|veletek|rólatok|tiétek|ön|önök|önnek|önöknek|önt)$/iu;
const T2_POSS = /^[\p{L}-]{3,}(od|ed|öd|aid|eid|idat|idet|odat|edet|ödet|otok|etek|ötök|aitok|eitek)$/iu;
const T2_VERB = /^[\p{L}-]{2,}(hatsz|hetsz|hatod|heted|játok|jétek|hatjátok|hetitek|hattok|hettek|jatok|jetek|itek)$|^(kapsz|kérsz|látsz|nyersz|tudsz|teszel|kapod|kéred|látod|kaptok|láttok|kértek|vagytok|tudtok|indultok|kérj|kérd|nézd|írd|írj|töltsd|válassz|kezdd|vidd|mondd|mutasd|szállj|csatlakozz|gyere|iratkozz|keresd|fedezd|ismerd|figyeld|tedd|add|próbáld|vond|mozgósítsd|kerülj|találd|nyisd|nézz|kezdj|indíts|szervezz|tervezz|szervezzetek|válasszatok|kérjetek|nézzétek)$/iu;
const POSS_OK = /^(ered|szed|ötöd|sered|ezred|tized|negyed|század|mened|szöged|kéred)$/i; // nem birtokos szóvégek
const PLURAL_OK = /^(üzenet|részlet|eset|élet|keret|ismeret|tervezet|szerkezet|helyzet|kísérlet|kellemetlenség)ek$/i; // -t végű főnév + többes szám, nem „-etek” birtokos

// ---------- segédek ----------
const norm = (s) => (s || '').replace(/ /g, ' ').replace(/[​-‍﻿͏]/g, '').replace(/\s+/g, ' ').trim();
const words = (s) => (s.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || []);
const stripQuotes = (s) => s.replace(/„[^”]{0,400}”/g, '„…”').replace(/"[^"]{0,400}"/g, '"…"');
const sentences = (s) => s.split(/(?<=[.!?…])\s+(?=[„"(\p{Lu}\p{N}])/u).map((x) => x.trim()).filter(Boolean);
const short = (s, n = 110) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const isHeadish = (t) => t === 'cim' || t === 'rovid';
const stem = (w) => w.toLowerCase().slice(0, 6);
const suffixClass = (w) => {
  const x = w.toLowerCase();
  for (const [re, c] of [[/(ban|ben)$/, 'BAN'], [/(ba|be)$/, 'BA'], [/(nak|nek)$/, 'NAK'], [/(ra|re)$/, 'RA'], [/(val|vel)$/, 'VAL'], [/(tól|től)$/, 'TOL'], [/(ból|ből)$/, 'BOL']]) if (re.test(x)) return c;
  return null;
};
const shape = (part) => words(part).map((w) => (/^(a|az|egy)$/i.test(w) ? 'A' : 'W')).join('');

// ---------- ellenőrzés ----------
function check(blocks, { b2b = false } = {}) {
  const out = [];
  const add = (szabaly, blk, idezet, extra) => {
    if (opt.csak && !opt.csak.has(szabaly)) return;
    const r = RULES[szabaly];
    out.push({ szabaly, sulyossag: r.s, idezet: short(idezet), javaslat: extra ? `${extra} ${r.jav}` : r.jav, hely: blk ? blk.hely : 'oldal' });
  };

  for (const b of blocks) {
    const raw = b.szoveg;
    const txt = stripQuotes(raw);
    const wc = words(txt).length;
    if (!wc || b.tipus === 'idezet') continue;
    const sents = sentences(txt);

    // 1 kettőspont
    {
      let flagged = false;
      for (const s of sents) {
        const m = s.match(/^(.*?[\p{L}\p{N})?!])\s*:\s+(\S.*)$/u);
        if (!m) continue;
        const left = m[1].trim(), right = m[2];
        if (/https?$/i.test(left) || /\d$/.test(left) || /^\d/.test(right)) continue;
        if (LABEL_OK.test(left.replace(/[^\p{L} -]/gu, '').trim())) continue;
        if (/^[📍🗓️⏰]/u.test(left)) continue;
        const lw = words(left).length;
        const lastSeg = (left.split(/\s(?:és|meg|vagy|valamint)\s/i).pop() || '');
        const list = /,/.test(left) && /\s(és|meg|vagy|valamint)\s/i.test(left) && !/,\s*(és|de|hogy|mert|ha|ami|amit|aki|majd|pedig)\b/i.test(left) && words(lastSeg).length <= 3 && !/\bis\b/i.test(lastSeg);
        const head = isHeadish(b.tipus) || b.tipus === 'gomb';
        const firstSent = s === sents[0];
        if (list || (head && lw <= 6) || (!head && firstSent && lw <= 4 && sents.length > 0 && wc > 6)) {
          add('kettospont', b, s, list ? 'Felsorolás + kettőspont.' : ''); flagged = true; break;
        }
      }
      void flagged;
    }

    // 2 jelszópár (cím/rövid)
    if (isHeadish(b.tipus) || wc <= 8) {
      const t = txt.replace(/[.!?]+$/, '');
      const parts = t.split(/,\s+/);
      if (parts.length === 2) {
        const [p1, p2] = parts; const w1 = words(p1), w2 = words(p2);
        const conj = /^(és|de|meg|hogy|vagy|mert|ha|majd|aztán|pedig|ami|amit|aki|mint)\b/i.test(p2);
        if (!conj && w1.length >= 2 && w1.length <= 4 && w1.length === w2.length) {
          const sameShape = shape(p1) === shape(p2);
          const art = /A/.test(shape(p1));
          const suf = suffixClass(w1.at(-1)) && suffixClass(w1.at(-1)) === suffixClass(w2.at(-1));
          const anti = /\b(van|nincs|igen|nem)\b/i.test(p1) && /\b(van|nincs|igen|nem)\b/i.test(p2);
          if (sameShape && (art || suf || anti)) add('jelszopar', b, raw);
        }
      }
    }
    if (/^előbb\b[^.!?]*,\s*(utána|aztán|majd)\b/i.test(txt)) add('jelszopar', b, raw, '„Előbb…, utána…” pár.');

    // 3 pontos hármas
    {
      let run = 0, hit = false;
      // a kérdés–válasz váltakozás (Levi: „Tizen cselekszünk? Elindul valami. Tízezren? Az már változás.”) nem staccato: a kérdés megszakítja a sort
      for (const s of sents) { if (/\?\s*$/.test(s)) { run = 0; continue; } if (words(s).length <= 3) { run++; if (run >= 3) hit = true; } else run = 0; }
      if (hit) add('pontos-harmas', b, raw);
      else if (sents.some((s) => /^ne csak\b/i.test(s))) add('pontos-harmas', b, raw, '„Ne csak…” felütés.');
    }

    // 4 nem-hanem
    for (const s of sents) {
      if (/^nem[.!]?$/i.test(s)) continue;
      if (/\bnem(csak| csak)?\b[^.!?]*?,\s*hanem\b/i.test(s) || /,\s*(és\s+)?nem\s+(csak\s+)?[^,.!?]{1,40}[.!?]?$/i.test(s)) { add('nem-hanem', b, s); break; }
    }

    // 5 tükörfordítás
    {
      let hit = null;
      if (isHeadish(b.tipus) && /^(amit|ami|ahol|ahogy|akik|akikkel)\b/i.test(txt)) hit = '„Amit…/Ami…” címkezdet (What you get…).';
      else if (isHeadish(b.tipus) && /^((a|az|egy)\s+)?[\p{L}-]+,\s+(amit|ami|amely|amivel|amiről|amiben)\b/iu.test(txt)) hit = '„X, amit/ami…” cím (The program that…).';
      if (!hit) for (const [re, label] of TUKOR) if (re.test(txt)) { hit = label; break; }
      if (hit) add('tukorforditas', b, raw, hit);
    }

    // 6 szerepsor
    for (const s of sents) {
      const ms = [...s.matchAll(/[\p{L}-]+ként\b/giu)];
      if (ms.length >= 2) {
        const gap = s.slice(ms[0].index + ms[0][0].length, ms[1].index);
        if (words(gap).length >= 3) { add('szerepsor', b, s); break; }
      }
    }

    // 10 hossz
    const gwc = words(txt).filter((w) => !/^(a|az)$/i.test(w)).length;
    if (b.tipus === 'gomb' && gwc > 4) add('hosszu-mondat', b, raw, `Gomb: ${gwc} szó.`);
    else if (b.tipus === 'cim' && wc > 10 && !/[.!?]$/.test(txt)) add('hosszu-mondat', b, raw, `Cím: ${wc} szó.`);
    else for (const s of sents) { const n = words(s).length; if (n > 25) { add('hosszu-mondat', b, s, `${n} szó.`); break; } }

    // 9 gondolatjel
    if (/—/.test(raw)) add('gondolatjel', b, raw, 'Em dash (—).');
    else for (const s of sents) if ((s.match(/\s–\s/g) || []).length >= 2) { add('gondolatjel', b, s, 'Gondolatjeles betoldás.'); break; }

    // 11 főnévi
    for (const re of FONEVI) { const m = txt.match(re); if (m) { add('fonevi', b, raw, `„${m[0]}”.`); break; } }

    // 8 ismétlés blokkon belül
    if (b.tipus !== 'gomb' && !/^források?\s*:/i.test(txt)) {
      const cnt = new Map();
      for (const w of words(txt)) {
        const lw = w.toLowerCase();
        if (lw.length < 5 || STOP.has(lw) || BRAND.test(lw) || MONTHS.test(lw) || /^\d/.test(lw)) continue;
        const st = stem(lw); cnt.set(st, (cnt.get(st) || 0) + 1);
      }
      for (const [st, n] of cnt) if (n >= 3 || (n >= 2 && wc <= 20)) { add('ismetles', b, raw, `„${st}…” ${n}× egy blokkban.`); break; }
    }

    // 14 beeco-név: kisbetű mondat elején és címben is; csupa nagybetű sem
    {
      const m = raw.match(/(?<![@\/.\w-])(Beeco|BEECO|BeeCo|BEEco)(?![.\w]*\.(hu|com))(?!\s+(Kft|Zrt|Nonprofit|Bt)\b)/u);
      if (m) add('beeco-nev', b, raw, `„${m[1]}” → „beeco”.`);
    }

    // 16 riogatás (F23): a tét csak kimaradás lehet
    { const m = txt.match(RIOGATAS); if (m) add('riogatas', b, raw, `„${m[0]}”.`); }

    // 15 magázás lakossági szövegben (B2B-ben a tegezes szabály viszi)
    if (!b2b) {
      let mz = txt.match(/(?:^|[\s(„])(Ön|Önnek|Önök|Önt|Önöket|Önnél|Öntől|Önhöz)(?=[\s,.!?)”]|$)/u) || txt.match(/\bkattintson\b/i);
      if (!mz) for (const s1 of sents) { const f = s1.match(/^(Fedezze|Töltse|Kérje|Nézze|Tekintse|Iratkozzon|Csatlakozzon|Látogasson|Vegye|Olvassa|Keresse|Válassza|Próbálja|Tegye)\b/u); if (f) { mz = f; break; } }
      if (mz) add('magazas', b, raw, `(${(mz[1] || mz[0]).trim()})`);
    }

    // 13 B2B tegezés
    if (b2b) {
      for (const s of sents) {
        const hits = [];
        for (const w of words(s)) {
          if (T2_PRON.test(w)) hits.push(w);
          else if (T2_VERB.test(w)) hits.push(w);
          else if (T2_POSS.test(w) && !POSS_OK.test(w) && !PLURAL_OK.test(w) && w.length > 5 && !/^(ered|szerep|kedv|térkép|terep|élmény|tépés|ébred)/i.test(w)) hits.push(w);
        }
        if (hits.length) add('tegezes', b, s, `(${[...new Set(hits)].slice(0, 4).join(', ')})`);
      }
    }
  }

  // ---------- oldalszintű szabályok ----------
  const body = blocks.filter((b) => b.tipus !== 'gomb' && b.tipus !== 'idezet');
  const all = body.map((b) => stripQuotes(b.szoveg)).join('\n');
  for (const [re, label] of ALWAYS_WORDS) {
    const g = new RegExp(re.source, 'gi'); const n = (all.match(g) || []).length;
    if (n) { const fb = body.find((b) => re.test(b.szoveg)); add('tulhasznalt', fb, fb ? fb.szoveg : label, `„${label}” ${n}× az oldalon.`); }
  }
  for (const [re, label] of DENSE_WORDS) {
    const n = (all.match(re) || []).length;
    if (n >= 3) { const r1 = new RegExp(re.source, 'i'); const fb = body.find((b) => r1.test(b.szoveg)); add('tulhasznalt', fb, fb ? fb.szoveg : label, `„${label}” ${n}× az oldalon.`); }
  }
  for (const [re, label] of FIXED_PHRASES) {
    const n = (all.match(re) || []).length;
    if (n >= 3) add('ismetles', null, label, `${label} ${n}× az oldalon.`);
  }
  // kétszavas fordulatok ismétlése
  {
    const cnt = new Map();
    for (const b of body) {
      const ws = words(stripQuotes(b.szoveg)).map((w) => w.toLowerCase());
      const seen = new Set();
      for (let i = 0; i < ws.length - 1; i++) {
        const a = ws[i], c = ws[i + 1];
        if (STOP.has(a) || STOP.has(c) || a.length < 4 || c.length < 4 || BRAND.test(a) || BRAND.test(c) || /^\d/.test(a + c)) continue;
        const k = `${stem(a)} ${stem(c)}`;
        if (seen.has(k)) continue; seen.add(k);
        if (!cnt.has(k)) cnt.set(k, { n: 0, ex: `${ws[i]} ${ws[i + 1]}` });
        cnt.get(k).n++;
      }
    }
    for (const [, v] of cnt) if (v.n >= 3) add('ismetles', null, `„${v.ex}”`, `„${v.ex}” ${v.n} blokkban.`);
  }
  // azonos szerkezet: egymást követő, azonos típusú blokkok azonos kezdőszóval
  {
    const groups = {};
    for (const b of blocks) (groups[b.tipus] ||= []).push(b);
    for (const [tip, arr] of Object.entries(groups)) {
      if (tip === 'gomb') continue;
      let run = 1;
      for (let i = 1; i <= arr.length; i++) {
        const f = (x) => (x ? (words(x.szoveg)[0] || '').toLowerCase() : null);
        const same = i < arr.length && f(arr[i]) && f(arr[i]) === f(arr[i - 1]) && !/^\d/.test(f(arr[i])) && !STOP.has(f(arr[i]));
        if (same) run++;
        else { if (run >= 3) add('azonos-szerkezet', arr[i - 1], arr[i - run].szoveg, `${run} egymást követő ${tip} „${words(arr[i - 1].szoveg)[0]}” kezdettel.`); run = 1; }
      }
      // „Amit…” sablon: legalább két „Amit…” kezdetű cím/szemöldök
      if (isHeadish(tip)) {
        const amit = arr.filter((x) => /^(amit|ami)\b/i.test(x.szoveg));
        if (amit.length >= 2) add('azonos-szerkezet', amit[1], amit.map((x) => x.szoveg).join(' / '), 'Probléma–megoldás–haszon sablon („Amit…”).');
      }
      // vesszős pár-címek sorozata
      if (isHeadish(tip)) {
        let r = 0;
        for (const b of arr) { if (/^[^,]{3,30}, [^,]{3,30}$/.test(b.szoveg.replace(/[.!?]$/, ''))) { r++; if (r === 3) add('azonos-szerkezet', b, b.szoveg, 'Három egymást követő vesszős pár-cím.'); } else r = 0; }
      }
    }
    for (const b of body) {
      const ss = sentences(b.szoveg); let r = 1;
      for (let i = 1; i < ss.length; i++) { const a = (words(ss[i])[0] || '').toLowerCase(); if (a && a === (words(ss[i - 1])[0] || '').toLowerCase()) { r++; if (r === 3) add('azonos-szerkezet', b, b.szoveg, 'Három mondat ugyanazzal a szóval kezdődik.'); } else r = 1; }
    }
  }
  return out;
}

// ---------- bemenet ----------
function blocksFromText(text) {
  const lines = text.split(/\r?\n/); const out = [];
  lines.forEach((l, i) => {
    let s = norm(l); if (!s) return;
    let tipus = 'bekezdes';
    if (/^#{1,6}\s/.test(s)) { tipus = 'cim'; s = s.replace(/^#+\s*/, ''); }
    else if (/^[-*•]\s/.test(s)) { tipus = 'lista'; s = s.replace(/^[-*•]\s*/, ''); }
    else if (/^\[.+\]$/.test(s)) { tipus = 'gomb'; s = s.slice(1, -1); }
    else if (/^>\s/.test(s)) { tipus = 'idezet'; }
    else if (words(s).length <= 8 && !/[.!…:,]$/.test(s)) tipus = 'rovid';
    out.push({ tipus, szoveg: s, hely: `${i + 1}. sor` });
  });
  return out;
}

function blocksFromHtml(html, teljes) {
  let h = html.replace(/<!--[\s\S]*?-->/g, '');
  h = h.replace(/<(script|style|noscript|svg|template|select|option)\b[\s\S]*?<\/\1>/gi, '');
  if (!teljes) {
    const m = h.match(/<main\b[\s\S]*<\/main>/i); if (m && m[0].replace(/<[^>]+>/g, ' ').split(/\s+/).length >= 80) h = m[0];
    for (let k = 0; k < 3; k++) h = h.replace(/<(nav|header|footer|form)\b[^>]*>(?:(?!<\1\b)[\s\S])*?<\/\1>/gi, '');
  }
  const out = []; let idx = 0;
  const re = /<(h[1-6]|p|li|blockquote|figcaption|dt|dd|summary|button|a|div|span)\b([^>]*)>([\s\S]*?)(?=<\/?(?:h[1-6]|p|li|blockquote|figcaption|dt|dd|summary|button|a|div|section|ul|ol)\b)/gi;
  let m;
  while ((m = re.exec(h))) {
    const tag = m[1].toLowerCase(), attrs = m[2];
    const text = norm(m[3].replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'"));
    if (!text) continue;
    let tipus = /^h[1-6]$/.test(tag) ? 'cim' : tag === 'blockquote' ? 'idezet' : tag === 'li' ? 'lista' : 'bekezdes';
    if (tag === 'button' || (tag === 'a' && /class="[^"]*(button|btn|cta|gomb)/i.test(attrs))) tipus = 'gomb';
    if (tipus === 'bekezdes' && words(text).length <= 8 && !/[.!…:,]$/.test(text)) tipus = 'rovid';
    out.push({ tipus, szoveg: text, hely: `#${++idx} ${tag}` });
  }
  return dedupe(out);
}

function dedupe(arr) {
  const seen = new Set(); const out = [];
  for (const b of arr) { const k = b.tipus + '|' + b.szoveg; if (seen.has(k)) continue; seen.add(k); out.push(b); }
  return out;
}

function loadPlaywright() {
  const cands = [process.env.PLAYWRIGHT_PATH, ...(process.env.NODE_PATH || '').split(':').filter(Boolean).map((p) => join(p, 'playwright')), resolve(__dir, '../../../../node_modules/playwright'), 'playwright'].filter(Boolean);
  for (const c of cands) { try { return require(c); } catch {} }
  return null;
}

async function blocksFromUrl(url, teljes) {
  const pw = loadPlaywright();
  if (pw) {
    let browser;
    try {
      browser = await pw.chromium.launch({ headless: true });
      const page = await browser.newPage({ locale: 'hu-HU' });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(800);
      const res = await page.evaluate((teljes) => {
        const SKIP = teljes ? 'script,style,noscript,svg,template,select,option'
          : 'header,nav,footer,form,script,style,noscript,svg,template,select,option,[aria-hidden="true"],[role="navigation"],.w-nav,.w-dropdown,.w-condition-invisible,.w-form,.w-form-done,.w-form-fail,[hidden]';
        const BLOCK = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'blockquote', 'figcaption', 'dt', 'dd', 'summary', 'button']);
        const BLOCK_SEL = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,dt,dd,summary,button,a';
        const out = [];
        const txt = (el) => { let e = el; if (el.querySelector('style,script,noscript,template')) { e = el.cloneNode(true); e.querySelectorAll('style,script,noscript,template').forEach((x) => x.remove()); } const t = ((e === el ? el.innerText : e.textContent) || el.textContent || '').replace(/\s+/g, ' ').trim(); return /[{};]\s*[-\w]+\s*:|^\s*[.:#@][\w-]+[^{]*\{/.test(t) ? '' : t; };
        const isBtn = (el) => el.tagName === 'BUTTON' || (el.tagName === 'A' && (/(button|btn|cta|gomb)/i.test(el.className) || el.getAttribute('role') === 'button'));
        function visit(el) {
          if (el.matches(SKIP)) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' && !el.closest('.w-tab-pane')) return;
          const tag = el.tagName.toLowerCase();
          if (BLOCK.has(tag) || isBtn(el)) { const t = txt(el); if (t) out.push({ tag, btn: isBtn(el), t }); return; }
          if (tag === 'a') { const t = txt(el); if (t && !el.querySelector(BLOCK_SEL.replace(',a', ''))) { out.push({ tag, btn: false, t }); return; } }
          if (!el.querySelector(BLOCK_SEL) && el.children.length <= 3) { const t = txt(el); if (t) { out.push({ tag, btn: false, t }); return; } }
          for (const c of el.children) visit(c);
        }
        const mainEl = document.querySelector('main');
        const root = teljes || !mainEl || (mainEl.innerText || '').split(/\s+/).length < 80 ? document.body : mainEl;
        visit(root);
        return out;
      }, teljes);
      const blocks = res.map((r, i) => {
        let tipus = /^h[1-6]$/.test(r.tag) ? 'cim' : r.tag === 'blockquote' ? 'idezet' : r.tag === 'li' ? 'lista' : r.btn ? 'gomb' : 'bekezdes';
        if (tipus === 'bekezdes' && words(r.t).length <= 8 && !/[.!…:,]$/.test(r.t)) tipus = 'rovid';
        return { tipus, szoveg: norm(r.t), hely: `#${i + 1} ${r.tag}` };
      });
      return { blocks: dedupe(blocks), mod: 'playwright' };
    } catch (e) {
      if (!opt.json) console.error(`Playwright hiba (${e.message.split('\n')[0]}), egyszerű letöltéssel folytatom.`);
    } finally { if (browser) await browser.close(); }
  }
  const r = await fetch(url, { headers: { 'user-agent': 'beeco-szoveg-ellenor' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return { blocks: blocksFromHtml(await r.text(), teljes), mod: 'fetch' };
}

// ---------- önteszt ----------
const SELFTEST = [
  ['kettospont', 'bekezdes', 'Keresd meg magad: mindegyik programot a településedre, a csapatodra vagy a boltodra szabjuk.', 'Önkormányzat, cég vagy zöld kkv? Minden programot a településhez, a csapathoz vagy a bolthoz igazítunk.'],
  ['kettospont', 'bekezdes', 'Workshopok, közös akciók és a Vízadás: a beeco programjai a gyakorlatban.', 'Klímafreskó az irodában, locsolás a parkban, odúkészítés egy szombat délelőtt.'],
  ['jelszopar', 'cim', 'Szándék van, tett nincs', 'A kollégák szeretnének tenni valamit, csak nem tudják, mit.'],
  ['jelszopar', 'cim', 'Kihívás a zsebben, verseny a csapatban', 'Kihívások az appban, a csapatok egymás ellen versenyeznek'],
  ['jelszopar', 'cim', 'Élmény a csapatnak, adat a jelentésbe', 'A csapat jól érzi magát, és a jelentéshez is lesz összesítő'],
  ['pontos-harmas', 'cim', 'Bevonunk. Mérünk. Megmutatjuk.', 'A beeco megszervezi, a kollégák locsolnak, a végén jelentés készül.'],
  ['pontos-harmas', 'cim', 'Ne csak állítsd. Tedd, mérd, mutasd meg.', 'Zöld a cég? Ez a szám mutatja meg.'],
  ['nem-hanem', 'bekezdes', 'A beeco@work az elköteleződésre épül. A riport ebből készül, nem helyette.', 'A riport abból készül, amit a kollégák az appban csinálnak.'],
  ['tukorforditas', 'cim', 'A program, amit a csapat tényleg csinál', 'Ezt a programot a kollégák végig is csinálják'],
  ['tukorforditas', 'rovid', 'Amit te nyersz', 'És mi jár ezért a cégnek?'],
  ['tukorforditas', 'cim', 'Így néz ki, amikor egy csapat együtt zöldül', 'Céges csapatok locsolás és odúkészítés közben'],
  ['tukorforditas', 'cim', 'Nem ez a te utad? Nézd meg a többit', 'Más program érdekel? Itt a teljes kínálat'],
  ['szerepsor', 'bekezdes', 'HR-ként közös élményt és mérhető részvételt kapsz, ESG-felelősként összesített adatot a jelentéshez.', 'A HR közös programot kap, az ESG-jelentéshez pedig összesített számok járnak.'],
  ['beeco-nev', 'bekezdes', 'Beeco appal könnyebb. A BEECO csapata segít.', 'A beeco appal könnyebb, a beeco-csapat segít.'],
  ['nem-hanem', 'cim', 'A riportálás egyszerűbb lett, nem szűnt meg', 'A riportálás egyszerűbb lett, de továbbra is kell'],
  ['magazas', 'bekezdes', 'Fedezze fel a madárvilágot! Kattintson ide.', 'Fedezd fel a madárvilágot! Kattints ide.'],
  ['tegezes', 'bekezdes', 'Kérj ajánlatot, és 2 munkanapon belül megkapod a csapatodra szabott árat.', 'Az ajánlatot 2 munkanapon belül küldjük, a csapat létszáma alapján.'],
  ['tegezes', 'rovid', 'Itt látod a kertetek üzeneteit.', 'Push és appon belüli üzenetek, részletek az adatkezelésben.'],
  ['riogatas', 'bekezdes', 'Ha most nem lépsz, a bolygó összeomlik, és késő lesz.', 'Ha most nem töltöd le, elúszik a heti kupon. A térképen viszont már ma megtalálod a legközelebbi zöld boltot.'],
  ['riogatas', 'cim', 'Ne hagyd, hogy miattad pusztuljon a természet', 'Egy lépés ma, a raj holnap is veled tart'],
];
function selftest() {
  let ok = 0, bad = 0;
  for (const [rule, tipus, rossz, jo] of SELFTEST) {
    const b2b = rule === 'tegezes';
    if (opt.csak) opt.csak = null;
    const r1 = check([{ tipus, szoveg: rossz, hely: 'rossz' }], { b2b }).filter((x) => x.hely !== 'oldal');
    const r2 = check([{ tipus, szoveg: jo, hely: 'jo' }], { b2b }).filter((x) => x.hely !== 'oldal');
    const hit = r1.some((x) => x.szabaly === rule);
    const clean = r2.filter((x) => ['kettospont', 'jelszopar', 'pontos-harmas', 'nem-hanem', 'tukorforditas', 'szerepsor', 'tegezes', 'beeco-nev', 'magazas', 'riogatas'].includes(x.szabaly)).length === 0;
    if (hit && clean) ok++; else { bad++; console.log(`HIBA [${rule}] rossz jelölve: ${hit} · jó tiszta: ${clean}`, clean ? '' : r2.map((x) => x.szabaly)); }
  }
  console.log(`Önteszt: ${ok}/${ok + bad} pár rendben.`);
  process.exit(bad ? 1 : 0);
}

// ---------- fő ----------
async function main() {
  if (opt.onteszt) return selftest();
  if (!opt.src) { usage(); process.exit(2); }
  let blocks, forras = opt.src, mod = 'szöveg';
  if (/^https?:\/\//i.test(opt.src)) ({ blocks, mod } = await blocksFromUrl(opt.src, opt.teljes));
  else {
    const text = opt.src === '-' ? readFileSync(0, 'utf8') : (existsSync(opt.src) ? readFileSync(opt.src, 'utf8') : (() => { console.error(`Nincs ilyen fájl: ${opt.src}`); process.exit(2); })());
    if (opt.src === '-') forras = 'stdin';
    blocks = /<\/(p|div|h[1-6]|li)>/i.test(text) ? blocksFromHtml(text, opt.teljes) : blocksFromText(text);
  }
  const res = check(blocks, { b2b: opt.b2b });
  const wc = blocks.reduce((n, b) => n + words(b.szoveg).length, 0);
  const ossz = {
    forras, szavak: wc, blokkok: blocks.length, osszes: res.length,
    per_1000_szo: wc ? Math.round(res.length / wc * 10000) / 10 : 0,
    sulyossag: { magas: 0, kozepes: 0, alacsony: 0 }, szabalyonkent: {},
  };
  for (const r of res) { ossz.sulyossag[r.sulyossag]++; ossz.szabalyonkent[r.szabaly] = (ossz.szabalyonkent[r.szabaly] || 0) + 1; }
  if (opt.ossz) {
    console.log(JSON.stringify(ossz, null, 2));
  } else if (opt.json) {
    console.log(JSON.stringify(res, null, 2));
  } else {
    const per = wc ? (res.length / wc * 1000).toFixed(1).replace('.', ',') : '0';
    console.log(`beeco szöveg-ellenőr · ${forras}${opt.b2b ? ' · B2B' : ''} · ${mod}`);
    console.log(`${wc} szó, ${blocks.length} blokk · ${res.length} találat (${per} / 1000 szó)\n`);
    const sum = {};
    for (const r of res) sum[r.szabaly] = (sum[r.szabaly] || 0) + 1;
    for (const [k, v] of Object.entries(sum).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${RULES[k].nev} (${k})`);
    if (res.length) console.log('');
    for (const r of res) {
      console.log(`[${r.szabaly}] ${r.hely} · ${r.sulyossag}\n  „${r.idezet}”\n  → ${r.javaslat}`);
    }
    if (!res.length) console.log('Nincs találat. Ettől még olvasd fel hangosan: a gép nem hallja a ritmust.');
  }
  if (opt.max != null && res.length > opt.max) process.exit(1);
}
main().catch((e) => { console.error(e.message); process.exit(2); });
