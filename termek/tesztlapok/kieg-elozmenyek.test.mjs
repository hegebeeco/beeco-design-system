// Forgatókönyv – 06a előzmények. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  await t('napok szerint: Ma, Tegnap, dátum – legújabb elöl', async () => {
    const h = await c('tl-alap').locator('.bc-tl-day-h').allInnerTexts();
    ok(h[0] === 'Ma' && h[1] === 'Tegnap' && /2026\. szeptember 28\., hétfő/.test(h[2]), h.join(' | '));
    ok((await c('tl-alap').locator('.bc-tl-time').first().innerText()) === '10:42', 'rossz idő / sorrend');
  });
  await t('különbség: lenyitható, előtte → utána, üres érték jelölve', async () => {
    const b = c('tl-alap').getByRole('button', { name: '3 mező változott' });
    ok((await b.getAttribute('aria-expanded')) === 'false', 'nyitva indul');
    await b.focus(); await page.keyboard.press('Enter');
    ok((await b.getAttribute('aria-expanded')) === 'true', 'nem nyílt ki');
    const d = c('tl-alap').locator('.bc-tl-diff').first();
    ok((await d.locator('del').first().innerText()).includes('+36 30 123 4567') && (await d.locator('ins').first().innerText()).includes('+36 70 555 1234'), 'rossz különbség');
    ok((await d.innerText()).includes('(üres)'), 'nincs üres-jelölés');
    await page.keyboard.press('Space'); ok((await c('tl-alap').locator('.bc-tl-diff').count()) === 0, 'nem csukódott be');
  });
  await t('„Még …”: 10 látszik, gombbal +10, a végén eltűnik', async () => {
    const items = c('tl-sok').locator('.bc-tl-item');
    ok((await items.count()) === 10, `${await items.count()}`);
    ok((await c('tl-sok').locator('.bc-tl-count').innerText()).includes('10/23'), 'nincs 10/23');
    await c('tl-sok').getByRole('button', { name: 'Még 10 bejegyzés' }).click(); ok((await items.count()) === 20, 'nem bővült');
    await c('tl-sok').getByRole('button', { name: 'Még 3 bejegyzés' }).click(); ok((await items.count()) === 23, 'nem 23');
    ok((await c('tl-sok').getByRole('button', { name: /Még/ }).count()) === 0, 'a gomb maradt');
  });
  await t('szerveroldali folytatás: töltés közben nem kattintható kétszer', async () => {
    const b = c('tl-szerver').getByRole('button', { name: 'Még több bejegyzés' });
    await b.click(); await b.click({ force: true });
    await until(async () => (await c('tl-szerver').locator('.bc-tl-item').count()) === 10, `${await c('tl-szerver').locator('.bc-tl-item').count()}`);
    await page.waitForTimeout(500); ok((await c('tl-szerver').locator('.bc-tl-item').count()) === 10, 'kétszer töltött');
  });
  await t('HTML-szerű szöveg szövegként; ismeretlen idő „–”', async () => {
    await c('tl-hosszu').getByRole('button', { name: /mező változott/ }).click();
    ok((await c('tl-hosszu').locator('ins').innerText()).includes('<b>nem félkövér</b>'), 'HTML lett belőle');
    ok((await c('tl-ismeretlen').locator('.bc-tl-time').innerText()) === '–', 'nem „–”');
    ok((await c('tl-ismeretlen').locator('.bc-tl-day-h').innerText()) === 'Ismeretlen időpont', 'rossz nap');
  });
  await t('üres, töltés, hiba, jogosultság', async () => {
    ok((await c('tl-ures').innerText()).includes('Még nincs bejegyzés'), 'üres');
    ok((await c('tl-toltes').locator('[role=status]').count()) > 0, 'töltés');
    ok((await c('tl-hiba').locator('[role=alert]').count()) > 0 && (await c('tl-hiba').getByRole('button', { name: 'Újrapróbálás' }).count()) === 1, 'hiba');
    ok((await c('tl-jog').innerText()).includes('jogosultság'), 'jogosultság');
  });
}
