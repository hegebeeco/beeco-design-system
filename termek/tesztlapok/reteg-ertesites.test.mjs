// Forgatókönyv – Rétegek: értesítések (időzítés, hiba marad, megállás, Visszavonás, 3 látszik, ablak fölött). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, max = 40) => { for (let i = 0; i < max; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 100)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const toast = (txt) => page.locator('.bc-toaster .bc-toast').filter({ hasText: txt });
  const clear = async () => { await page.evaluate(() => document.querySelectorAll('.bc-toast-close').forEach((b) => b.click())); await page.waitForTimeout(300); };
  await t('siker 5 mp után eltűnik, a hiba marad', async () => {
    await page.mouse.move(5, 790);
    await c('t-fajtak').getByRole('button', { name: 'Siker' }).click(); await c('t-fajtak').getByRole('button', { name: 'Hiba' }).click();
    ok(await toast('Kupon mentve').isVisible() && await toast('Nem sikerült').isVisible(), 'nem jelent meg');
    await until(async () => (await toast('Kupon mentve').count()) === 0, 'a siker nem tűnt el 6 mp alatt', 65);
    ok(await toast('Nem sikerült').isVisible(), 'a hiba magától eltűnt'); await clear();
  });
  await t('élő régió: a hiba role="alert", a siker role="status"', async () => {
    await c('t-fajtak').getByRole('button', { name: 'Hiba' }).click(); await c('t-fajtak').getByRole('button', { name: 'Info' }).click();
    ok(await toast('Nem sikerült').evaluate((e) => e.closest('[aria-live]')?.getAttribute('aria-live') === 'assertive'), 'a hiba nem assertive');
    ok(await toast('export').evaluate((e) => e.closest('[aria-live]')?.getAttribute('role') === 'status'), 'az info nem status'); await clear();
  });
  await t('rámutatásra megáll a visszaszámlálás', async () => {
    await c('t-fajtak').getByRole('button', { name: 'Siker' }).click(); await toast('Kupon mentve').hover();
    await page.waitForTimeout(5800); ok(await toast('Kupon mentve').isVisible(), 'rámutatás közben eltűnt');
    await page.mouse.move(5, 790); await until(async () => (await toast('Kupon mentve').count()) === 0, 'utána sem tűnt el', 65);
  });
  await t('Visszavonás: a művelet visszaáll, az értesítés eltűnik', async () => {
    await c('t-vissza').getByRole('button').click(); ok((await page.locator('[data-out="rejtett"]').innerText()).includes('rejtett'), 'nem rejtette');
    await toast('elrejtve').getByRole('button', { name: 'Visszavonás' }).click();
    ok((await page.locator('[data-out="rejtett"]').innerText()).includes('látható'), 'nem vonta vissza');
    await until(async () => (await toast('elrejtve').count()) === 0, 'az értesítés maradt');
  });
  await t('20 értesítés: legfeljebb 3 látszik + „+17 további”, Mind bezárása', async () => {
    await c('t-husz').getByRole('button', { name: '20 különböző' }).click();
    ok((await page.locator('.bc-toaster .bc-toast').count()) === 3, `látszik: ${await page.locator('.bc-toaster .bc-toast').count()}`);
    ok((await page.locator('.bc-toast-more').innerText()).includes('+17'), await page.locator('.bc-toast-more').innerText());
    await page.locator('.bc-toast-more').getByRole('button', { name: 'Mind bezárása' }).click();
    await until(async () => (await page.locator('.bc-toaster .bc-toast').count()) === 0, 'nem zárt be mind');
  });
  await t('azonos üzenet nem halmozódik (×5)', async () => {
    await c('t-husz').getByRole('button', { name: '5× ugyanaz' }).click();
    ok((await toast('Kupon mentve').count()) === 1, 'halmozódott'); ok((await toast('Kupon mentve').innerText()).includes('×5'), 'nincs ×5'); await clear();
  });
  await t('hosszú szöveg: levágva, „Részletek” kibontja', async () => {
    await c('t-hosszu').getByRole('button').click(); const tt = toast('időtúllépéssel');
    ok(await tt.locator('p.is-clamped').count() === 1, 'nincs levágva'); await tt.getByRole('button', { name: 'Részletek' }).click();
    ok(await tt.locator('p.is-clamped').count() === 0, 'nem bontotta ki'); await clear();
  });
  await t('ablak fölött: az értesítés látszik, a Visszavonás nem zárja be az ablakot', async () => {
    await c('t-ablak').getByRole('button').click(); const d = page.getByRole('dialog'); await d.getByRole('button', { name: /Mentés/ }).click();
    const tt = toast('Kupon mentve'); await tt.waitFor();
    const top = await page.evaluate(() => { const r = document.querySelector('.bc-toaster .bc-toast').getBoundingClientRect(); return document.elementFromPoint(r.x + 20, r.y + 10)?.closest('.bc-toaster') !== null; });
    ok(top, 'az értesítést eltakarja az ablak');
    await tt.getByRole('button', { name: 'Visszavonás' }).click(); await page.waitForTimeout(200); ok(await d.isVisible(), 'a Visszavonás bezárta az ablakot');
    await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' }); await clear();
  });
  await t('telefonon lent középen, asztalon jobb fent', async () => {
    await c('t-fajtak').getByRole('button', { name: 'Hiba' }).click();
    let r = await page.locator('.bc-toaster').boundingBox(); ok(r.y < 100 && r.x + r.width > 1200, `asztal: ${JSON.stringify(r)}`);
    await page.setViewportSize({ width: 390, height: 844 });
    try { await page.waitForTimeout(100); r = await page.locator('.bc-toaster').boundingBox(); ok(r.y + r.height > 700 && Math.abs(r.x + r.width / 2 - 195) < 2, `telefon: ${JSON.stringify(r)}`); }
    finally { await page.setViewportSize({ width: 1280, height: 800 }); await clear(); }
  });
}
