// Forgatókönyv – Rétegek: menük, sor-műveletek, gomb-felirat, lenyitható. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t: t0 }) {
  // Minden eset után: nyitva maradt menü/réteg bezárása (egy bukás ne rántsa magával a többit)
  const t = (n, fn) => t0(n, async () => { try { await fn(); } finally { for (let i = 0; i < 3 && await page.locator('[role=menu],[role=dialog]').count(); i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); } } });
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const act = () => page.evaluate(() => (document.activeElement?.textContent || '').trim());
  const menu = page.locator('[role=menu]');

  await t('menü billentyűzettel: Enter nyit, nyilak, → almenü, ← vissza, tiltott kimarad, Esc zár és visszaadja a fókuszt', async () => {
    const tr = c('menu-al').getByRole('button', { name: 'Exportálás' }); await tr.focus(); await page.keyboard.press('Enter');
    await menu.first().waitFor(); await until(async () => (await act()).startsWith('Excel'), `első elem: ${await act()}`);
    await page.waitForTimeout(100); await page.keyboard.press('ArrowDown'); await until(async () => (await act()).startsWith('Más formátum'), 'ArrowDown nem lépett');
    await page.keyboard.press('ArrowRight'); await until(async () => (await act()) === 'CSV', `almenü: ${await act()}`);
    await page.keyboard.press('ArrowLeft'); await until(async () => (await act()).startsWith('Más formátum'), `vissza: ${await act()}`);
    await page.keyboard.press('ArrowDown'); await until(async () => (await act()).startsWith('Excel'), 'a tiltott PDF nem maradt ki / nem ér körbe');
    await page.keyboard.press('Escape'); await until(async () => (await menu.count()) === 0, 'Esc nem zárt');
    await until(() => tr.evaluate((e) => e === document.activeElement), 'a fókusz nem tért vissza');
  });
  await t('profil-menü: End az utolsóra ugrik, Enter választ', async () => {
    await c('menu-profil').getByRole('button').click(); await menu.waitFor(); await page.keyboard.press('End');
    await until(async () => (await act()) === 'Kijelentkezés', 'End nem az utolsóra ugrott'); await page.keyboard.press('Enter');
    await until(async () => (await page.locator('[data-out="log"]').innerText()).includes('Kijelentkezés'), 'nem választott');
  });
  await t('tiltott menüpont: látszik az indoklás', async () => {
    await c('menu-al').getByRole('button', { name: 'Exportálás' }).click();
    ok(await page.getByText('Ehhez admin jogosultság kell').isVisible(), 'nincs indoklás'); await page.keyboard.press('Escape');
  });
  await t('sor-műveletek: 1 és 2 → ikongombok, 5 → fő + „⋯”, a törlés alul, elválasztva, pirossal', async () => {
    ok((await c('sor-egy').locator('button').count()) === 1, 'sor-egy');
    ok((await c('sor-ketto').locator('button').count()) === 2 && (await c('sor-ketto').getByRole('button', { name: /További/ }).count()) === 0, 'sor-ketto');
    ok((await c('sor-sok').locator('button').count()) === 2, 'sor-sok: nem fő + ⋯');
    await c('sor-sok').getByRole('button', { name: 'További műveletek: Méhes Kávézó' }).click(); await menu.waitFor();
    const items = menu.locator('[role=menuitem]'); const n = await items.count();
    ok((await items.nth(n - 1).innerText()).startsWith('Törlés'), 'a törlés nem alul'); ok(await items.nth(n - 1).evaluate((e) => e.classList.contains('is-danger')), 'a törlés nem piros');
    ok(await items.nth(n - 1).evaluate((e) => e.previousElementSibling?.getAttribute('role') === 'separator'), 'nincs elválasztó a törlés előtt');
    await page.keyboard.press('Escape');
  });
  await t('menüpont kiválasztása lefut', async () => {
    await c('sor-sok').getByRole('button', { name: /További/ }).click(); await menu.getByRole('menuitem', { name: 'Másolat készítése' }).click();
    ok((await page.locator('[data-out="log"]').innerText()).includes('Másolat'), 'nem futott le');
  });
  await t('gomb-felirat: billentyűfókuszra megjelenik, Esc eltünteti', async () => {
    await page.mouse.move(0, 0); await c('sor-egy').locator('button').focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    await page.locator('.bc-tooltip').filter({ hasText: 'Szerkesztés' }).first().waitFor({ timeout: 2000 });
    await page.keyboard.press('Escape'); await until(async () => (await page.locator('.bc-tooltip').count()) === 0, 'nem tűnt el');
  });
  await t('lenyitható: Enter zár/nyit, nyíl a következő fejlécre, a tiltott kimarad', async () => {
    const trs = c('acc-egy').locator('.bc-acc-trigger'); await trs.first().focus();
    ok((await trs.first().getAttribute('aria-expanded')) === 'true', 'alapból nem nyitott');
    await page.keyboard.press('Enter'); await until(async () => (await trs.first().getAttribute('aria-expanded')) === 'false', 'nem zárt');
    await page.keyboard.press('ArrowDown'); await until(async () => (await act()).startsWith('Számlázási'), 'a nyíl nem lépett');
    await page.keyboard.press('ArrowDown'); await until(async () => (await act()).startsWith('Kapcsolattartó'), 'a tiltott nem maradt ki');
    await page.keyboard.press('Space'); await until(async () => (await trs.first().getAttribute('aria-expanded')) === 'true', 'Szóközre nem nyílt');
  });
  await t('menü a képernyő alján felfelé nyílik és a képernyőn belül marad', async () => {
    const b = c('menu-alul').getByRole('button', { name: /További/ }); await b.evaluate((e) => e.scrollIntoView({ block: 'end' }));
    const r = await b.boundingBox(); // a nyitott (modális) menü mellett a többi elem rejtett a szerepfa számára
    await b.click(); await menu.last().waitFor(); await page.waitForTimeout(300);
    const m = await menu.last().boundingBox(); const h = page.viewportSize().height;
    ok(m.y + m.height <= h + 1 && m.y < r.y, `menü: ${JSON.stringify(m)}, gomb: ${JSON.stringify(r)}`); await page.keyboard.press('Escape');
  });
}
