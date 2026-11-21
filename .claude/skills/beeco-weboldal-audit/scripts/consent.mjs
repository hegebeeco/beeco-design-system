// beeco-weboldal-audit · consent.mjs – sütihozzájárulás-teszt (--consent).
// Három friss böngészőkörnyezet: (A) betöltés interakció nélkül, (R) „Elutasítom” + 5 mp, (E) „Elfogadom” + 5 mp.
// Az egyetlen kattintás, amit az audit végez: a hozzájárulási sáv gombjai. Űrlapot nem küld.
// Korlát: a sáv földrajzilag (EU-IP) célzott lehet, headlessben/nem EU-IP-ről máshogy viselkedhet.

export const FORBID_COOKIE = /^(_ga|_gid|_gat|_gcl|_fbp|_fbc|_clck|_clsk|MUID|CLID|ANONCHK|_hj)/i;
export const FORBID_REQ = [
  { name: 'Google Analytics / Tag Manager collect', re: /^https?:\/\/[^/]*(google-analytics|analytics\.google|googletagmanager|doubleclick)\.[^/]+\/.*collect/i },
  { name: 'Meta/Facebook (connect.facebook.net, facebook.com/tr)', re: /^https?:\/\/(connect\.facebook\.net|[^/]*facebook\.com\/tr)/i },
  { name: 'Microsoft Clarity collect', re: /^https?:\/\/[^/]*clarity\.ms\/collect/i },
];
const BANNER_SEL = '.cky-consent-container,.cky-banner,[class*="cookieyes"],#CybotCookiebotDialog,#onetrust-banner-sdk,.cc-window,[id*="cookie-law"],[class*="cookie-banner"],[class*="cookie-consent"]';
const REJECT_RE = /^\s*(elutasítom|elutasít|csak a szükséges(ek)?|reject( all)?|decline)\s*$/i;
const ACCEPT_RE = /^\s*(elfogadom|mindet elfogadom|összes elfogadása|mindent elfogadok|elfogad|accept( all)?)\s*$/i;

async function findBtn(page, cssSel, re) {
  try { const l = page.locator(cssSel).first(); if (await l.count() && await l.isVisible()) return { loc: l, kind: 'cookieyes' }; } catch {}
  try {
    const all = page.locator('button,a,[role=button]');
    const n = Math.min(await all.count(), 150);
    for (let i = 0; i < n; i++) {
      const el = all.nth(i);
      const t = ((await el.innerText({ timeout: 300 }).catch(() => '')) || '').trim();
      if (t && t.length < 40 && re.test(t) && await el.isVisible().catch(() => false)) return { loc: el, kind: 'generic' };
    }
  } catch {}
  return null;
}
async function snapshot(ctx, page) {
  const cookies = (await ctx.cookies()).map(c => c.name);
  const ls = await page.evaluate(() => { try { return Object.keys(localStorage); } catch { return []; } }).catch(() => []);
  const dc = await page.evaluate(() => document.cookie).catch(() => '');
  const all = [...new Set([...cookies, ...dc.split(';').map(s => s.split('=')[0].trim()).filter(Boolean)])];
  return { cookies: all, localStorage: ls, trackingCookies: all.filter(c => FORBID_COOKIE.test(c)) };
}
const trackingReqs = reqs => { const hit = new Map(); for (const r of reqs) for (const f of FORBID_REQ) if (f.re.test(r.url)) { const k = f.name; if (!hit.has(k)) hit.set(k, { name: f.name, count: 0, example: r.url.replace(/[?#].*$/, '').slice(0, 110) }); hit.get(k).count++; } return [...hit.values()]; };

/** browser: Playwright Browser; isThird: hostname => bool; → eredmény objektum */
export async function consentTest(browser, url, { isThird = () => true, waitMs = 5000 } = {}) {
  const R = { checked: true, url, note: 'A sáv földrajzilag (EU-IP) célzott lehet, a headless böngésző eltérhet egy valódi látogatótól: a „nincs sütisáv” lelet kézi ellenőrzést kér.' };
  const mk = async () => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'hu-HU', timezoneId: 'Europe/Budapest' });
    const page = await ctx.newPage(); const reqs = [];
    page.on('request', r => reqs.push({ url: r.url(), t: Date.now() }));
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(3000);
    return { ctx, page, reqs };
  };
  try {
    // A) hozzájárulás előtt
    { const { ctx, page, reqs } = await mk();
      R.bannerFound = await page.evaluate(sel => [...document.querySelectorAll(sel)].some(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 20 && r.height > 20 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.01; }), BANNER_SEL);
      R.bannerInDom = await page.evaluate(sel => !!document.querySelector(sel), BANNER_SEL);
      const rj = await findBtn(page, '.cky-btn-reject', REJECT_RE), ac = await findBtn(page, '.cky-btn-accept', ACCEPT_RE);
      R.rejectButton = !!rj; R.acceptButton = !!ac; R.bannerKind = rj?.kind || ac?.kind || (R.bannerFound ? 'ismeretlen' : null);
      const s = await snapshot(ctx, page);
      const thirdHosts = {}; for (const r of reqs) { try { const h = new URL(r.url).hostname; if (isThird(h)) thirdHosts[h] = (thirdHosts[h] || 0) + 1; } catch {} }
      R.before = { ...s, thirdPartyHosts: Object.entries(thirdHosts).sort((a, b) => b[1] - a[1]).map(([h, n]) => `${h} (${n})`), trackingRequests: trackingReqs(reqs) };
      await ctx.close(); }
    if (!R.bannerFound || !R.rejectButton && !R.acceptButton) { R.reject = { ran: false }; R.accept = { ran: false }; return R; }
    // R) elutasítás
    if (R.rejectButton) {
      const { ctx, page, reqs } = await mk();
      const b = await findBtn(page, '.cky-btn-reject', REJECT_RE);
      if (b) { const t = Date.now(); await b.loc.click({ timeout: 5000 }).catch(e => { R.reject = { ran: false, err: String(e.message).slice(0, 80) }; });
        if (!R.reject) { await page.waitForTimeout(waitMs); const s = await snapshot(ctx, page); R.reject = { ran: true, ...s, trackingRequests: trackingReqs(reqs.filter(r => r.t >= t)) }; } }
      await ctx.close();
    } else R.reject = { ran: false };
    // E) elfogadás (a sáv működik-e, mit kapcsol be)
    if (R.acceptButton) {
      const { ctx, page, reqs } = await mk();
      const b = await findBtn(page, '.cky-btn-accept', ACCEPT_RE);
      if (b) { const t = Date.now(); await b.loc.click({ timeout: 5000 }).catch(e => { R.accept = { ran: false, err: String(e.message).slice(0, 80) }; });
        if (!R.accept) { await page.waitForTimeout(waitMs); const s = await snapshot(ctx, page); R.accept = { ran: true, ...s, trackingRequests: trackingReqs(reqs.filter(r => r.t >= t)) }; } }
      await ctx.close();
    } else R.accept = { ran: false };
  } catch (e) { R.error = String(e.message).slice(0, 160); }
  return R;
}

/** Leletek a scorePage add() függvényével. have(key) = van-e már ilyen kulcsú lelet (dupla levonás ellen). */
export function consentFindings(C, add, have) {
  if (!C || !C.checked) return;
  if (C.error) { add('legal', 'P3', 'consent.error', `A hozzájárulás-teszt nem futott le: ${C.error}`, '', 'Futtasd újra; ha marad, nézd meg kézzel.', 0); return; }
  const pre = [...(C.before?.trackingCookies || []), ...(C.before?.trackingRequests || []).map(r => r.name)];
  if (!C.bannerFound) {
    const dup = have('legal.cookies-before-consent') || have('legal.no-consent-tool');
    add('legal', 'P1', 'consent.no-banner', 'Nincs sütisáv', `Hozzájárulás nélkül beállítva: sütik: ${(C.before?.cookies || []).join(', ') || 'nincs'}; localStorage: ${(C.before?.localStorage || []).join(', ') || 'nincs'}; nyomkövető kérések: ${(C.before?.trackingRequests || []).map(r => r.name).join(', ') || 'nincs'}`, 'Kapcsold be a hozzájárulás-kezelőt (CookieYes), és blokkold a mérőket elfogadásig. FIGYELEM: a sáv földrajzilag célzott lehet (EU-IP), headlessben hiányozhat: nézd meg kézzel is.', dup ? 0 : 12);
    return;
  }
  if (pre.length) add('legal', 'P1', 'consent.pre-consent', `Hozzájárulás előtt már fut követés: ${pre.join(', ')}`, `Interakció nélkül, 3 mp után; sütik: ${(C.before.trackingCookies || []).join(', ') || '–'}`, 'Állítsd a mérőket „blokkolt, amíg nincs hozzájárulás” módba (CookieYes → Cookie Manager → kategória-besorolás, GTM: Consent Mode).', have('legal.cookies-before-consent') ? 0 : 12, 'consent', 24);
  if (C.acceptButton && !C.rejectButton) add('legal', 'P2', 'consent.no-reject', 'Az első rétegen nincs „Elutasítom” gomb (az elfogadás könnyebb, mint az elutasítás)', 'Csak elfogadó gomb azonosítható', 'Tegyél egyenrangú „Elutasítom” / „Csak a szükségesek” gombot a sáv első rétegére.', 6);
  if (!C.acceptButton && !C.rejectButton) { add('legal', 'P2', 'consent.buttons-unknown', 'A sáv gombjait nem sikerült azonosítani, a teszt nem futott', 'Se .cky-btn-*, se szöveg szerint nem találtam gombot', 'Nézd meg kézzel; ha egyedi sáv, bővítsd a consent.mjs szöveglistáját.', 0); return; }
  if (C.reject?.ran) {
    for (const c of C.reject.trackingCookies) add('legal', 'P1', `consent.reject-cookie|${c}`, `Elutasítás után is megmarad/megjelenik a süti: ${c}`, '„Elutasítom” + 5 mp után', 'A CookieYes elutasításkor törölje a nem szükséges sütiket, és a szkriptek ne induljanak el (Cookie Manager → kategóriák).', 10, 'consentrej', 30);
    for (const r of C.reject.trackingRequests) add('legal', 'P1', `consent.reject-request|${r.name}`, `Elutasítás után is megy kérés ide: ${r.name} (${r.count}×)`, r.example, 'Blokkold a szkriptet elutasításig/elfogadásig (CookieYes „előzetes blokkolás”, GTM Consent Mode).', 10, 'consentrej', 30);
  } else if (C.rejectButton) add('legal', 'P3', 'consent.reject-notrun', `Az „Elutasítom” teszt nem futott le${C.reject?.err ? ': ' + C.reject.err : ''}`, '', 'Ismételd meg kézzel.', 0);
}

export function consentMd(C) {
  if (!C || !C.checked) return [];
  const L = ['**Sütihozzájárulás-teszt (`--consent`)**', ''];
  if (C.error) return [...L, `- Hiba: ${C.error}`, ''];
  L.push(`- Sütisáv: ${C.bannerFound ? 'van' : 'NINCS (a DOM-ban: ' + (C.bannerInDom ? 'igen, de nem látható' : 'nincs') + ')'}${C.bannerKind ? ' · típus: ' + C.bannerKind : ''} · „Elutasítom” gomb: ${C.rejectButton ? 'van' : 'nincs'} · „Elfogadom” gomb: ${C.acceptButton ? 'van' : 'nincs'}`);
  L.push(`- Interakció előtt: sütik: ${(C.before?.cookies || []).join(', ') || 'nincs'} · localStorage: ${(C.before?.localStorage || []).join(', ') || 'nincs'} · harmadik fél: ${(C.before?.thirdPartyHosts || []).slice(0, 8).join(', ') || 'nincs'} · követő kérések: ${(C.before?.trackingRequests || []).map(r => r.name + ' ×' + r.count).join(', ') || 'nincs'}`);
  if (C.reject?.ran) L.push(`- Elutasítás + 5 mp: sütik: ${C.reject.cookies.join(', ') || 'nincs'} · tiltott sütik: ${C.reject.trackingCookies.join(', ') || 'nincs'} · tiltott kérések: ${C.reject.trackingRequests.map(r => r.name + ' ×' + r.count).join(', ') || 'nincs'}`);
  if (C.accept?.ran) L.push(`- Elfogadás + 5 mp (itt megjelenhetnek): sütik: ${C.accept.cookies.join(', ') || 'nincs'} · követő kérések: ${C.accept.trackingRequests.map(r => r.name + ' ×' + r.count).join(', ') || 'nincs'}`);
  L.push(`- Megjegyzés: ${C.note}`, '');
  return L;
}
