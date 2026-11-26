// beeco-weboldal-audit · lib-consistency.mjs – oldalak közötti ellentmondások és a jóváhagyott tények (reference/tenyek.json) ellenőrzése.
// A látható szövegből számos állítást vesz ki (szám + kulcsszó, díj + évszám/helyezés, hírlevél-gyakoriság), normalizál
// (25.000+ = 25 000 = 25e), témánként csoportosít, és jelzi, ahol két oldal állítása nem fedi egymást.
// Korlát: nyelvtani heurisztika, nem szövegértés. Minden találatot nézz meg szemmel (lehet, hogy két különböző dologról szól).

const clip = (s, n = 170) => { s = String(s ?? '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

// Témák: a szám UTÁN (vagy közvetlenül elé írt címke után) álló kulcsszó. short: csak 1 szó távolságra fogadjuk el.
export const TOPICS = [
  { id: 'letoltes', label: 'letöltés', re: /^letöltés/iu },
  { id: 'partner', label: 'partner', re: /^partner/iu },
  { id: 'onkormanyzat', label: 'önkormányzat/település', re: /^(önkormányzat|település)/iu },
  { id: 'vizado', label: 'vízadó', re: /^vízadó/iu },
  { id: 'liter', label: 'liter', re: /^liter/iu },
  { id: 'fa', label: 'fa', re: /^(fa|fát|fák|fákat|facsemet\p{L}*)$/iu, short: true },
  { id: 'ember', label: 'ember/fő (csapat)', re: /^(ember\p{L}*|fő|főt|csapattag\p{L}*)$/iu, short: true, ctx: /csapat|tagja|vagyunk|dolgozunk|beeconaut/iu },
  { id: 'raj', label: 'raj', re: /^(raj|rajt|rajok|rajra|rajba|rajban)$/iu, short: true },
  { id: 'esemeny', label: 'esemény', re: /^esemény/iu },
];
export const ENTITIES = [
  { id: 'one-digitalis-dij', label: 'ONE Digitális Díj', re: /ONE\s+Digitális\s+Díj/i },
  { id: 'f6s', label: 'F6S', re: /\bF6S\b/ },
  { id: 'kh-start-it', label: 'K&H Start It', re: /K&H\s+Start\s*It/i },
  { id: 'ntk', label: 'NTK', re: /\bNTK\b/ },
];
const MONTHS = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
const FREQ = [[/két\s?hetente|2\s?hetente|kéthetes/i, 'kéthetente'], [/havonta|havi\b|havi\s/i, 'havonta'], [/hetente|heti\b/i, 'hetente'], [/negyedévente/i, 'negyedévente'], [/évente/i, 'évente']];

const NUM = /(?<![\p{L}\p{N}.,/:+-])(\d{1,3}(?:[  .]\d{3})+|\d+(?:,\d+)?)(\+)?(?:\s?(ezer|millió|mrd)|(e|M)(?![\p{L}\p{N}-]))?/gu;
function toValue(raw, unit) {
  const s = raw.replace(/[\s ]/g, '');
  let v = /^\d{1,3}(\.\d{3})+$/.test(s) ? +s.replace(/\./g, '') : +s.replace(',', '.');
  const u = (unit || '').toLowerCase();
  if (u === 'e' || u === 'ezer') v *= 1000; else if (u === 'millió' || u === 'm') v *= 1e6; else if (u === 'mrd') v *= 1e9;
  return v;
}
const tokenize = s => s.trim().split(/\s+/).slice(0, 5).map(t => t.replace(/^[(„"'*]+|[.,;:!?)"”'*]+$/g, ''));
function topicAfter(rest) {
  const tok = tokenize(rest);
  for (let i = 0; i < Math.min(3, tok.length); i++) {
    if (i > 0 && /\d/.test(tok[i - 1])) break;
    for (const t of TOPICS) if (!(t.short && (i > 1 || tok[i] !== tok[i].toLowerCase())) && t.re.test(tok[i])) return { topic: t, qual: i > 0 ? tok[i - 1].toLowerCase() : '' };
  }
  return null;
}
function topicBefore(before) {
  const tok = before.trim().split(/\s+/).slice(-3).map(t => t.replace(/^[(„"'*]+|[.,;:!?)"”'*]+$/g, ''));
  const last = tok[tok.length - 1] || '', prev = tok[tok.length - 2] || '';
  for (const t of TOPICS) { if (t.short) continue; if (t.re.test(last)) return { topic: t, qual: '' }; if (/^(száma|összesen|db|darab)$/i.test(last) && t.re.test(prev)) return { topic: t, qual: '' }; }
  return null;
}
const splitSentences = s => s.split(/(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÖŐÚÜŰ0-9„"])/).map(x => x.trim()).filter(Boolean);

/** A szövegblokkokból állításokat vesz ki. texts: string[] (blokkok + meta szövegek) → [{topic, value, plus, year, qual, snippet}] */
export function extractClaims(texts) {
  const lines = [];
  for (let i = 0; i < texts.length; i++) {
    const t = String(texts[i] || '').trim(); if (!t) continue;
    // „25.000+” és „letöltés” külön elemben (statisztikakártya): összefűzzük a következő blokkal
    if (t.length <= 14 && /^[\d\s.,+]+(e|ezer|M|millió)?\+?$/.test(t) && i + 1 < texts.length) lines.push(t + ' ' + String(texts[i + 1] || ''));
    else lines.push(t);
  }
  const out = []; const seen = new Set();
  const push = c => { const k = `${c.topic}|${c.value}|${c.year}|${c.snippet.slice(0, 60)}`; if (!seen.has(k)) { seen.add(k); out.push(c); } };
  for (const line of lines) for (const sent of splitSentences(line)) {
    const years = [...sent.matchAll(/(?<![\p{N}.,])(20\d\d)(?![\p{N}])/gu)].map(m => ({ y: +m[1], at: m.index }));
    const nearestYear = at => { let best = null; for (const y of years) if (!best || Math.abs(y.at - at) < Math.abs(best.at - at)) best = y; return best ? best.y : null; };
    // 1. számok + kulcsszó
    for (const m of sent.matchAll(NUM)) {
      const raw = m[1], plus = !!m[2], unit = m[3] || m[4];
      const end = m.index + m[0].length;
      if (sent[end] === '%' || /^\s?%/.test(sent.slice(end))) continue;
      const value = toValue(raw, unit); if (!Number.isFinite(value) || value <= 0) continue;
      if (!plus && !unit && /^\d{4}$/.test(raw) && value >= 1990 && value <= 2100) continue; // évszám
      const hit = topicAfter(sent.slice(end)) || topicBefore(sent.slice(0, m.index));
      if (!hit) continue;
      if (hit.topic.ctx && !hit.topic.ctx.test(sent)) continue;
      const near = nearestYear(m.index);
      push({ topic: hit.topic.id, value, plus, year: near, qual: hit.qual, snippet: clip(sent) });
    }
    // 2. díjak / programok: évszám, helyezés, hónap – mindegyik a hozzá legközelebbi említett díjhoz tartozik
    const ments = ENTITIES.flatMap(e => { const m = sent.match(new RegExp(e.re.source, e.re.flags.replace('g', '') + 'g')); const out2 = []; if (m) for (const x of sent.matchAll(new RegExp(e.re.source, e.re.flags.replace('g', '') + 'g'))) out2.push({ e, at: x.index, end: x.index + x[0].length }); return out2; });
    if (ments.length) {
      const toks = [];
      for (const y of years) toks.push({ kind: 'year', v: y.y, at: y.at, end: y.at + 4 });
      const addPlace = (re, val) => { for (const m of sent.matchAll(re)) toks.push({ kind: 'place', v: val ?? +m[1], at: m.index, end: m.index + m[0].length }); };
      addPlace(/(?<![\p{N}])([1-9])\.?\s?(?:helyez|hely\b)/giu); addPlace(/első\s+helyez|első\s+hely|győztes|nyertes/giu, 1); addPlace(/második\s+helyez|második\s+hely/giu, 2); addPlace(/harmadik\s+helyez|harmadik\s+hely/giu, 3);
      const placeAts = new Set(toks.filter(t => t.kind === 'place').map(t => t.at));
      for (const mo of MONTHS) for (const m of sent.matchAll(new RegExp(`(?<![\\p{L}])${mo}`, 'giu'))) if (placeAts.size) toks.push({ kind: 'month', v: mo, at: m.index, end: m.index + mo.length });
      for (const t of toks) {
        let best = null, bd = 1e9; for (const m of ments) { const d = t.at >= m.end ? t.at - m.end : m.at >= t.end ? m.at - t.end : 0; if (d < bd) { bd = d; best = m; } }
        if (best && bd <= 90) push({ topic: `ent:${best.e.id}:${t.kind}`, value: t.v, plus: false, year: null, qual: '', snippet: clip(sent) });
      }
    }
    // 3. hírlevél-gyakoriság
    if (/beeújság|hírlevél/i.test(sent)) for (const [re, name] of FREQ) if (re.test(sent)) { push({ topic: 'newsletter:freq', value: name, plus: false, year: null, qual: /beeújság/i.test(sent) ? 'beeújság' : 'hírlevél', snippet: clip(sent) }); break; }
  }
  return out.slice(0, 120);
}

const fmtVal = c => typeof c.value === 'number' ? `${c.value.toLocaleString('hu-HU').replace(/ /g, ' ')}${c.plus ? '+' : ''}` : String(c.value);
const topicLabel = id => { const t = TOPICS.find(x => x.id === id); if (t) return t.label; const m = id.match(/^ent:([^:]+):(.+)$/); if (m) { const e = ENTITIES.find(x => x.id === m[1]); return `${e ? e.label : m[1]} – ${{ year: 'évszám', place: 'helyezés', month: 'hónap' }[m[2]] || m[2]}`; } return id === 'newsletter:freq' ? 'hírlevél gyakorisága' : id; };

/** pages: [{url, slug, claims}] ; facts: tenyek.json tartalma (vagy null) → { groups, facts, stats } */
export function findContradictions(pages, facts) {
  const withClaims = pages.filter(p => p.claims && p.claims.length);
  const groups = new Map();
  for (const p of withClaims) for (const c of p.claims) {
    const key = `${c.topic}|${c.year ?? ''}`;
    const g = groups.get(key) || { key, topic: c.topic, year: c.year, pages: new Map() };
    const pg = g.pages.get(p.url) || { url: p.url, slug: p.slug, values: new Set(), claims: [] };
    pg.values.add(c.value); pg.claims.push(c); g.pages.set(p.url, pg); groups.set(key, g);
  }
  const out = [];
  for (const g of groups.values()) {
    const arr = [...g.pages.values()]; if (arr.length < 2) continue;
    let conflict = false;
    for (let i = 0; i < arr.length && !conflict; i++) for (let j = i + 1; j < arr.length; j++) if (![...arr[i].values].some(v => arr[j].values.has(v))) { conflict = true; break; }
    if (!conflict) continue;
    const quals = new Set(arr.flatMap(p => p.claims.map(c => c.qual).filter(Boolean)));
    out.push({
      sev: 'P2', topic: g.topic, label: topicLabel(g.topic), year: g.year,
      note: quals.size > 1 ? `Különböző jelzők (${[...quals].join(', ')}): lehet, hogy más-más csoportról van szó; döntsd el, és egységesítsd a megnevezést.` : 'Ugyanarról a számról két oldal mást állít: egységesítsd a jóváhagyott értékre.',
      pages: arr.map(p => ({ page: p.slug, url: p.url, values: [...p.values].map(v => typeof v === 'number' ? v : String(v)), snippets: [...new Set(p.claims.map(c => c.snippet))].slice(0, 2) })),
    });
  }
  out.sort((a, b) => b.pages.length - a.pages.length);
  // jóváhagyott tények
  const mism = [];
  for (const f of (facts && facts.tenyek) || []) {
    const ctx = f.ctx ? new RegExp(f.ctx, 'iu') : null;
    for (const p of withClaims) for (const c of p.claims) {
      if (c.topic !== f.topic) continue;
      if ((f.year ?? null) !== (c.year ?? null)) continue;
      if (ctx && !(ctx.test(c.snippet) || ctx.test(c.qual))) continue;
      if (f.qual && !new RegExp(f.qual, 'iu').test(c.qual + ' ' + c.snippet)) continue;
      if (c.value !== f.ertek) mism.push({ sev: 'P1', fact: f.id, label: f.leiras || f.id, expected: f.ertek, found: c.value, plus: c.plus, page: p.slug, url: p.url, snippet: c.snippet });
    }
  }
  const dedup = new Map(); for (const m of mism) dedup.set(`${m.fact}|${m.url}|${m.found}`, m);
  return {
    groups: out.slice(0, 30), facts: [...dedup.values()].slice(0, 40),
    stats: { pages: withClaims.length, claims: withClaims.reduce((s, p) => s + p.claims.length, 0), groupsCompared: groups.size, factsChecked: ((facts && facts.tenyek) || []).length },
  };
}

const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
export function consistencyMd(res) {
  const L = ['## Ellentmondások oldalak között', ''];
  if (!res) return [...L, '_Kihagyva (kevesebb mint 2 oldal, vagy `--no-consistency`)._', ''];
  L.push(`${res.stats.pages} oldal ${res.stats.claims} számszerű állításából ${res.stats.groupsCompared} témát hasonlítottam össze, és ${res.stats.factsChecked} jóváhagyott tényt (\`reference/tenyek.json\`) néztem meg. Ez nem szövegértés: minden találatot nézz meg szemmel. Nem pontoz.`, '');
  if (!res.groups.length && !res.facts.length) return [...L, '_Nem találtam ellentmondást._', ''];
  if (res.groups.length) {
    L.push('**Oldalak egymás közt (P2)**', '', '| Téma | Oldal | Érték | Idézet |', '|---|---|---|---|');
    for (const g of res.groups) for (const p of g.pages) L.push(`| ${cell(g.label)}${g.year ? ` (${g.year})` : ''} | ${cell(p.page)} | ${p.values.join(', ')} | „${cell(p.snippets.join(' … '))}” |`);
    L.push('', ...res.groups.filter(g => g.note).map(g => `- ${g.label}${g.year ? ` (${g.year})` : ''}: ${g.note}`), '');
  }
  if (res.facts.length) {
    L.push('**Eltérés a jóváhagyott tényektől (P1)**', '', '| Tény | Oldal | Elvárt | Talált | Idézet |', '|---|---|---|---|---|');
    for (const f of res.facts) L.push(`| ${cell(f.label)} | ${cell(f.page)} | ${f.expected} | ${f.found}${f.plus ? '+' : ''} | „${cell(f.snippet)}” |`);
    L.push('');
  }
  return L;
}
