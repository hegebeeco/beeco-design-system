// Forgatókönyv – Rétegek: alkalmazás-váz (ugrólink, aria-current, telefonos fiók). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const act = () => page.evaluate(() => ({ id: document.activeElement?.id, text: (document.activeElement?.textContent || '').trim(), label: document.activeElement?.getAttribute('aria-label') }));
  await t('az első Tab az ugrólinkre megy, Enter a tartalomra ugrik', async () => {
    await page.keyboard.press('Tab'); ok((await act()).text === 'Ugrás a tartalomra', JSON.stringify(await act()));
    const r = await page.locator('.bc-skip').boundingBox(); ok(r.y >= 0, 'az ugrólink fókuszban sem látszik');
    await page.keyboard.press('Enter'); await until(async () => (await act()).id === 'bc-content', 'nem ugrott a tartalomra');
  });
  await t('asztalon az oldalsáv látszik, a mostani oldal aria-current', async () => {
    ok(await page.locator('nav.bc-sidebar').isVisible(), 'nincs oldalsáv'); ok((await page.locator('[aria-current="page"]').first().innerText()).includes('Partnerek'), 'nincs aria-current');
    ok((await page.getByRole('button', { name: 'Menü megnyitása' }).count()) === 0, 'asztalon is van ☰');
  });
  await t('telefonon (390 px): ☰ nyitja a fiókot, Esc zár, a fókusz a ☰-re tér vissza', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      const burger = page.getByRole('button', { name: 'Menü megnyitása' }); await burger.waitFor(); await burger.focus(); await page.keyboard.press('Enter');
      const d = page.getByRole('dialog'); await d.waitFor(); ok((await d.getByRole('link').count()) >= 6, 'nincs menü a fiókban');
      ok((await act()).label === 'Menü bezárása', `fókusz: ${JSON.stringify(await act())}`);
      await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
      await until(() => burger.evaluate((e) => e === document.activeElement), 'a fókusz nem tért vissza');
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
  await t('telefonon: menüpontra koppintva navigál és bezár', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await page.getByRole('button', { name: 'Menü megnyitása' }).click(); const d = page.getByRole('dialog'); await d.waitFor();
      await d.getByRole('link', { name: 'Kuponok' }).click(); await d.waitFor({ state: 'detached' });
      ok((await page.locator('[data-out="oldal"]').innerText()).includes('kuponok'), 'nem navigált');
      ok((await page.locator('h1').innerText()) === 'Kuponok', 'a cím nem követte');
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
  await t('asztalon nincs fejléc: a tartalom az oldal tetejéig ér', async () => {
    await until(async () => (await page.locator('header.bc-topbar').count()) === 0, 'van fejléc'); const r = await page.locator('#bc-content').boundingBox(); ok(r.y <= 1, `a tartalom ${r.y} px-nél kezdődik`);
  });
  await t('a sáv becsukható: csak ikonok, a link neve megmarad, újratöltés után is csukva, kinyitható', async () => {
    try {
      const btn = page.getByRole('button', { name: 'Menü becsukása' }); ok((await btn.getAttribute('aria-expanded')) === 'true', 'aria-expanded');
      await btn.click(); await until(async () => (await page.locator('nav.bc-sidebar').boundingBox()).width < 100, 'nem csukódott be');
      await page.waitForTimeout(300); ok((await page.locator('nav.bc-sidebar').boundingBox()).width < 100, 'széles maradt');
      ok(await page.getByRole('link', { name: 'POI-k' }).isVisible(), 'a link neve elveszett');
      await page.reload(); await page.locator('nav.bc-sidebar').waitFor();
      const open = page.getByRole('button', { name: 'Menü kinyitása' }); await open.waitFor(); ok((await open.getAttribute('aria-expanded')) === 'false', 'nem jegyezte meg');
      await open.focus(); await page.keyboard.press('Enter'); await page.getByRole('button', { name: 'Menü becsukása' }).waitFor();
    } finally { await page.evaluate(() => { try { localStorage.removeItem('bc-shell:tesztlap'); } catch { /* */ } }); }
  });
  await t('felhasználó a sáv alján: menü kijelentkezéssel, Esc zár', async () => {
    const acc = page.locator('.bc-sidebar-foot .bc-account'); ok(await acc.isVisible(), 'nincs felhasználó'); await acc.click();
    const m = page.getByRole('menu'); await m.waitFor(); ok(await m.getByRole('menuitem', { name: 'Kijelentkezés' }).isVisible(), 'nincs kijelentkezés');
    await page.keyboard.press('Escape'); await m.waitFor({ state: 'detached' }); ok(await acc.evaluate((e) => e === document.activeElement), 'a fókusz nem tért vissza');
  });
  await t('telefonon a fiókban is ott a felhasználó', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await page.getByRole('button', { name: 'Menü megnyitása' }).click(); const d = page.getByRole('dialog'); await d.waitFor();
      ok(await d.locator('.bc-account').isVisible(), 'nincs felhasználó a fiókban'); await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
}
