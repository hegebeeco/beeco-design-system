// Forgatókönyv – DetailPage (06c): műveletek (fő + ⋯, törlés alul → megerősítés), fülek, oldalsó oszlop telefonon, állapotok. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 60; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t: t0 }) {
  const t = (n, fn) => t0(n, async () => { try { await fn(); } finally { for (let i = 0; i < 3 && await page.locator('[role=menu],[role=alertdialog]').count(); i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(150); } } });
  const base = page.url().split('?')[0];
  const go = async (a) => { await page.goto(a ? `${base}?allapot=${a}` : base); await page.waitForSelector('[data-case]'); };
  const more = () => page.getByRole('button', { name: /^További műveletek/ });
  const active = () => page.evaluate(() => (document.activeElement?.textContent || '').trim() || document.activeElement?.getAttribute('aria-label'));

  await t('a fő művelet felirattal látszik, a többi a ⋯ menüben, a törlés alul, elválasztva, „…”-val', async () => {
    ok((await page.locator('h1').count()) === 1, 'nem egy h1');
    ok(await page.locator('.bc-page-head').getByRole('button', { name: 'Szerkesztés' }).isVisible(), 'nincs fő gomb');
    await more().click(); const m = page.getByRole('menu'); await m.waitFor();
    const items = await m.getByRole('menuitem').allInnerTexts();
    ok(items.at(-1).trim() === 'Törlés…', `utolsó: ${items.at(-1)}`); ok(!items.some((x) => x.includes('Szerkesztés')), 'a fő művelet a menüben is');
    ok((await m.locator('[role=separator]').count()) === 1, 'nincs elválasztó');
    await page.keyboard.press('Escape'); await m.waitFor({ state: 'detached' });
  });
  await t('törlés: billentyűzettel nyílik, fókusz a Mégse-n; Mégse után a fókusz a ⋯ gombon', async () => {
    await more().focus(); await page.keyboard.press('Enter'); await page.getByRole('menu').waitFor(); await page.waitForTimeout(200);
    await page.keyboard.press('End'); await page.keyboard.press('Enter');
    const d = page.getByRole('alertdialog'); await d.waitFor(); ok((await d.innerText()).includes('nem lehet visszavonni'), 'nincs következmény');
    await until(async () => (await active()) === 'Mégse', `fókusz: ${await active()}`);
    await page.keyboard.press('Enter'); await d.waitFor({ state: 'detached' });
    await until(async () => ((await active()) || '').startsWith('További műveletek'), `fókusz: ${await active()}`);
    ok((await page.locator('[data-out="log"]').innerText()) === '', 'Mégse is törölt');
  });
  await t('törlés megerősítve: a gomb pörög, utána bezár, értesít, a műveletek eltűnnek', async () => {
    await more().click(); await page.getByRole('menuitem', { name: 'Törlés…' }).click();
    const d = page.getByRole('alertdialog'); await d.getByRole('button', { name: 'Törlés' }).click();
    ok((await d.getByRole('button', { name: 'Törlés' }).getAttribute('aria-busy')) === 'true', 'nem pörög');
    await d.waitFor({ state: 'detached', timeout: 3000 }); ok((await page.locator('[data-out="log"]').innerText()) === 'törölve', 'nem törölt');
    ok(await page.locator('.bc-toast').filter({ hasText: 'A POI törölve' }).isVisible(), 'nincs értesítés');
    ok((await more().count()) === 0, 'törölt elemen is vannak műveletek');
    await go();
  });
  await t('fülek: nyilakkal váltanak, a számláló a nevükben', async () => {
    const first = page.getByRole('tab', { name: 'Áttekintés' }); await first.focus(); await page.keyboard.press('ArrowRight');
    await until(async () => (await page.getByRole('tab', { name: /Képek/ }).getAttribute('aria-selected')) === 'true', 'nem váltott');
    ok((await page.getByRole('tabpanel').innerText()).includes('4 kép'), 'rossz panel');
  });
  await t('telefonon (390 px) az oldalsó oszlop a tartalom ALÁ kerül, asztalon mellé', async () => {
    const pos = () => page.evaluate(() => { const a = document.querySelector('.bc-sablon-primary').getBoundingClientRect(), b = document.querySelector('.bc-sablon-side').getBoundingClientRect(); return { below: b.top >= a.bottom - 1, beside: b.left >= a.right - 1 }; });
    ok((await pos()).beside, 'asztalon nincs mellette');
    await page.setViewportSize({ width: 390, height: 844 });
    try { await page.waitForTimeout(150); ok((await pos()).below, 'telefonon nem alatta'); ok(await page.evaluate(() => document.documentElement.scrollWidth <= 391), 'kilógás'); }
    finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
  await t('töltés: csontváz-cím aria-busy, műveletek nincsenek; hiba: újrapróbálás betölt', async () => {
    await go('toltes'); ok((await page.locator('h1[aria-busy="true"]').count()) === 1, 'nincs csontváz-cím'); ok((await more().count()) === 0, 'töltés közben vannak műveletek');
    await go('hiba'); await page.getByRole('button', { name: 'Újrapróbálás' }).click(); await page.getByRole('tab', { name: 'Áttekintés' }).waitFor();
  });
  await t('nincs jogosultság: jelzés, nincs művelet', async () => {
    await go('tiltott'); ok((await page.innerText('body')).includes('Ehhez nincs jogosultságod'), 'nincs jelzés'); ok((await more().count()) === 0, 'van művelet');
  });
  await t('hosszú cím, 10 fül, 8 művelet: 320 px-en sincs kilógás, a fülsor görgethető, a tiltott menüpont indokkal', async () => {
    await go('hosszu'); await page.setViewportSize({ width: 320, height: 640 });
    try {
      await page.waitForTimeout(200); ok(await page.evaluate(() => document.documentElement.scrollWidth <= 321), 'vízszintes kilógás');
      ok(await page.locator('.bc-tabs').evaluate((e) => e.scrollWidth > e.clientWidth), 'a fülsor nem görgethető');
      await more().click(); const m = page.getByRole('menu'); await m.waitFor();
      ok((await m.innerText()).includes('Előbb tölts fel legalább egy képet'), 'nincs tiltás-indok');
    } finally { await page.keyboard.press('Escape'); await page.setViewportSize({ width: 1280, height: 800 }); await go(); }
  });
}
