// Forgatókönyv – Mezők (valódi gépelés, beillesztés, billentyűzet). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  await t('a max. hossznál a gépelés megáll, a számláló 20/20', async () => {
    const i = c('text-beilleszt').locator('input'); await i.fill(''); await i.pressSequentially('abcdefghijklmnopqrstuvwxyz');
    ok((await i.inputValue()).length === 20, `hossz: ${(await i.inputValue()).length}`);
    ok((await c('text-beilleszt').locator('.bc-count').innerText()).startsWith('20/20'), 'számláló nem 20/20');
  });
  await t('túl hosszú beillesztés: levágja és szól', async () => {
    const i = c('text-beilleszt').locator('input'); await i.fill(''); await i.focus();
    await page.evaluate(() => { const el = document.activeElement; const dt = new DataTransfer(); dt.setData('text', 'x'.repeat(50)); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); });
    await page.keyboard.insertText('x'.repeat(50));
    await page.waitForTimeout(50);
    ok((await i.inputValue()).length === 20, 'nem vágta le 20-ra');
    ok(await c('text-beilleszt').locator('.bc-notice').isVisible(), 'nincs levágás-jelzés');
  });
  await t('a 213/255 számláló a kezdőértékből', async () => ok((await c('area-213').locator('.bc-count').innerText()).startsWith('213/255'), 'nem 213/255'));
  await t('a súgó (ⓘ) megnyílik, Esc-re zár, a fókusz visszatér', async () => {
    const b = c('text-ures').locator('.bc-help-btn'); await b.click();
    ok(await page.locator('.bc-pop').isVisible(), 'nem nyílt meg'); ok((await page.locator('.bc-pop').innerText()).includes('Zöld Sarok'), 'nincs súgószöveg');
    await page.keyboard.press('Escape'); await page.locator('.bc-pop').waitFor({ state: 'detached', timeout: 2000 }).catch(() => { throw new Error('nem zárt be'); });
    ok(await b.evaluate((e) => e === document.activeElement), 'a fókusz nem tért vissza');
  });
  await t('hibás mező: aria-invalid + a hiba a mezőhöz kötve', async () => {
    const i = c('text-kotelezo').locator('input');
    ok((await i.getAttribute('aria-invalid')) === 'true', 'nincs aria-invalid');
    const ids = (await i.getAttribute('aria-describedby')).split(' '); const err = await c('text-kotelezo').locator('.bc-error').getAttribute('id');
    ok(ids.includes(err), 'a hiba nincs aria-describedby-ban');
  });
  await t('a HTML-szerű szöveg szövegként marad', async () => ok((await c('text-ekezet').locator('input').inputValue()).includes('<b>'), 'elveszett'));
  await t('kereső: Esc törli', async () => {
    const i = c('search').locator('input'); await i.fill('zöld'); await i.press('Escape'); ok((await i.inputValue()) === '', 'nem törölte');
  });
  await t('kapcsoló: Szóközre vált', async () => {
    const s = c('switch').locator('[role=switch]'); const before = await s.getAttribute('aria-checked'); await s.focus(); await page.keyboard.press('Space');
    ok((await s.getAttribute('aria-checked')) !== before, 'nem váltott');
  });
}
