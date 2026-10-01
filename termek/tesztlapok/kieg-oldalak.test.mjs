// Forgatókönyv – 06a oldalak és őrök. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const dlg = page.locator('dialog[open]');
  const name = c('mentetlen').locator('input');

  await t('állapot-oldalak: sima h1 + szóvicc + teendő; a szomorú méh csak a szerverhibánál', async () => {
    for (const id of ['oldal-404', 'oldal-403', 'oldal-500', 'oldal-lejart', 'oldal-offline']) {
      ok(await c(id).locator('h1').innerText(), `${id}: nincs h1`);
      ok(await c(id).locator('.bc-moment-title').innerText(), `${id}: nincs szóvicc`);
      ok(await c(id).locator('.bc-moment-text').innerText(), `${id}: nincs sima mondat`);
      ok((await c(id).locator('.bc-moment-action a, .bc-moment-action button').count()) > 0, `${id}: nincs teendő`);
    }
    ok((await page.locator('[data-szerep="szomoru"]').count()) === 1, 'szomorú méh nem csak egyszer');
    ok((await c('oldal-500').locator('[data-szerep="szomoru"]').count()) === 1, 'a szerverhibánál nincs szomorú méh');
    ok((await c('oldal-404').locator('[data-szerep="kacsinto"]').count()) === 1, '404: nem a kacsintó');
    ok((await c('oldal-500').locator('[role=alert]').count()) > 0, 'szerverhiba nem alert');
  });
  await t('szerverhiba: újrapróbálás pörög, dupla kattintás nem kétszer', async () => {
    const b = c('oldal-500').getByRole('button', { name: 'Újrapróbálás' });
    await b.click(); await b.click({ force: true });
    await until(async () => (await out('retry')) === 'újrapróbálás: 1', 'nem futott le');
    await page.waitForTimeout(600); ok((await out('retry')) === 'újrapróbálás: 1', 'kétszer futott');
    ok((await c('oldal-500').locator('.bc-copy-value').innerText()) === 'E-7F3A-21', 'nincs hibakód');
  });
  await t('403: hozzáférés kérése után a gomb jelzi', async () => {
    await c('oldal-403').getByRole('button', { name: 'Hozzáférés kérése' }).click();
    ok(await c('oldal-403').getByRole('button', { name: 'Kérés elküldve' }).isDisabled(), 'nem jelzi');
  });
  await t('offline sáv: megjelenik offline-nál (böngésző), mondja a mentést és a várakozó módosításokat; visszatéréskor eltűnik', async () => {
    const sav = c('offline-sav').locator('.bc-offline');
    ok((await sav.getAttribute('data-state')) === 'online', 'kezdetben nem online');
    await page.context().setOffline(true);
    await until(async () => (await sav.getAttribute('data-state')) === 'offline', 'nem lett offline');
    const txt = await sav.innerText();
    ok(txt.includes('Nincs térerő a kaptárban') && txt.includes('mentjük') && txt.includes('3 módosítás'), txt);
    await page.context().setOffline(false);
    await until(async () => (await sav.getAttribute('data-state')) === 'back', 'nincs „újra van kapcsolat”');
    ok((await sav.innerText()).includes('Újra van kapcsolat'), 'nincs visszatérés-szöveg');
    await until(async () => (await sav.getAttribute('data-state')) === 'online', 'a sáv nem tűnt el', 4000);
    ok((await sav.innerText()).trim() === '', 'maradt szöveg');
  });
  await t('mentetlen: változás nélkül a link azonnal visz', async () => {
    await c('mentetlen').locator('[data-link="lista"]').click();
    ok((await out('oldal')).includes('Partnerek listája'), await out('oldal')); ok((await dlg.count()) === 0, 'feleslegesen kérdezett');
  });
  await t('mentetlen: változás után a link előtt kérdez; „Maradok” megtartja', async () => {
    await name.fill('Zöld Sarok Bolt és Kávézó');
    await c('mentetlen').locator('[data-link="lista"]').click();
    await until(() => dlg.isVisible(), 'nincs kérdés');
    ok((await dlg.locator('h2').innerText()).includes('Nem mentett'), 'rossz cím');
    ok(await dlg.getByRole('button', { name: 'Maradok' }).evaluate((e) => e === document.activeElement), 'a fókusz nem a Maradok gombon');
    await page.keyboard.press('Escape');
    await until(async () => (await dlg.count()) === 0, 'Esc nem zárt');
    ok((await name.inputValue()) === 'Zöld Sarok Bolt és Kávézó', 'elveszett a szöveg');
    ok(!(await out('oldal')).includes('visszaállítva') && (await out('oldal')).includes('nem mentett'), await out('oldal'));
  });
  await t('mentetlen: horgony-link nem kérdez; a böngésző bezárása előtt kérdez (beforeunload)', async () => {
    await c('mentetlen').locator('[data-link="horgony"]').click(); ok((await dlg.count()) === 0, 'horgonynál kérdezett');
    ok(await page.evaluate(() => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented; }), 'beforeunload nem állítja meg');
  });
  await t('mentetlen: „Elvetés és továbblépés” → a router viszi tovább', async () => {
    await c('mentetlen').locator('[data-link="lista"]').click();
    await until(() => dlg.isVisible(), 'nincs kérdés');
    await dlg.getByRole('button', { name: 'Elvetés és továbblépés' }).click();
    await until(async () => (await out('oldal')).includes('Partnerek listája · minden mentve'), await out('oldal'));
    ok((await dlg.count()) === 0, 'az ablak nyitva maradt');
  });
  await t('mentetlen: „Mégse” gomb (programozott) + „Mentés és továbblépés”', async () => {
    await name.fill('Új név');
    await c('mentetlen').getByRole('button', { name: 'Mégse' }).click();
    await until(() => dlg.isVisible(), 'nincs kérdés');
    await dlg.getByRole('button', { name: 'Mentés és továbblépés' }).click();
    await until(async () => (await out('oldal')).includes('visszaállítva'), await out('oldal'));
    ok((await name.inputValue()) === 'Új név', 'nem mentette');
    ok(!(await page.evaluate(() => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented; })), 'mentés után is kérdez');
  });
}
