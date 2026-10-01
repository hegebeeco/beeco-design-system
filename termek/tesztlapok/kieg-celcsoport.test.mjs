// Forgatókönyv – 06a célcsoport (feltétel hozzáadása, törlése, hibás feltétel). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const rules = (id) => c(id).locator('.bc-aud-rule');
  const est = (id) => c(id).locator('.bc-aud-estimate').innerText();

  await t('üres: mindenki megkapja, becslés látszik', async () => {
    ok((await c('aud-ures').innerText()).includes('mindenki megkapja'), 'nincs „mindenki” jelzés');
    await until(async () => (await est('aud-ures')).includes('12 480 fő'), await est('aud-ures'));
  });
  await t('hozzáadás: új sor, a fókusz az első választóra kerül, számláló 1/10', async () => {
    await c('aud-ures').getByRole('button', { name: 'Feltétel hozzáadása' }).click();
    ok((await rules('aud-ures').count()) === 1, 'nincs sor');
    ok(await rules('aud-ures').locator('select').first().evaluate((e) => e === document.activeElement), 'a fókusz nem az új soron');
    ok((await c('aud-ures').locator('.bc-aud-add .bc-count').innerText()).startsWith('1/10'), 'nincs 1/10');
  });
  await t('üres feltétel: kilépés után jelzi, mi hiányzik; a becslés kihagyja', async () => {
    await page.keyboard.press('Tab');
    ok((await rules('aud-ures').locator('.bc-error').innerText()).includes('mire szűrjön'), 'nincs hiba');
    ok((await est('aud-ures')).includes('1 hibás feltétel kimaradt'), 'a becslés nem jelzi');
  });
  await t('kitöltés: mező → feltétel → érték; a becslés és az összefoglaló frissül', async () => {
    const r = rules('aud-ures').first();
    await r.locator('select').first().selectOption('kor');
    ok((await r.locator('select').nth(1).inputValue()) === 'gte', 'nem az alap feltétel');
    await r.locator('input').fill('18'); await r.locator('input').blur();
    await until(async () => (await est('aud-ures')).includes('Életkor legalább 18 év'), await est('aud-ures'));
    ok((await rules('aud-ures').locator('.bc-error').count()) === 0, 'maradt a hiba');
    await until(async () => (await est('aud-ures')).includes('4 160 fő'), await est('aud-ures'));
  });
  await t('szám: betű nem írható, a tartományon kívüli érték a határra áll', async () => {
    const i = rules('aud-ures').first().locator('input');
    await i.fill(''); await i.pressSequentially('1a50'); await i.blur();
    ok((await i.inputValue()) === '99', `érték: ${await i.inputValue()}`);
  });
  await t('ÉS/VAGY: két feltételnél megjelenik, vált, és a sorok közti jel is vált', async () => {
    const v = c('aud-ket').getByRole('radio', { name: /VAGY/ });
    await v.click(); ok((await v.getAttribute('aria-checked')) === 'true', 'nem váltott');
    ok((await c('aud-ket').locator('.bc-aud-joiner').innerText()).includes('VAGY'), 'a jel nem váltott');
    ok((await est('aud-ket')).includes('Város: Budapest VAGY Életkor'), await est('aud-ket'));
  });
  await t('törlés: a sor eltűnik, a fókusz a hozzáadás gombra kerül', async () => {
    await c('aud-ket').getByRole('button', { name: '2. feltétel törlése' }).click();
    ok((await rules('aud-ket').count()) === 1, 'nem törölte');
    ok(await c('aud-ket').getByRole('button', { name: 'Feltétel hozzáadása' }).evaluate((e) => e === document.activeElement), 'a fókusz elveszett');
    ok((await c('aud-ket').locator('[role=radiogroup]').count()) === 0, 'egy feltételnél is van ÉS/VAGY');
  });
  await t('már nem létező mező és érték: jelzi, teendővel', async () => {
    const e = await rules('aud-hibas').locator('.bc-error').allInnerTexts();
    ok(e.some((x) => x.includes('már nem választható')) && e.some((x) => x.includes('már nem létezik')), e.join(' | '));
  });
  await t('határon: 3/3 – a hozzáadás tiltott, a számláló szöveggel is jelzi', async () => {
    ok(await c('aud-tele').getByRole('button', { name: 'Feltétel hozzáadása' }).isDisabled(), 'nem tiltott');
    ok((await c('aud-tele').locator('.bc-aud-add .bc-count').innerText()).includes('elérted a határt'), 'nincs szöveges jelzés');
  });
  await t('mentési kísérlet: minden hiba látszik, nem menthető', async () => {
    await c('aud-mentes').getByRole('button', { name: 'Mentés' }).click();
    ok((await c('aud-mentes').locator('.bc-aud-rule .bc-error').innerText()).includes('Adj meg értéket'), 'nincs hiba');
    ok((await page.locator('[data-out="mentes"]').innerText()).includes('nem menthető'), 'mentette');
  });
}
