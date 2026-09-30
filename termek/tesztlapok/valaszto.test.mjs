const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  await t('ékezet nélkül is talál („kave” → kávézó), Enter választ', async () => {
    const i = c('combo-egy').locator('input'); await i.click(); await i.pressSequentially('kave');
    ok((await page.locator('[role=option]').first().innerText()).includes('kávézó'), 'nem találta');
    await page.keyboard.press('Enter'); ok((await out('egy')).includes('t5'), await out('egy'));
  });
  await t('többes: max. 5 után a többi tiltott, a számláló 5/5', async () => {
    const i = c('combo-tobb').locator('input'); await i.click(); await i.pressSequentially('bérl'); await page.keyboard.press('Enter');
    ok((await c('combo-tobb').locator('.bc-count').innerText()).startsWith('5/5'), await c('combo-tobb').locator('.bc-count').innerText());
    await i.fill(''); ok((await page.locator('[role=option][aria-disabled="true"]').count()) > 0, 'nincs tiltott opció');
    await page.keyboard.press('Escape');
  });
  await t('Backspace üres keresőnél kiveszi az utolsó címkét', async () => {
    const i = c('combo-tobb').locator('input'); await i.click(); await i.fill(''); const before = (await out('tobb')).split(',').length;
    await page.keyboard.press('Backspace'); ok((await out('tobb')).split(',').length === before - 1, await out('tobb')); await page.keyboard.press('Escape');
  });
  await t('új elem létrehozása a beírt szövegből', async () => {
    const i = c('combo-tobb').locator('input'); await i.click(); await i.pressSequentially('pékség');
    const create = page.locator('.bc-option.is-create'); ok(await create.isVisible(), 'nincs „+ Új”'); await create.click();
    ok((await out('tobb')).includes('uj'), await out('tobb')); await page.keyboard.press('Escape');
  });
  await t('1200 opció: legfeljebb 100 sor jelenik meg + „szűkítsd”', async () => {
    const i = c('combo-sok').locator('input'); await i.click(); await page.keyboard.press('ArrowDown');
    const list = await i.getAttribute('aria-controls'); const n = await page.locator(`[id="${list}"] [role=option]`).count(); ok(n <= 100 && n > 0, `sorok: ${n}`);
    ok(await page.getByText('szűkítsd a keresést').isVisible(), 'nincs szűkítés-jelzés'); await page.keyboard.press('Escape');
  });
  await t('nincs találat: szól', async () => { const i = c('combo-egy').locator('input'); await i.click(); await i.fill(''); await i.pressSequentially('zzzz'); ok(await page.getByText('Nincs találat').isVisible(), 'nem szól'); await page.keyboard.press('Escape'); });
  await t('címkefelhő: max. 3 után a többi tiltott', async () => {
    const tags = c('tag-felho').locator('.bc-tag:not(.is-add)'); await tags.nth(1).click(); await tags.nth(2).click();
    ok((await c('tag-felho').locator('.bc-tag:not(.is-add):disabled').count()) === 5, 'nem tiltotta a többit');
  });
  await t('címkefelhő: új címke – már létező névre szól', async () => {
    await c('tag-ures').locator('.bc-tag.is-add').click(); await page.keyboard.type('Bio'); await page.keyboard.press('Enter');
    ok((await out('tagures')).includes('uj'), 'üres listába nem vett fel');
  });
  await t('25 címkénél legördülő jelenik meg', async () => ok(await c('tag-sok').locator('[role=combobox]').count() === 1, 'nem legördülő'));
}
