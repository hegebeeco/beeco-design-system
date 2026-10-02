// Forgatókönyv – Média: havi naptár és nyitvatartás (billentyűzet, szűrő, másolás, ellenőrzés). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const day = (id, iso) => c(id).locator(`[data-iso="${iso}"]`);
  const focused = () => page.evaluate(() => document.activeElement?.dataset?.iso);

  await t('a hét hétfővel kezdődik, a fajta szövegesen is ott van a nap nevében', async () => {
    ok((await c('naptar').locator('thead th').first().innerText()) === 'H', 'nem hétfő');
    const lbl = await day('naptar', '2026-10-04').getAttribute('aria-label');
    ok(lbl.includes('6 tartalom') && lbl.includes('Speciális nap') && lbl.includes('Oktatás'), lbl);
  });
  await t('sok tartalom egy napon: 2 cím + „+4 további”', async () => {
    ok((await day('naptar', '2026-10-04').locator('.bc-mcal-ev').count()) === 2, 'nem 2 cím');
    ok((await day('naptar', '2026-10-04').locator('.bc-mcal-more').innerText()) === '+4 további', await day('naptar', '2026-10-04').locator('.bc-mcal-more').innerText());
  });
  await t('több napos esemény a hónap határán át (szept. 28. – okt. 3.) minden napon látszik', async () => {
    for (const d of ['2026-09-28', '2026-09-30', '2026-10-03']) ok((await day('naptar', d).innerText()).includes('Fenntarthatósági'), d);
  });
  await t('billentyűzet: → ↓ lép, Home/End a hét széle, Enter kiválaszt', async () => {
    await day('naptar', '2026-10-01').focus();
    await page.keyboard.press('ArrowRight'); ok((await focused()) === '2026-10-02', await focused());
    await page.keyboard.press('ArrowDown'); ok((await focused()) === '2026-10-09', await focused());
    await page.keyboard.press('Home'); ok((await focused()) === '2026-10-05', await focused());
    await page.keyboard.press('End'); ok((await focused()) === '2026-10-11', await focused());
    await page.keyboard.press('Enter'); ok((await out('naptar')).includes('nap: 2026-10-11 (0)'), await out('naptar'));
  });
  await t('PageDown → november (a projekt betöltheti), PageUp vissza', async () => {
    await page.keyboard.press('PageDown'); await until(async () => (await c('naptar').locator('.bc-mcal-title').innerText()).includes('november'), 'nem november');
    await until(async () => (await out('naptar')).includes('hónap: 2026-11-01'), 'a hónapváltás nem jutott el a projekthez');
    await page.keyboard.press('PageUp'); await until(async () => (await c('naptar').locator('.bc-mcal-title').innerText()).includes('október'), 'nem október');
  });
  await t('szűrő: az „Esemény” kikapcsolva eltűnik, mind ki → szól', async () => {
    const f = (n) => c('naptar').getByRole('button', { name: n, exact: true });
    await f('Esemény').click(); ok(!(await day('naptar', '2026-10-02').innerText()).includes('Kertnyitó'), 'nem tűnt el');
    ok((await f('Esemény').getAttribute('aria-pressed')) === 'false', 'aria-pressed nem vált');
    await f('Speciális nap').click(); await f('Oktatás').click();
    ok((await c('naptar').locator('.bc-mcal-note').first().innerText()).includes('Minden tartalomfajta ki van kapcsolva'), 'nem szól');
    await f('Esemény').click(); await f('Speciális nap').click(); await f('Oktatás').click();
  });
  await t('keskeny helyen: pöttyök + a kiválasztott nap listája teljes címmel', async () => {
    ok(await day('naptar-keskeny', '2026-10-04').locator('.bc-mcal-dots').isVisible(), 'nincs pötty');
    ok(!(await day('naptar-keskeny', '2026-10-04').locator('.bc-mcal-evs').isVisible()), 'a címek is látszanak');
    await day('naptar-keskeny', '2026-10-16').click();
    const ag = await c('naptar-keskeny').locator('.bc-mcal-agenda').innerText();
    ok(ag.includes('október 16., péntek') && ag.includes('nem fér el a cellában'), ag);
  });
  await t('kinds: csak a megadott fajták a jelmagyarázatban; mind kikapcsolva → szól', async () => {
    const lg = c('naptar-ketfajta').locator('.bc-mcal-legend button');
    ok((await lg.count()) === 2, `${await lg.count()} fajta`);
    ok((await lg.allInnerTexts()).join('|').includes('Kupon-időzítés'), 'nincs saját felirat');
    for (let i = 0; i < 2; i++) await lg.nth(i).click();
    ok((await c('naptar-ketfajta').locator('.bc-mcal-note').first().innerText()).includes('Minden tartalomfajta ki van kapcsolva'), 'nem szól');
    for (let i = 0; i < 2; i++) await lg.nth(i).click();
  });
  await t('üres hónap szól; hiba → Újrapróbálás gomb', async () => {
    ok((await c('naptar-ures').locator('.bc-mcal-note').first().innerText()).includes('még nincs tartalom'), 'nem szól');
    ok(await c('naptar-hiba').getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs gomb');
  });

  await t('nyitvatartás: „Hétfő másolása a hétköznapokra” → K–P = hétfő, és szól', async () => {
    await c('nyitva').getByRole('button', { name: 'Hétfő másolása a hétköznapokra' }).click();
    const o = await out('nyitva'); ok(['Tue', 'Wed', 'Thu', 'Fri'].every((d) => o.includes(`${d} 08:00-18:00`)) && o.includes('Sat 09:00-13:00'), o);
    ok((await c('nyitva').locator('.bc-notice').innerText()).includes('Átmásoltam'), 'nem szólt');
  });
  await t('nyitvatartás: zárás a nyitás előtt → hiba a sorban, a következő lépéssel; javítva eltűnik', async () => {
    const row = c('nyitva-hiba').locator('[data-day="Tue"]');
    ok((await row.locator('.bc-error').innerText()).includes('a zárás (07:00) a nyitás (08:00) előtt van'), 'nincs hiba');
    ok((await row.locator('input').nth(1).getAttribute('aria-invalid')) === 'true', 'nincs aria-invalid');
    await row.locator('input').nth(1).fill('6pm'); await row.locator('input').nth(1).blur();
    ok((await row.locator('input').nth(1).inputValue()) === '18:00', 'a „6pm” nem 18:00');
    ok((await row.locator('.bc-error').count()) === 0, 'a hiba maradt');
  });
  await t('nyitvatartás: érthetetlen idő („25:99”) → szól; üres idő nyitott napon → szól', async () => {
    const row = c('nyitva-hiba').locator('[data-day="Mon"]');
    await row.locator('input').first().fill('25:99'); await row.locator('input').first().blur();
    ok((await row.locator('.bc-error').innerText()).includes('nem értem időnek'), 'nem szólt');
    ok((await c('nyitva-hiba').locator('[data-day="Thu"] .bc-error').innerText()).includes('add meg'), 'üres időre nem szól');
  });
  await t('kapcsoló: Szóközre zárva, a sorban „Zárva” felirat', async () => {
    const sw = c('nyitva').locator('[data-day="Sat"] [role=switch]'); await sw.focus(); await page.keyboard.press('Space');
    ok((await sw.getAttribute('aria-checked')) === 'false', 'nem váltott'); ok((await c('nyitva').locator('[data-day="Sat"]').innerText()).includes('Zárva'), 'nincs felirat');
    ok((await c('nyitva').locator('.bc-count').innerText()).startsWith('5/7'), await c('nyitva').locator('.bc-count').innerText());
  });
}
