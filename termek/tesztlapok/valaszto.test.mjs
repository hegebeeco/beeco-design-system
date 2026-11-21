const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  await t('ékezet nélkül is talál („kave” → kávézó), Enter választ', async () => {
    const i = c('combo-egy').locator('input'); await i.click(); await i.pressSequentially('kave');
    ok((await page.locator('[role=option]').first().innerText()).includes('kávézó'), 'nem találta');
    await page.keyboard.press('Enter'); ok((await out('egy')).includes('t5'), await out('egy'));
  });
  await t('opciók akadálymentes neve: minden role=option elemnek van neve, és az a látható felirat (kiemeléssel, ✓-val, „+ Új” opcióval is)', async () => {
    // Az akadálymentességi fa (képernyőolvasó, böngészőügynök) nem mindig rakja össze a nevet a kiemelés (<mark>) által szétvágott tartalomból:
    // az opciónak ezért kimondott neve (aria-label) van. A név a látható felirat (WCAG 2.5.3); a „✓” és az „+ Új” jele nem része.
    const neve = (sel) => page.locator(sel).evaluateAll((els) => els.map((e) => ({ name: e.getAttribute('aria-label'), text: (e.innerText || '').replace(/^[✓+\s]+/, '').trim(), jelolt: e.querySelectorAll('mark').length })));
    const i = c('combo-tobb').locator('input'); await i.click(); await i.pressSequentially('k'); // „k”: kiemelés + „Új: „k”” opció; a „kávézó” kijelölt (✓)
    const tobb = await neve('[role=option]'); ok(tobb.length >= 3, `kevés opció: ${JSON.stringify(tobb)}`);
    ok(tobb.some((o) => o.jelolt), 'a próba nem bizonyít semmit: nincs kiemelt (<mark>) opció');
    for (const o of tobb) ok(o.name && o.name === o.text, `az opció neve („${o.name}”) nem a látható felirat („${o.text}”)`);
    ok((await page.getByRole('option', { name: 'kávézó', exact: true }).count()) === 1, 'a „kávézó” opció név szerint nem érhető el');
    ok((await page.getByRole('option', { name: 'Új: „k”', exact: true }).count()) === 1, 'az „Új” opció név szerint nem érhető el');
    await page.keyboard.press('Escape');
    const e = c('combo-egy').locator('input'); await e.click(); await e.fill(''); await e.pressSequentially('kave'); // ékezet nélküli keresés: a kiemelés „kavé” hosszú
    const egy = await neve('[role=option]'); ok(egy.length > 0 && egy.every((o) => o.name && o.name === o.text), `egyesnél: ${JSON.stringify(egy)}`);
    await page.keyboard.press('Escape');
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
  await t('új címke megszakítva: csendes, a beírt név megmarad, nem vesz fel', async () => {
    await c('tag-megszakit').locator('.bc-tag.is-add').click(); await page.keyboard.type('Kert'); await page.keyboard.press('Enter');
    await page.waitForTimeout(50);
    ok((await out('tagmegszakit')).includes('nincs'), 'felvette'); ok(await c('tag-megszakit').locator('input').inputValue() === 'Kert', 'elveszett a név');
    ok(await c('tag-megszakit').locator('.bc-error').count() === 0, 'hibát mutat megszakításra');
  });
  await t('új címke szerverhibával: a hiba a mező alatt látszik', async () => {
    await c('tag-szerverhiba').locator('.bc-tag.is-add').click(); await page.keyboard.type('Kert'); await page.keyboard.press('Enter');
    ok(await c('tag-szerverhiba').getByText('már létezik a szerveren').isVisible(), 'nem szól a hibáról'); ok((await out('tagszerverhiba')).includes('nincs'), 'felvette');
  });
  await t('25 címkénél legördülő jelenik meg', async () => ok(await c('tag-sok').locator('[role=combobox]').count() === 1, 'nem legördülő'));
}
