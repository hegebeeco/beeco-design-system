// Forgatókönyv – 06a összefésülés (mezőválasztás, eredmény, megerősítés). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const dlg = page.locator('dialog[open]');
  const res = (id, key) => c(id).locator(`[data-result="${key}"] dd`).innerText();
  await t('csak az eltérő mezők választhatók (a címkék sorrendje eltérésnek számít)', async () => {
    const f = await c('merge-ketto').locator('.bc-merge-field').evaluateAll((x) => x.map((e) => e.dataset.field));
    ok(JSON.stringify(f) === JSON.stringify(['name', 'address', 'tags', 'phone', 'website']), f.join(','));
    ok((await c('merge-ketto').locator('.bc-merge-progress').innerText()).includes('0/5'), 'nincs 0/5');
    ok(await c('merge-ketto').getByRole('button', { name: 'Összefésülés', exact: true }).isDisabled(), 'kezdetben nem tiltott');
  });
  await t('mezőválasztás: kattintás és nyilak; az eredmény-előnézet frissül', async () => {
    await c('merge-ketto').locator('[data-field="name"] label').first().click();
    ok((await res('merge-ketto', 'name')) === 'Zöld Sarok Bolt', await res('merge-ketto', 'name'));
    await page.keyboard.press('ArrowRight');
    ok((await res('merge-ketto', 'name')) === 'Zöld Sarok', 'a nyíl nem váltott');
    ok((await c('merge-ketto').locator('.bc-merge-progress').innerText()).includes('1/5'), 'nincs 1/5');
    ok((await res('merge-ketto', 'phone')).includes('még nem választottál'), 'nincs „még nem választottál”');
  });
  await t('javaslat: csak ott dönt, ahol egyetlen rekordban van érték; a meglévő döntést nem írja felül', async () => {
    await c('merge-ketto').getByRole('button', { name: 'Javaslat: a kitöltött értékek' }).click();
    ok((await res('merge-ketto', 'phone')) === '+36 30 123 4567' && (await res('merge-ketto', 'website')) === 'https://zoldsarok.hu', 'rossz javaslat');
    ok((await res('merge-ketto', 'name')) === 'Zöld Sarok', 'felülírta a döntést');
    ok((await res('merge-ketto', 'address')).includes('még nem'), 'eltérő kitöltött értéknél döntött');
  });
  await t('megmaradó rekord nélkül nem fésülhető; utána megerősítés, Mégse-re fókusz', async () => {
    await c('merge-ketto').locator('[data-field="address"] label').first().click();
    await c('merge-ketto').locator('[data-field="tags"] label').first().click();
    ok((await c('merge-ketto').locator('.bc-merge-missing').innerText()).includes('a megmaradó rekord'), 'nem jelzi a hiányt');
    await c('merge-ketto').getByRole('radio', { name: 'A · #1204' }).first().check();
    const b = c('merge-ketto').getByRole('button', { name: 'Összefésülés', exact: true }); ok(!(await b.isDisabled()), 'tiltott maradt');
    await b.click(); await until(() => dlg.isVisible(), 'nincs megerősítés');
    ok((await dlg.innerText()).includes('Megmarad: A · #1204') && (await dlg.innerText()).includes('nem vonható vissza'), await dlg.innerText());
    ok(await dlg.getByRole('button', { name: 'Mégse' }).evaluate((e) => e === document.activeElement), 'a fókusz nem a Mégse-n');
    await page.keyboard.press('Escape'); await until(async () => (await dlg.count()) === 0, 'Esc nem zárt');
    await b.click(); await dlg.getByRole('button', { name: 'Végleges összefésülés' }).click();
    await until(async () => (await page.locator('[data-case="merge-ketto"] [data-out="kesz"]').innerText()).includes('összefésülve: Zöld Sarok · +36 30 123 4567'), 'nem fésült');
  });
  await t('kötelező név üres értékkel: hiba, nem fésülhető', async () => {
    await c('merge-harom').locator('[data-field="name"] label').nth(2).click();
    ok((await c('merge-harom').locator('[data-field="name"] .bc-error').innerText()).includes('nem lehet üres'), 'nincs hiba');
    ok((await c('merge-harom').locator('.bc-merge-missing').innerText()).includes('kötelező'), 'nem jelzi');
  });
  await t('szerverhiba: az ablakban marad, kiírja, újrapróbálható', async () => {
    await c('merge-harom').getByRole('button', { name: 'Mind innen: B · #2210' }).click();
    await c('merge-harom').getByRole('button', { name: 'Összefésülés', exact: true }).click();
    await dlg.getByRole('button', { name: 'Végleges összefésülés' }).click();
    await until(async () => (await dlg.locator('[role=alert]').count()) > 0, 'nincs hiba az ablakban');
    ok((await dlg.innerText()).includes('a szerver nem válaszolt'), 'nem az ok');
    await dlg.getByRole('button', { name: 'Végleges összefésülés' }).click();
    await until(async () => (await dlg.count()) === 0, 'második próbára sem zárt');
  });
  await t('minden mező egyezik: jelzi, a gomb azonnal használható', async () => {
    ok((await c('merge-egyezik').innerText()).includes('Minden mező egyezik'), 'nem jelzi');
    ok(!(await c('merge-egyezik').getByRole('button', { name: 'Összefésülés', exact: true }).isDisabled()), 'tiltott');
  });
}
