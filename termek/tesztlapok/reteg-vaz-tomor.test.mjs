const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  await t('asztal (egér): tömör sorok, a 11 menüpont és a 3 csoportcím görgetés nélkül elfér', async () => {
    const link = page.getByRole('link', { name: 'Kuponok' });
    const h = (await link.boundingBox()).height;
    ok(h >= 34 && h <= 38, `a menüpont magassága ${h} (36 px várt)`);
    for (const c of ['Kínálatod', 'Tudás és közösség', 'Fiók és segítség']) ok(await page.getByText(c, { exact: true }).count() === 1, `nincs csoportcím: ${c}`);
    const sav = await page.locator('.bc-sidebar-links').evaluate((el) => el.scrollHeight <= el.clientHeight);
    ok(sav, 'a menü görgetni kell 1280×800-on');
  });
  await t('érintés: a 44 px-es érintési felület marad (telefonos fiók)', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await page.getByRole('button', { name: 'Menü megnyitása' }).click(); const d = page.getByRole('dialog'); await d.waitFor();
      const h = (await d.getByRole('link', { name: 'Kuponok' }).boundingBox()).height;
      ok(h >= 44 || !(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)), `érintésen ${h} px (≥ 44 várt)`);
      ok(await d.evaluate((el) => el.classList.contains('is-compact')), 'a fiók nem kapta meg a tömör jelölőt');
      await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
}
