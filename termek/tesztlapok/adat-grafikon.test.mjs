// Forgatókönyv – Grafikonok (3/B kötelező részek, szélső esetek). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const card = () => c('graf-teljes').locator('.bc-chart-card');
  await t('3/B: cím, alcím (egység + időszak), súgó, jelmagyarázat, rajz, forrás megvan', async () => {
    ok((await card().locator('.bc-chart-title').innerText()).includes('hetente'), 'nincs cím');
    ok((await card().locator('.bc-chart-sub').innerText()).includes('db / hét · 2026.'), 'nincs egység/időszak');
    ok(await card().locator('.bc-help-btn').isVisible(), 'nincs súgó'); ok((await card().locator('.bc-legend li').count()) === 3, 'jelmagyarázat: 2 sorozat + rejtett sáv');
    const nev = await card().locator('.bc-chart svg').getAttribute('aria-label'); ok(nev && nev.includes('adattábl'), `a rajznak nincs neve: ${nev}`);
    ok((await card().locator('.bc-chart-source').innerText()).startsWith('Forrás:'), 'nincs forrás');
    ok((await card().locator('.bc-end-label').count()) === 2, 'nincs közvetlen címke a vonalvégen');
  });
  await t('a hiányzó hét csíkos sáv, nem nulla (a vonal megszakad)', async () => {
    ok((await card().locator('rect.bc-gap').count()) === 2, 'nincs 2 sáv');
    ok((await card().locator('.bc-chart path.bc-line').count()) === 6, `vonaldarabok: ${await card().locator('.bc-chart path.bc-line').count()}`);
  });
  await t('súgó ⓘ: billentyűvel nyílik, Esc zár', async () => {
    await card().locator('.bc-help-btn').focus(); await page.keyboard.press('Enter');
    ok((await page.locator('.bc-pop').innerText()).includes('beváltásnak'), 'nincs súgó'); await page.keyboard.press('Escape');
    await page.locator('.bc-pop').waitFor({ state: 'detached', timeout: 2000 });
  });
  await t('„Hogyan olvasd?” első látogatáskor nyitva, becsukva megjegyzi', async () => {
    const d = card().locator('details').first(); ok(await d.evaluate((e) => e.open), 'nem nyitott');
    await d.locator('summary').click(); ok(!(await d.evaluate((e) => e.open)), 'nem zárt');
    await until(async () => (await page.evaluate(() => localStorage.getItem('bc-howto:tesztlap-kupon'))) === 'closed', 'nem jegyezte meg'); // a toggle esemény aszinkron
    await page.reload(); await page.waitForSelector('[data-case]');
    ok(!(await card().locator('details').first().evaluate((e) => e.open)), 'újratöltés után nyitva');
    await card().locator('details').first().locator('summary').click(); await page.evaluate(() => localStorage.removeItem('bc-howto:tesztlap-kupon'));
  });
  await t('adattábla billentyűvel nyílik: 12 sor, a rejtett hét szövege, magyar számok', async () => {
    const s = card().locator('summary', { hasText: 'Adattábla' }); await s.focus(); await page.keyboard.press('Enter');
    const tb = card().locator('.bc-chart-table'); await tb.waitFor({ timeout: 2000 }).catch(() => { throw new Error('nem nyílt'); });
    ok((await tb.locator('tbody tr').count()) === 12, 'nem 12 sor'); ok((await tb.innerText()).includes('rejtett hét'), 'a rejtett hét 0-nak látszik');
  });
  await t('színtévesztő-barát kapcsoló: data-cb, más adatszín', async () => {
    const mark = card().locator('.bc-mark.bc-s1').first(); const f0 = await mark.evaluate((e) => getComputedStyle(e).fill);
    await c('graf-teljes').getByRole('button', { name: /Színtévesztő/ }).click();
    ok((await c('graf-teljes').locator('[data-cb="true"]').count()) === 1, 'nincs data-cb');
    ok((await mark.evaluate((e) => getComputedStyle(e).fill)) !== f0, 'a szín nem változott');
  });
  await t('minden adatjelnek line színű kontúrja van', async () => {
    const line = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--bc-line').trim());
    const bad = await page.locator('.bc-mark').evaluateAll((els) => els.filter((e) => getComputedStyle(e).stroke === 'none').length);
    ok(bad === 0 && line, `${bad} jel kontúr nélkül`);
  });
}
