const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const html = () => page.evaluate(() => ({ theme: document.documentElement.dataset.theme, dark: document.documentElement.classList.contains('dark'), mode: document.documentElement.dataset.themeMode, saved: localStorage.getItem('bc-theme') }));
  const out = () => page.locator('[data-out="tema"]').innerText();
  const seg = (nev) => page.locator('[data-case="tema-kapcsolo"] [role="radio"]', { hasText: nev });
  const ikon = page.locator('[data-case="tema-ikon"] [data-theme-toggle]');

  await t('alap: rendszer szerint, világos rendszerben világos', async () => {
    const h = await html(); ok(h.theme === 'light' && !h.dark && h.mode === 'auto', JSON.stringify(h)); ok((await out()).includes('mód: auto'), await out());
  });
  await t('Sötét: data-theme + .dark (Tailwind) + mentés', async () => {
    await seg('Sötét').click(); const h = await html();
    ok(h.theme === 'dark' && h.dark && h.saved === 'dark', JSON.stringify(h));
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor); ok(bg !== 'rgb(255, 248, 231)', `a háttér nem váltott: ${bg}`);
  });
  await t('ikongomb: a nevét a mostani téma adja, kattintásra vált', async () => {
    ok((await ikon.getAttribute('aria-label')) === 'Világos mód bekapcsolása', await ikon.getAttribute('aria-label'));
    await ikon.click(); const h = await html(); ok(h.theme === 'light' && !h.dark && h.saved === 'light', JSON.stringify(h));
    ok((await ikon.getAttribute('aria-label')) === 'Sötét mód bekapcsolása', 'a név nem frissült');
  });
  await t('rendszer szerint: élőben követi a gép beállítását', async () => {
    await seg('Rendszer szerint').click(); await page.emulateMedia({ colorScheme: 'dark' }); await page.waitForTimeout(50);
    let h = await html(); ok(h.theme === 'dark' && h.mode === 'auto', `sötét rendszer: ${JSON.stringify(h)}`);
    await page.emulateMedia({ colorScheme: 'light' }); await page.waitForTimeout(50);
    h = await html(); ok(h.theme === 'light', `világos rendszer: ${JSON.stringify(h)}`);
  });
  await t('billentyűzet: nyilakkal vált a háromállású kapcsoló', async () => {
    await seg('Világos').click(); await seg('Világos').focus(); await page.keyboard.press('ArrowRight');
    ok((await html()).theme === 'dark', 'a jobbra nyíl nem a Sötétre lépett');
    ok(await seg('Sötét').evaluate((e) => e === document.activeElement), 'a fókusz nem követte');
  });
  await t('újratöltés után megmarad (az eszköz megjegyzi)', async () => {
    await page.reload(); await page.waitForSelector('[data-case]'); const h = await html(); ok(h.theme === 'dark' && h.saved === 'dark', JSON.stringify(h));
  });
  await t('angol feliratok (labels)', async () => {
    ok(await page.locator('[data-case="tema-angol"] [role="radiogroup"][aria-label="Appearance"]').count() === 1, 'nincs angol csoportnév');
    ok((await page.locator('[data-case="tema-angol"] [data-theme-toggle]').getAttribute('aria-label')) === 'Switch to light mode', 'nincs angol ikongomb-név');
  });
  await t('themeInitScript: a mentett módot az első kirajzolás előtt beállítja', async () => {
    const h = await page.evaluate(() => { localStorage.setItem('bc-theme', 'light'); const s = document.querySelector('[data-case="tema-init"] pre').textContent.replace(/^<script>|<\/script>$/g, ''); document.documentElement.removeAttribute('data-theme'); document.documentElement.classList.add('dark'); new Function(s)(); return { theme: document.documentElement.dataset.theme, dark: document.documentElement.classList.contains('dark') }; });
    ok(h.theme === 'light' && !h.dark, JSON.stringify(h));
  });
  await t('hibás mentett érték → alapérték, nem omlik össze', async () => {
    await page.evaluate(() => localStorage.setItem('bc-theme', 'lila')); await page.reload(); await page.waitForSelector('[data-case]');
    ok((await out()).includes('mód: auto'), await out());
    await page.evaluate(() => localStorage.removeItem('bc-theme'));
  });
}
