// Forgatókönyv – Dashboard (06c): szám-felpörgés csak egyszer, időszakváltás, egy méhecske, grafikon-rács telefonon, állapotok, nyomtatás (Javaslat 20–21). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 60; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const base = page.url().split('?')[0];
  const go = async (a) => { await page.goto(a ? `${base}?allapot=${a}` : base); await page.waitForSelector('[data-case]'); };
  const val = async (label) => { const v = page.locator('.bc-stat', { hasText: label }).locator('.bc-stat-value'); if (!(await v.count())) return null; return Number((await v.innerText()).replace(/[^\d]/g, '')); };

  await t('első megjelenés: a szám felpörög (közben kisebb), a végén a valódi érték', async () => {
    await page.reload(); await page.waitForSelector('.bc-stat-value');
    const korai = await val('Beváltott kuponok'); ok(korai !== null && korai < 1046, `nem pörgött: ${korai}`);
    await until(async () => (await val('Beváltott kuponok')) === 1046, 'nem érte el a végértéket');
  });
  await t('időszakváltás (gyors választó): töltés után a szám AZONNAL a végérték – nem pörög újra', async () => {
    await page.getByRole('radio', { name: 'Utolsó 30 nap' }).or(page.getByRole('button', { name: 'Utolsó 30 nap' })).first().click();
    await page.locator('.bc-stat-skel').first().waitFor({ timeout: 2000 });
    const seen = [];
    for (let i = 0; i < 60; i++) { const v = await val('Beváltott kuponok'); if (v !== null) seen.push(v); if (seen.length >= 8) break; await page.waitForTimeout(20); }
    ok(seen.length > 0, 'nem töltött be'); ok(seen.every((v) => v === 342), `felpörgött: ${seen.join(', ')}`);
    ok((await page.locator('[data-out="idoszak"]').innerText()).includes('30 nap'), 'nem váltott');
  });
  await t('legfeljebb egy méhecske (mérföldkő), szóvicc mellett a sima jelentés; egy h1', async () => {
    ok((await page.locator('.bc-bee:visible').count()) === 1, 'nem egy méhecske'); ok((await page.locator('[data-pillanat="merfoldko"] .bc-moment-text').innerText()).length > 5, 'nincs sima jelentés');
    ok((await page.locator('h1').count()) === 1, 'nem egy h1');
    ok((await page.locator('h2.bc-sr').count()) === 2, 'nincs szakasz-cím'); ok((await page.locator('.bc-chart-card h3').count()) === 3, 'a grafikon-cím nem h3');
  });
  await t('grafikon-rács: asztalon 2 oszlop (a széles teljes sor), telefonon 1 oszlop', async () => {
    const lefts = () => page.locator('.bc-sablon-charts > .bc-chart-card').evaluateAll((l) => l.map((e) => Math.round(e.getBoundingClientRect().left)));
    let l = await lefts(); ok(l[1] !== l[2], `asztalon nem 2 oszlop: ${l}`);
    await page.setViewportSize({ width: 390, height: 844 });
    try { await page.waitForTimeout(150); l = await lefts(); ok(new Set(l).size === 1, `telefonon nem 1 oszlop: ${l}`); ok(await page.evaluate(() => document.documentElement.scrollWidth <= 391), 'kilógás'); }
    finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
  await t('nincs adat: „—” a csempéken, a grafikonok üres állapota, méhecske nincs', async () => {
    await go('ures'); ok((await page.locator('.bc-stat-value.is-missing').count()) === 4, 'nem „—”');
    ok((await page.getByText('Ebben az időszakban nincs adat').count()) === 3, 'nincs üres grafikon-állapot'); ok((await page.locator('.bc-bee').count()) === 0, 'van méhecske');
  });
  await t('töltés: csontváz a csempéken és a grafikonokon', async () => {
    await go('toltes'); ok((await page.locator('.bc-stat-skel').count()) === 4, 'nincs csempe-csontváz'); ok((await page.locator('.bc-chart-skel').count()) === 3, 'nincs grafikon-csontváz');
  });
  await t('hiba → újrapróbálás; nincs jogosultság → jelzés, időszak-választó nélkül', async () => {
    await go('hiba'); await page.getByRole('button', { name: 'Újrapróbálás' }).click(); await page.locator('.bc-stat').first().waitFor();
    await go('tiltott'); ok((await page.innerText('body')).includes('Ehhez nincs jogosultságod'), 'nincs jelzés'); ok((await page.locator('.bc-sablon-toolbar').count()) === 0, 'van időszak-választó');
    await go();
  });
  await t('nyomtatás (Javaslat 20): keret, menü, vezérlők rejtve; a lap világos témára vált, utána visszaáll', async () => {
    ok(await page.evaluate(() => document.documentElement.classList.contains('bc-print-page')), 'nincs bc-print-page jelölő');
    await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'dark'); document.documentElement.classList.add('dark'); });
    await page.emulateMedia({ media: 'print' });
    try {
      await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
      const r = await page.evaluate(() => ({
        tema: document.documentElement.getAttribute('data-theme'), dark: document.documentElement.classList.contains('dark'),
        rejtve: ['.bc-sidebar', '.bc-sablon-toolbar .bc-field', '.bc-sablon-toolbar .bc-seg', '.bc-help-btn', '.bc-page-header .bc-row'].map((s) => [s, [...document.querySelectorAll(s)].every((e) => getComputedStyle(e).display === 'none')]),
        szoveg: getComputedStyle(document.querySelector('[data-out="toolbar-szoveg"]')).display !== 'none' && getComputedStyle(document.querySelector('.bc-sablon-toolbar')).display !== 'none',
        papir: getComputedStyle(document.querySelector('[data-out="csak-papiron"]')).display !== 'none',
        arnyek: getComputedStyle(document.querySelector('.bc-stat')).boxShadow, fo: Math.round(document.querySelector('.bc-main').getBoundingClientRect().left),
      }));
      ok(r.tema === 'light' && !r.dark, `a téma nyomtatáskor: ${r.tema}/${r.dark}`);
      ok(r.rejtve.every(([, v]) => v), `látszik: ${r.rejtve.filter(([, v]) => !v).map(([s]) => s).join(', ')}`);
      ok(r.szoveg, 'az eszközsor szövege (időszak) nem kerül papírra (Javaslat 21)'); ok(r.papir, 'a .bc-print-show papíron rejtve');
      ok(r.arnyek === 'none', `árnyék: ${r.arnyek}`); ok(r.fo <= 1, `a tartalom ${r.fo} px-ről indul (az oldalsáv helye maradt)`);
      await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
      ok((await page.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'dark', 'a téma nem állt vissza');
    } finally {
      await page.emulateMedia({ media: 'screen' });
      await page.evaluate(() => { document.documentElement.setAttribute('data-theme', 'auto'); document.documentElement.classList.remove('dark'); });
    }
  });
  await t('Javaslat 21: képernyőn a .bc-print-show rejtve, az eszközsor szövege látszik; csak vezérlős eszközsor papíron egészében rejtve', async () => {
    ok((await page.locator('[data-out="csak-papiron"]').isHidden()), 'a .bc-print-show képernyőn is látszik');
    ok((await page.locator('[data-out="toolbar-szoveg"]').isVisible()), 'az eszközsor szövege nem látszik');
    await go('csakvezerlo');
    await page.emulateMedia({ media: 'print' });
    try { ok(await page.evaluate(() => getComputedStyle(document.querySelector('.bc-sablon-toolbar')).display === 'none'), 'a csak vezérlős eszközsor papíron látszik (üres sor)'); }
    finally { await page.emulateMedia({ media: 'screen' }); await go(); }
  });
}
