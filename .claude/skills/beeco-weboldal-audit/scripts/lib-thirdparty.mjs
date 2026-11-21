// beeco-weboldal-audit · lib-thirdparty.mjs – harmadik fél költsége (v3.1) és weboldal-lábnyom (CO2e).
//  - bájt és kérésszám gazdagépenként: a teljesítmény-mérés hálózati naplójából (trackNet), nincs többletmérés;
//  - főszál-idő gazdagépenként: külön betöltés CDP CPU-profilerrel (Profiler.start/stop), 4× CPU-lassítással, mobil nézeten.
//    Indok: a Profiler a lap saját főszálát mintavételezi (nem a teljes böngészőt, mint a Tracing), ezért egy párhuzamosan futó
//    másik oldal nem szennyezi; önidőt ad (nincs beágyazott EvaluateScript/FunctionCall dupla számolás); a futás korlátos
//    (betöltés + 3 mp). Külön betöltés kell, hogy a profilozás ne torzítsa az LCP/TBT-mérést. A mintavételezés 0,5 ms.
//    Korlát: csak a fő dokumentum főszála (az iframe-ek, pl. a reCAPTCHA, külön folyamatban futnak: azok ideje nincs benne,
//    a bájtjuk igen); a hozzájárulás előtti állapotot méri (a CookieYes mögé zárt szkriptek még nem futnak).

export const THIRD_BYTES_KB = 150, THIRD_CPU_MS = 150;
const STRIPE = /(^|\.)stripe\.(com|network)$/i;
export const STRIPE_OK_PATH = /^\/(beebolt|product|checkout)(\/|$)/i;
const cell = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');

// Ismert szolgáltatások: gazda (+ útvonal-részlet) → név és javítási tanács
const SERVICES = [
  [/recaptcha/i, 'reCAPTCHA', 'A reCAPTCHA a Sender hírlevél-widgetből jön: töltsd csak az űrlap fókusza/görgetése után (lazy), vagy az űrlapos oldalakra korlátozd; a „Google reCAPTCHA” jelvény helyett Sender-oldali beállítás is segíthet.'],
  [/(^|\.)stripe\.(com|network)$/i, 'Stripe', 'A Stripe csak az áruházban (/beebolt, /product, /checkout) kell; vedd ki a site-szintű Custom Code-ból.'],
  [/cookieyes\.com|cdn-cookieyes/i, 'CookieYes', 'A hozzájárulás-kezelő kell, de a konfigurációs fájl legyen cache-elhető; nincs mit tenni, ha < 150 ms.'],
  [/clarity\.ms/i, 'Clarity', 'A Clarity szkriptet a hozzájárulás utánra késleltesd (CookieYes: blokkolt, amíg nincs hozzájárulás).'],
  [/googletagmanager\.com|google-analytics\.com|analytics\.google\.com/i, 'Google Analytics / Tag Manager', 'A GA4-et a hozzájárulás után indítsd; a Tag Managerben ne legyen felesleges címke.'],
  [/sender\.net/i, 'Sender (hírlevél)', 'A Sender widgetet csak az űrlapot tartalmazó oldalakon és késleltetve töltsd.'],
  [/trustindex/i, 'Trustindex', 'A Trustindex-widget lusta betöltésű legyen (csak amikor a látogató odagörget).'],
  [/facebook\.(net|com)|connect\.facebook/i, 'Meta/Facebook', 'Csak hozzájárulás után, és csak ha használjátok a hirdetésmérést.'],
  [/linkedin\.com|licdn\.com/i, 'LinkedIn', 'Csak hozzájárulás után, és csak ha használjátok.'],
  [/fonts\.(googleapis|gstatic)\.com/i, 'Google Fonts', 'Tárold a betűtípust a Webflow-n (self-host), így nincs külső kérés.'],
  [/youtube|ytimg|youtube-nocookie/i, 'YouTube', 'Használj kattintásra induló előnézeti képet (facade) a beágyazott videó helyett.'],
  [/(^|\.)google\.com$|gstatic\.com/i, 'Google (egyéb)', 'Nézd meg, melyik widget tölti (térkép, reCAPTCHA, betűtípus), és késleltesd.'],
];
export const serviceOf = (host, paths = []) => {
  const hay = host + ' ' + paths.join(' ');
  for (const [re, name, fix] of SERVICES) if (re.test(hay)) return { name, fix };
  return { name: '', fix: 'Töltsd késleltetve (hozzájárulás/első interakció után), vagy hagyd el, ha nem hoz üzleti értéket.' };
};

/** Gazdagépenkénti összegzés a hálózati naplóból (a nem első fél gazdák). */
export function hostSummary(reqs, isFirst) {
  const h = new Map();
  for (const r of reqs) {
    let u; try { u = new URL(r.url); } catch { continue; }
    const o = h.get(u.hostname) || { host: u.hostname, reqs: 0, bytes: 0, paths: [], top: { bytes: -1, name: '' } };
    o.reqs++; o.bytes += r.bytes || 0;
    const p = u.pathname.split('/').slice(0, 3).join('/'); if (o.paths.length < 4 && !o.paths.includes(p)) o.paths.push(p);
    if ((r.bytes || 0) > o.top.bytes) o.top = { bytes: r.bytes || 0, name: u.pathname.split('/').pop().slice(0, 40) };
    h.set(u.hostname, o);
  }
  const third = [...h.values()].filter(o => !isFirst(o.host)).map(o => ({ host: o.host, reqs: o.reqs, kb: Math.round(o.bytes / 1024), paths: o.paths, top: o.top.name ? `${o.top.name} ${Math.round(o.top.bytes / 1024)} kB` : '', cpuMs: null, service: serviceOf(o.host, o.paths).name }));
  const first = [...h.values()].filter(o => isFirst(o.host));
  return { third: third.sort((a, b) => b.kb - a.kb), firstKB: Math.round(first.reduce((s, o) => s + o.bytes, 0) / 1024), firstReqs: first.reduce((s, o) => s + o.reqs, 0) };
}

/** Főszál önidő gazdagépenként (ms) egy külön, 4× lassított mobil betöltésből. Hibánál null (nem torzítja a többit). */
export async function cpuByHost(browser, url, { vp = [390, 844], throttle = 4, isFirst, maxMs = 45000 } = {}) {
  let ctx;
  try {
    ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, locale: 'hu-HU' });
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
    await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 }); await cdp.send('Profiler.start');
    await Promise.race([page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(() => {}), new Promise(r => setTimeout(r, maxMs))]);
    await page.waitForTimeout(3000);
    const { profile } = await cdp.send('Profiler.stop');
    const byId = new Map(profile.nodes.map(n => [n.id, n])); const by = {}; let total = 0, firstMs = 0;
    for (let i = 0; i < profile.samples.length; i++) {
      const dt = (profile.timeDeltas[i + 1] ?? profile.timeDeltas[i] ?? 0) / 1000; if (!(dt > 0) || dt > 200) continue; // a hosszú „üres” rés nem szkript
      const n = byId.get(profile.samples[i]); const u = n && n.callFrame && n.callFrame.url; if (!u || !/^https?:/i.test(u)) continue;
      let host; try { host = new URL(u).hostname; } catch { continue; }
      total += dt; if (isFirst(host)) { firstMs += dt; continue; }
      by[host] = (by[host] || 0) + dt;
    }
    return { samples: profile.samples.length, scriptMs: Math.round(total), firstPartyMs: Math.round(firstMs), byHost: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, Math.round(v)])) };
  } catch (e) { return { error: String(e.message).slice(0, 120) }; }
  finally { try { await ctx.close(); } catch {} }
}

export function mergeCpu(TP, cpu) {
  if (!TP) return TP;
  TP.cpu = cpu ? { samples: cpu.samples, scriptMs: cpu.scriptMs, firstPartyMs: cpu.firstPartyMs, error: cpu.error } : null;
  if (cpu && cpu.byHost) {
    for (const t of TP.third) if (cpu.byHost[t.host] != null) t.cpuMs = cpu.byHost[t.host]; else if (!cpu.error && cpu.samples) t.cpuMs = 0;
    for (const [host, ms] of Object.entries(cpu.byHost)) if (!TP.third.some(t => t.host === host)) TP.third.push({ host, reqs: 0, kb: 0, paths: [], top: '', cpuMs: ms, service: serviceOf(host).name });
  }
  return TP;
}

export function thirdPartyFindings(P, add) {
  const TP = P.perf && P.perf.thirdParty; if (!TP) return;
  for (const t of TP.third) {
    const heavyKB = t.kb > THIRD_BYTES_KB, heavyMs = t.cpuMs != null && t.cpuMs > THIRD_CPU_MS;
    if (!heavyKB && !heavyMs) continue;
    const sv = serviceOf(t.host, t.paths);
    add('perf', 'P2', `perf.third-party|${t.host}`, `Nehéz harmadik fél: ${t.host}${sv.name ? ` (${sv.name})` : ''} – ${t.kb} kB, ${t.reqs} kérés${t.cpuMs != null ? `, ${t.cpuMs} ms főszál` : ''}`,
      [`küszöb: > ${THIRD_BYTES_KB} kB vagy > ${THIRD_CPU_MS} ms (mobil, 4× CPU, hozzájárulás előtt)`, t.top && `legnagyobb: ${t.top}`].filter(Boolean), sv.fix, 3, 'tp', 9);
  }
  const path = (() => { try { return new URL(P.finalUrl || P.url).pathname; } catch { return '/'; } })();
  const st = TP.third.filter(t => STRIPE.test(t.host));
  if (st.length && !STRIPE_OK_PATH.test(path)) add('perf', 'P2', 'perf.stripe-outside-shop', `A Stripe-szkript az áruházon kívül is betöltődik (${path}): ${st.map(s => `${s.host} ${s.kb} kB`).join(', ')}`, 'Csak /beebolt, /product, /checkout alatt kell', 'Vedd ki a Stripe-ot a site-szintű Custom Code-ból (vagy az Ecommerce-beállításból), és csak az áruházi oldalakon töltsd.', 4);
}

export function thirdPartyMd(P) {
  const TP = P.perf && P.perf.thirdParty; if (!TP) return [];
  const L = [`**Harmadik fél költsége** (mobil, 4× CPU, hozzájárulás előtt; első fél: ${TP.firstKB} kB, ${TP.firstReqs} kérés${TP.cpu && TP.cpu.scriptMs != null ? `; mért szkript-főszál összesen ${TP.cpu.scriptMs} ms, ebből első fél ${TP.cpu.firstPartyMs} ms` : ''})`, ''];
  if (!TP.third.length) { L.push('_Nincs harmadik fél kérés._', ''); return L; }
  if (TP.cpu && TP.cpu.error) L.push(`_A főszál-idő mérése nem sikerült: ${cell(TP.cpu.error)}; csak bájt és kérésszám látszik._`, '');
  else if (!TP.cpu) L.push('_A főszál-idő nincs mérve (`--no-trace` vagy régi gyorsítótárból); csak bájt és kérésszám látszik._', '');
  L.push('| Gazda | Szolgáltatás | kB | Kérés | Főszál (ms) | Legnagyobb tétel |', '|---|---|---|---|---|---|');
  const top = TP.third.slice().sort((a, b) => (b.cpuMs || 0) / 3 + b.kb - ((a.cpuMs || 0) / 3 + a.kb)).slice(0, 6);
  for (const t of top) L.push(`| ${cell(t.host)} | ${cell(t.service || '–')} | ${t.kb} | ${t.reqs} | ${t.cpuMs ?? '–'} | ${cell(t.top || '–')} |`);
  L.push('');
  return L;
}

// ------------------------------------------------------------ weboldal-lábnyom (Sustainable Web Design v4)
// Forrás: https://sustainablewebdesign.org/estimating-digital-emissions/ (SWDM v4), sávok: https://sustainablewebdesign.org/digital-carbon-ratings/
// kWh/GB: adatközpont 0,055 üzemi + 0,012 beépített; hálózat 0,059 + 0,013; eszköz 0,080 + 0,081. Hálózati átlag: 494 gCO2e/kWh (Ember, világ).
// Első látogatás, gyorsítótár nélkül, zöld tárhely-korrekció nélkül (zöld tényező 0). 1 GB = 10^9 bájt (CO2.js).
const GRID = 494, KWH_PER_GB = 0.055 + 0.012 + 0.059 + 0.013 + 0.080 + 0.081; // = 0,300
export const G_PER_GB = KWH_PER_GB * GRID; // ≈ 148,2 g/GB
export const CARBON_P3_G = 0.5; // ~3,4 MB: a medián (2,4 MB, 0,36 g, F-sáv határa) kb. 1,4-szerese
export const carbonG = bytes => (bytes / 1e9) * G_PER_GB;
export const RATINGS = [['A+', 0.040], ['A', 0.079], ['B', 0.145], ['C', 0.209], ['D', 0.278], ['E', 0.359]]; // F: ≥ 0,360 g
export const carbonRating = g => (RATINGS.find(([, max]) => g <= max) || ['F'])[0];

export function carbonOf(P) {
  const vps = Object.entries(P.vp || {}).filter(([, v]) => v && v.xferKB != null);
  if (!vps.length) return null;
  const big = vps.slice().sort((a, b) => (+b[0].split('x')[0]) - (+a[0].split('x')[0]))[0];
  const bytes = big[1].xferKB * 1024; const g = carbonG(bytes);
  return { viewport: big[0], kb: big[1].xferKB, g: +g.toFixed(3), rating: carbonRating(g), model: 'SWD v4' };
}
export function carbonFindings(P, add) {
  const c = P.carbon; if (!c) return;
  if (c.g > CARBON_P3_G) add('perf', 'P3', 'perf.carbon', `Nagy weboldal-lábnyom: ${c.g.toFixed(2).replace('.', ',')} g CO2e oldalmegtekintésenként (${c.rating} sáv; a medián oldal ≈ 0,36 g)`, `${(c.kb / 1024).toFixed(1)} MB letöltött adat (${c.viewport} nézet, első látogatás); küszöb: > ${CARBON_P3_G} g`, 'Az adatmennyiség csökkentése (képek WebP/AVIF, kevesebb harmadik fél, lazy betöltés) egyenes arányban csökkenti a lábnyomot.', 1);
}
export function carbonSiteMd(pages) {
  const rows = pages.filter(p => p.carbon && !p.fatal);
  if (!rows.length) return [];
  const avg = rows.reduce((s, p) => s + p.carbon.g, 0) / rows.length, max = rows.slice().sort((a, b) => b.carbon.g - a.carbon.g)[0];
  const fmt = g => g.toFixed(3).replace('.', ',');
  const bands = {}; for (const p of rows) bands[p.carbon.rating] = (bands[p.carbon.rating] || 0) + 1;
  return ['## Weboldal-lábnyom (becslés)', '',
    `Átlag **${fmt(avg)} g CO2e / oldalmegtekintés** (${rows.length} oldal; sávok: ${Object.entries(bands).map(([b, n]) => `${b}: ${n}`).join(', ')}); a legnagyobb: ${max.slug} (${fmt(max.carbon.g)} g, ${max.carbon.rating}). Az éves hatás ≈ oldalmegtekintések × g.`, '',
    `Módszer: Sustainable Web Design v4 (CO2.js is ezt használja): letöltött bájt (legnagyobb nézet, első látogatás, gyorsítótár nélkül) × ${G_PER_GB.toFixed(1).replace('.', ',')} g CO2e/GB (adatközpont + hálózat + eszköz, üzemi + beépített energia, 494 g/kWh világátlag, zöld tárhely-korrekció nélkül). Sávok: A+ ≤ 0,04 · A ≤ 0,079 · B ≤ 0,145 · C ≤ 0,209 · D ≤ 0,278 · E ≤ 0,359 · F ≥ 0,36 g (HTTP Archive 2023 percentilisek). Tájékoztató becslés, nem hitelesített mérés.`, ''];
}
