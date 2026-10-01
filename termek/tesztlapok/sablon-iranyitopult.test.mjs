// Forgatókönyv – Dashboard (06c): szám-felpörgés csak egyszer, időszakváltás, egy méhecske, grafikon-rács telefonon, állapotok. Futtatja: tests/check-komponensek.js
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
}
