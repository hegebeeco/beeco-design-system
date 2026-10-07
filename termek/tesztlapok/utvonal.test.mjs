// Forgatókönyv – Utvonal (06d): ol + aria-current, állapot szövegesen is, egy fő gomb, görgetés a saját dobozban (a mostani középen),
// telefonon nincs oldal-kilógás (a .bc-sr sem szökik ki), billentyűzet, késés, hiányzó segítő, üres, végigért. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const fogomb = (id) => c(id).locator('.bc-btn:not(.is-secondary):not(.is-ghost)');

  await t('lista: <ol>, pontosan egy aria-current="step", a mostani szakaszon', async () => {
    for (const id of ['tomor', 'teljes', 'sok', 'hosszu']) {
      ok((await c(id).locator('ol').count()) === 1, `${id}: nincs ol`);
      ok((await c(id).locator('[aria-current="step"]').count()) === 1, `${id}: nem egy aria-current`);
    }
    ok((await c('tomor').locator('[aria-current="step"]').innerText()).includes('Rajba sorolás'), 'rossz szakasz a mostani');
  });
  await t('állapot nem csak színnel: tömörben képernyőolvasó-szöveg, teljesben látható jelvény dátummal', async () => {
    const sr = await c('tomor').locator('ol li .bc-sr').allInnerTexts();
    ok(sr.length === 6 && sr[0].includes('kész') && sr[2].includes('most itt tartasz') && sr[3].includes('ezután jön'), sr.join('|'));
    const jel = await c('teljes').locator('.bc-ut-head .bc-badge').allInnerTexts();
    ok(jel[0] === 'Kész · 2026. 09. 12.' && jel[1] === 'Kihagyva' && jel[2] === 'Most itt tartasz' && jel[3] === 'Ezután jön', jel.join('|'));
  });
  await t('ISO időpontból is magyar dátum (a 2. szakasz a tömör alapban)', async () => {
    ok((await c('sok-teljes').locator('.bc-ut-head .bc-badge').first().innerText()).startsWith('Done · 2026. 08. 15.'), 'nincs dátum / labels');
  });
  await t('pontosan egy fő gomb minden esetben, ahol van következő lépés; a teljesben a mostani szakaszon belül', async () => {
    for (const id of ['tomor', 'kesik', 'nincs-segito', 'extra', 'sok', 'hosszu-tomor', 'ures-tomor', 'teljes', 'hosszu', 'kesz']) ok((await fogomb(id).count()) === 1, `${id}: ${await fogomb(id).count()} fő gomb`);
    ok((await c('teljes').locator('[aria-current="step"] .bc-btn').count()) === 1, 'a gomb nem a mostani szakaszban');
    ok((await fogomb('tomor').getAttribute('href')) === '#rajok', 'a gomb nem link');
    ok((await fogomb('ures').count()) === 0 && (await fogomb('kesz-tomor').count()) === 0, 'fölösleges gomb');
  });
  await t('tömör: a mostani szakasz középre gördül a saját dobozában (14 szakasz)', async () => {
    const r = await c('sok').locator('.bc-ut-map').evaluate((el) => {
      const cur = el.querySelector('[aria-current="step"]'); const b = el.getBoundingClientRect(); const k = cur.getBoundingClientRect();
      return { sl: el.scrollLeft, over: el.scrollWidth > el.clientWidth, d: Math.abs((k.left + k.width / 2) - (b.left + b.width / 2)), pos: getComputedStyle(el).position };
    });
    ok(r.pos === 'relative', 'a görgető doboz nem position: relative');
    if (r.over) ok(r.sl > 0 && r.d < 40, `nincs középen: scrollLeft ${r.sl}, eltérés ${Math.round(r.d)} px`);
  });
  await t('telefonon (320): a térkép a dobozában görget, az oldal nem lóg ki (a .bc-sr sem)', async () => {
    await page.setViewportSize({ width: 320, height: 640 }); await page.reload(); await page.waitForSelector('[data-case]'); await page.waitForTimeout(100);
    const r = await page.evaluate(() => {
      const m = document.querySelector('[data-case="sok"] .bc-ut-map'); const cur = m.querySelector('[aria-current="step"]');
      const b = m.getBoundingClientRect(); const k = cur.getBoundingClientRect();
      return { lap: document.documentElement.scrollWidth - innerWidth, over: m.scrollWidth > m.clientWidth, d: Math.abs((k.left + k.width / 2) - (b.left + b.width / 2)), sl: m.scrollLeft };
    });
    ok(r.lap <= 0, `az oldal ${r.lap} px-szel kilóg`); ok(r.over, 'a 14 szakasz nem görget'); ok(r.sl > 0 && r.d < 40, `nincs középen (${Math.round(r.d)} px)`);
    await page.setViewportSize({ width: 1280, height: 800 }); await page.reload(); await page.waitForSelector('[data-case]');
  });
  await t('billentyűzet: a görgető doboz fókuszálható, nyíllal görget; a gomb Enterrel működik', async () => {
    const m = c('sok').locator('.bc-ut-map');
    ok((await m.getAttribute('tabindex')) === '0' && (await m.getAttribute('role')) === 'region' && (await m.getAttribute('aria-label')).includes('görgethető'), 'nincs régió');
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(50);
    await m.evaluate((el) => { el.scrollLeft = 0; }); await m.focus(); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200);
    ok((await m.evaluate((el) => el.scrollLeft)) > 0, 'a nyíl nem görget');
    await page.setViewportSize({ width: 1280, height: 800 });
    const g = c('kattint').getByRole('button', { name: 'Logó feltöltése' });
    await g.click(); await g.focus(); await page.keyboard.press('Enter');
    ok((await c('kattint').locator('[data-out="kattint"]').innerText()).includes('2'), 'a gomb nem működik');
    const h = await g.evaluate((el) => el.getBoundingClientRect().height); ok(h >= 44, `gomb ${h} px`);
  });
  await t('határidő: hátralévő idő (info), késés (figyelmeztetés + kíméletes mondat a segítőre)', async () => {
    const b = c('tomor').locator('.bc-ut-meta .bc-badge'); ok((await b.innerText()) === 'Rajba sorolás: még 30 óra' && (await b.getAttribute('class')).includes('is-info'), await b.innerText());
    const k = c('kesik').locator('.bc-ut-meta .bc-badge'); ok((await k.innerText()) === 'Rajba sorolás: 2 napja lejárt' && (await k.getAttribute('class')).includes('is-warning'), await k.innerText());
    ok((await c('kesik').locator('.bc-ut-nyugi').innerText()).includes('segítődnek'), 'nincs megnyugtatás');
    ok((await c('extra').locator('.bc-ut-meta .bc-badge').innerText()) === 'még kevesebb mint 1 óra', 'fél óra');
  });
  await t('segítő: linkkel (44 px), név nélkül link nélkül, hiányzó segítő kíméletes szöveggel', async () => {
    const l = c('tomor').getByRole('link', { name: 'Kovács Anna' }); ok((await l.getAttribute('href')) === '#profil-anna', 'nincs link');
    ok((await l.evaluate((el) => el.getBoundingClientRect().height)) >= 44, 'a segítő-link kisebb 44 px-nél');
    ok((await c('kesik').locator('.bc-ut-segito b').innerText()) === 'Kovács Anna', 'nincs név');
    ok((await c('nincs-segito').locator('.bc-ut-segito.is-missing').innerText()).includes('keresünk'), 'nincs hiányzó-segítő szöveg');
    ok((await c('nincs-segito').locator('.bc-ut-nyugi').innerText()).includes('amikor tudod'), 'a késés-szöveg segítőre hivatkozik, pedig nincs');
  });
  await t('mostani szakasz: sorszám és összes, cím, leírás; kiegészítés (Progress) a lépés fölött', async () => {
    ok((await c('tomor').locator('.bc-ut-kicker').innerText()) === 'Most itt tartasz · 3. szakasz (összesen 6)', await c('tomor').locator('.bc-ut-kicker').innerText());
    ok((await c('tomor').locator('.bc-ut-now-title').evaluate((el) => el.tagName)) === 'H3', 'nem h3');
    ok(await c('extra').locator('.bc-ut-extra [role="progressbar"]').isVisible(), 'nincs Progress');
  });
  await t('végigért: siker-sáv, nincs aria-current; a teljesben a záró teendő is megvan', async () => {
    for (const id of ['kesz', 'kesz-tomor']) {
      ok((await c(id).locator('.bc-ut-done').innerText()).includes('Végigértél'), `${id}: nincs siker`);
      ok((await c(id).locator('[aria-current]').count()) === 0, `${id}: maradt aria-current`);
    }
    ok(await c('kesz').getByRole('link', { name: 'Mentor leszek' }).isVisible(), 'nincs záró teendő');
  });
  await t('üres: üres állapot magyarázattal; teendővel vagy anélkül', async () => {
    ok((await c('ures-tomor').locator('.bc-empty').innerText()).includes('Még nincs kijelölt út'), 'nincs üres állapot');
    ok(await c('ures-tomor').getByRole('link', { name: 'Jelentkezem' }).isVisible(), 'nincs teendő');
    ok((await c('ures').locator('ol').count()) === 0 && (await c('ures').locator('.bc-empty').isVisible()), 'üres lista jelent meg');
  });
  await t('hosszú címek nem lógnak ki a dobozukból', async () => {
    for (const id of ['hosszu', 'hosszu-tomor']) {
      const ki = await c(id).evaluate((box) => { const b = box.getBoundingClientRect(); return [...box.querySelectorAll('.bc-ut-title, .bc-ut-now-title, .bc-ut-next, .bc-btn')].filter((e) => e.getBoundingClientRect().right > b.right + 1).length; });
      ok(ki === 0, `${id}: ${ki} elem kilóg`);
    }
  });
}
