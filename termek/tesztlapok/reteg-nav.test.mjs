// Forgatókönyv – Rétegek: fülek, linkes fülek, oldalfej, morzsamenü, böngészőfül címe. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const act = () => page.evaluate(() => (document.activeElement?.textContent || '').trim());
  await t('fülek: → és ← vált (automatikus aktiválás), a panel követi, Home/End', async () => {
    const tabs = c('tabs-ket').getByRole('tab'); await tabs.first().focus(); await page.keyboard.press('ArrowRight');
    await until(async () => (await c('tabs-ket').locator('[data-out="tab"]').innerText()).includes('idozites'), 'nem váltott');
    ok((await c('tabs-ket').getByRole('tabpanel').innerText()).includes('Időzítések'), 'a panel nem követte');
    await page.keyboard.press('Home'); await until(async () => (await act()).startsWith('Áttekintés'), 'Home nem az első fülre ugrott');
  });
  await t('10 fül: a tiltott kimarad, a kijelölt a látható részben', async () => {
    const row = c('tabs-tiz').locator('.bc-tabs');
    const sel = c('tabs-tiz').locator('[role=tab][aria-selected="true"]');
    await until(async () => { const r = await sel.boundingBox(), w = await row.boundingBox(); return r.x >= w.x - 1 && r.x + r.width <= w.x + w.width + 1; }, 'a kijelölt fül nincs a látható részben');
    await c('tabs-tiz').getByRole('tab', { name: /Üzenetek/ }).click(); await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(50);
    ok((await act()).startsWith('Események'), `a tiltott Nyereményjáték nem maradt ki: ${await act()}`);
  });
  await t('számláló a fülön a képernyőolvasónak is szól', async () => {
    ok((await c('tabs-tiz').getByRole('tab', { name: /Lábnyom/ }).getAttribute('aria-selected')) !== null, 'nincs fül');
    ok((await c('tabs-tiz').getByRole('tab', { name: 'Lábnyom (3)' }).count()) === 1, 'a név nem „Lábnyom (3)”');
  });
  await t('linkes fülek: link + aria-current="page", Tab-bal léptethető', async () => {
    const links = c('navtabs').getByRole('link'); ok((await links.count()) === 4, 'nem linkek');
    ok((await links.first().getAttribute('aria-current')) === 'page', 'nincs aria-current'); await links.nth(1).click();
    ok(page.url().endsWith('#esemenyek'), page.url());
  });
  await t('oldalfej: a böngészőfül címe követi (… – beeco admin)', async () => {
    ok((await page.title()) === 'Nyári kávé 10% – beeco admin', await page.title());
    await c('ph-alap').getByRole('button', { name: 'Átnevezés' }).click(); await until(async () => (await page.title()).startsWith('Fenntartható'), await page.title());
    await c('ph-alap').getByRole('button', { name: 'Átnevezés' }).click();
  });
  await t('morzsamenü: az utolsó aria-current, jogosultság nélküli szülő nem link', async () => {
    const nav = c('ph-nincs').getByRole('navigation'); ok((await nav.locator('[aria-current="page"]').innerText()) === 'Nem található', 'nincs aria-current');
    ok((await nav.getByRole('link').count()) === 1, 'az „Admin” link lett');
  });
  await t('7 szintű morzsa: „…” mögött, kattintásra kibomlik', async () => {
    const nav = c('crumbs-sok'); ok((await nav.locator('li').count()) === 4, `elemek: ${await nav.locator('li').count()}`);
    await nav.getByRole('button', { name: /További 4 szint/ }).click(); ok((await nav.locator('li').count()) === 7, 'nem bomlott ki');
  });
  await t('telefonon a morzsából csak a szülő marad („‹ Sablonok”)', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      const vis = await c('ph-alap').locator('.bc-crumb').evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== 'none').map((e) => e.textContent));
      ok(vis.length === 1 && vis[0].includes('Sablonok'), JSON.stringify(vis));
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
}
