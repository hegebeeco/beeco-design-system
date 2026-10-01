// Forgatókönyv – Média: térkép-öltöztetés (jelölő, csoport, vezérlők, jelmagyarázat, hőskála). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  await t('a jelölő neve a képernyőolvasónak megvan, a HTML a címben szöveg marad', async () => {
    const names = await c('terkep').locator('.bc-map-pin').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
    ok(names.some((n) => n.includes('<b>HTML-lel</b>') && n.includes('kijelölve')), names.join(' | '));
    ok((await c('terkep').locator('.bc-map-pin b').count()) === 0, 'a HTML elemként jelent meg');
  });
  await t('a kijelölt tű nagyobb, mint a többi', async () => {
    const [a, b] = await Promise.all([c('terkep').locator('.bc-map-pin.is-selected').boundingBox(), c('terkep').locator('.bc-map-pin:not(.is-selected)').first().boundingBox()]);
    ok(a.width > b.width, `${a.width} ≤ ${b.width}`);
  });
  await t('csoport: 3 méretfokozat, 12 000 → „12e+”, magyar tagolás a névben', async () => {
    const cl = c('terkep').locator('.bc-map-cluster');
    ok((await cl.evaluateAll((e) => e.map((x) => x.className.split(' ')[1]))).join() === 'is-s,is-m,is-l,is-l', 'nem 3 fokozat');
    ok((await cl.nth(3).innerText()) === '12e+', await cl.nth(3).innerText());
    ok((await cl.nth(3).getAttribute('aria-label')).startsWith('12 000 hely'), await cl.nth(3).getAttribute('aria-label'));
  });
  await t('vezérlők 44 px-esek', async () => { const b = await c('terkep').locator('.leaflet-bar a').first().boundingBox(); ok(b.width >= 44 && b.height >= 44, `${b.width}×${b.height}`); });
  await t('a jelölők Tab-bal bejárhatók', async () => {
    await c('terkep').locator('.bc-map-icon').first().focus();
    await page.keyboard.press('Tab'); ok(await page.evaluate(() => document.activeElement.classList.contains('bc-map-icon')), 'Tab nem a következő jelölőre ment');
  });
  await t('jelmagyarázat lenyitható/becsukható', async () => {
    const d = c('terkep').locator('details.bc-map-legend'); const was = await d.evaluate((e) => e.open);
    await d.locator('summary').click(); ok((await d.evaluate((e) => e.open)) !== was, 'nem váltott'); await d.locator('summary').click();
  });
  await t('lista nézet mindig elérhető (nyíllal vált)', async () => {
    await c('terkep').getByRole('radio', { name: 'Térkép' }).focus(); await page.keyboard.press('ArrowRight');
    ok((await c('terkep').locator('[data-lista] li').count()) === 5, 'nincs lista'); await page.keyboard.press('ArrowLeft');
  });
  await t('hőskála: súgó, „Hogyan olvasd?” nyílik, fokozat-táblázat', async () => {
    await c('hoskala').locator('.bc-help-btn').click(); ok(await page.locator('.bc-pop').isVisible(), 'nincs súgó'); await page.keyboard.press('Escape');
    await c('hoskala').locator('summary').click(); ok((await c('hoskala').locator('.bc-heat-how').innerText()).includes('sötétebb'), 'nem nyílt');
    ok((await c('hoskala-fok').locator('.bc-heat-steps td').count()) === 5, 'nincs 5 fokozat');
  });
  await t('heatGradient: 5 szín a tokenekből (kék sorozat)', async () => {
    const g = await page.locator('[data-out="gradiens"]').innerText(); ok((g.match(/#/g) || []).length === 5, g);
  });
}
