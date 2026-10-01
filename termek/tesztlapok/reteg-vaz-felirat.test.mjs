const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  await t('asztal: a becsukó gomb és a fiókmenü neve a megadott felirat', async () => {
    ok(await page.getByRole('button', { name: 'Collapse menu' }).count() === 1, 'nincs „Collapse menu”');
    ok(await page.getByRole('button', { name: 'User menu: Sample Partner Ltd.' }).count() === 1, 'nincs angol fiókmenü-név');
    await page.getByRole('button', { name: 'Collapse menu' }).click();
    ok(await page.getByRole('button', { name: 'Expand menu' }).count() === 1, 'becsukva nincs „Expand menu”');
    await page.getByRole('button', { name: 'Expand menu' }).click();
  });
  await t('súgó: srLabel a képernyőolvasó neve', async () => ok(await page.getByRole('button', { name: 'Help: Company name' }).count() === 1, 'nincs srLabel'));
  await t('téma-váltó a sáv alján, angol névvel', async () => ok(await page.getByRole('button', { name: 'Switch to dark mode' }).count() === 1, 'nincs angol téma-gomb'));
  await t('telefon: a fiók-menü nyitó/záró gombja angolul', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await page.getByRole('button', { name: 'Open menu' }).click(); const d = page.getByRole('dialog'); await d.waitFor();
      ok(await d.getByRole('button', { name: 'Close menu' }).count() === 1, 'nincs „Close menu”');
      await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
}
