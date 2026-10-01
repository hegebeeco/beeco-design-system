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
}
