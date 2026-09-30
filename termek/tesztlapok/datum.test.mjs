const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const i = (id) => page.locator(`[data-case="${id}"] input.bc-input`).first();
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  await t('gépelve: „2026.10.5” → 2026. 10. 05.', async () => { await i('datum-alap').fill('2026.10.5'); await i('datum-alap').blur(); ok((await i('datum-alap').inputValue()) === '2026. 10. 05.', await i('datum-alap').inputValue()); });
  await t('nem létező nap (febr. 30.): érthető hiba', async () => { await i('datum-alap').fill('2026.02.30'); await i('datum-alap').blur(); ok(await page.locator('[data-case="datum-alap"] .bc-error').isVisible(), 'nincs hiba'); });
  await t('betű nem írható be', async () => { await i('datum-alap').fill(''); await i('datum-alap').pressSequentially('ab2026'); ok((await i('datum-alap').inputValue()) === '2026', await i('datum-alap').inputValue()); });
  await t('tartományon kívül gépelve: a határra áll + jelzés', async () => {
    await i('datum-hatar').fill('2027.01.10'); await i('datum-hatar').blur();
    ok((await out('hatar')).includes('2026-12-31'), await out('hatar')); ok(await page.locator('[data-case="datum-hatar"] .bc-notice').isVisible(), 'nincs jelzés');
  });
  await t('naptár: nyíl + Enter választ, a tiltott nap nem választható', async () => {
    await page.locator('[data-case="datum-hatar"] .bc-icon-btn').click(); await page.waitForSelector('.bc-cal');
    ok((await page.locator('.bc-day:disabled').count()) > 0, 'nincs tiltott nap');
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Enter'); ok((await out('hatar')).includes('2026-12-30'), await out('hatar'));
  });
  await t('hétfővel kezdődik a hét', async () => { await page.locator('[data-case="datum-alap"] .bc-icon-btn').click(); ok((await page.locator('.bc-cal-grid th').first().innerText()) === 'H', 'nem hétfő'); await page.keyboard.press('Escape'); });
  await t('időpont: „2575” → 23:59', async () => { const ti = page.locator('[data-case="datum-ido"] .bc-time'); await ti.fill('2575'); await ti.blur(); ok((await ti.inputValue()) === '23:59', await ti.inputValue()); });
  await t('szökőnap megjelenik', async () => ok((await i('datum-szokonap').inputValue()) === '2028. 02. 29.', await i('datum-szokonap').inputValue()));
}
