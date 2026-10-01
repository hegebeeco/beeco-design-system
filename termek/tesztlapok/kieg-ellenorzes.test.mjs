// Forgatókönyv – 06a ellenőrzési sor (J/E/K, kötelező indok, visszavonás). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const q = c('rq');
  const title = () => q.locator('.bc-review-title').innerText();
  const log = () => q.locator('[data-out="log"]').innerText();
  await t('kezdet: 1/4, az első tétel', async () => {
    ok((await q.locator('.bc-review-pos').innerText()) === '1/4', await q.locator('.bc-review-pos').innerText());
    ok((await title()) === 'Zöld Sarok Bolt', await title());
  });
  await t('J: jóváhagy, továbblép, pecsét + bejelentés, a fókusz az új címen', async () => {
    await page.locator('body').click({ position: { x: 5, y: 5 } }); await page.keyboard.press('j');
    await until(async () => (await title()) === 'Javító Kávézó', `cím: ${await title()}`);
    ok((await q.locator('.bc-review-pos').innerText()) === '2/4', 'nem 2/4');
    ok((await q.locator('.bc-review-last .bc-badge').innerText()) === 'Jóváhagyva', 'nincs pecsét');
    ok((await q.locator('.bc-sr[role=status]').innerText()).includes('Következő: Javító Kávézó'), 'nincs bejelentés');
    ok(await q.locator('.bc-review-title').evaluate((e) => e === document.activeElement), 'a fókusz nem a címen');
  });
  await t('E: indok nélkül nem utasít el; mezőbe gépelt „j” nem hagy jóvá', async () => {
    await page.keyboard.press('e');
    const panel = q.locator('.bc-review-reject'); await until(() => panel.isVisible(), 'nincs indok-panel');
    ok(await panel.locator('input[type=radio]').first().evaluate((e) => e === document.activeElement), 'a fókusz nem az első okon');
    await panel.locator('textarea').fill('jjj kk'); ok((await title()) === 'Javító Kávézó', 'gépelés közben döntött');
    await panel.getByRole('button', { name: 'Elutasítás' }).click();
    ok((await panel.locator('.bc-error').innerText()).includes('legalább 10 karakter'), 'nincs hiba');
    ok((await title()) === 'Javító Kávézó', 'indok nélkül elutasított');
  });
  await t('Esc visszalép; E + ok választása + Ctrl+Enter elutasít, az ok a naplóba kerül', async () => {
    await q.locator('.bc-review-reject textarea').press('Escape');
    await until(async () => (await q.locator('.bc-review-reject').count()) === 0, 'Esc nem zárt');
    await until(() => q.getByRole('button', { name: /Elutasítás/ }).evaluate((e) => e === document.activeElement), 'a fókusz nem tért vissza');
    await page.keyboard.press('e');
    await q.getByRole('radio', { name: 'Duplikátum' }).check();
    await q.locator('.bc-review-reject textarea').press('Control+Enter');
    await until(async () => (await title()) === 'Méhes Piac', `cím: ${await title()}`);
    ok((await log()).includes('p2:reject(Duplikátum)'), await log());
  });
  await t('K: kihagy; visszavonás visszahozza az előző tételt', async () => {
    await page.keyboard.press('k');
    await until(async () => (await title()).startsWith('Csomagolás'), `cím: ${await title()}`);
    ok((await q.locator('.bc-review-tally').innerText()) === '1 jóváhagyva · 1 elutasítva · 1 kihagyva', await q.locator('.bc-review-tally').innerText());
    await q.getByRole('button', { name: 'Visszavonás' }).click();
    await until(async () => (await title()) === 'Méhes Piac', 'nem hozta vissza');
    ok((await log()).includes('p3:visszavonva'), await log());
    ok((await q.locator('.bc-review-pos').innerText()) === '3/4', 'nem 3/4');
  });
  await t('a sor vége: összegzés a mérföldkő-méhvel, nincs több gomb', async () => {
    await page.keyboard.press('j'); await until(async () => (await title()).startsWith('Csomagolás'), 'nem lépett');
    await q.getByRole('button', { name: /Jóváhagyás/ }).click();
    await until(async () => (await q.locator('.bc-moment').count()) === 1, 'nincs összegzés');
    ok((await q.locator('.bc-moment-text').innerText()).includes('3 jóváhagyva, 1 elutasítva, 0 kihagyva'), await q.locator('.bc-moment-text').innerText());
    ok((await q.getByRole('button', { name: /Jóváhagyás/ }).count()) === 0, 'maradt gomb');
    await page.keyboard.press('j'); ok((await q.locator('.bc-review-pos').innerText()) === '4/4', 'a vége után is lépett');
  });
  await t('mentési hiba: a tétel marad, hibaüzenet, újrapróbálható; dupla kattintás egyszer ment', async () => {
    const h = c('rq-hiba'); const b = h.getByRole('button', { name: /Jóváhagyás/ });
    await b.click(); await until(async () => (await h.locator('[role=alert]').count()) > 0, 'nincs hiba');
    ok((await h.locator('[role=alert]').innerText()).includes('Próbáld újra'), 'nincs teendő');
    await b.click(); await b.click({ force: true }).catch(() => undefined);
    await until(async () => (await h.locator('[data-out="log"]').innerText()).includes('p1:approve'), 'nem mentett');
    await page.waitForTimeout(300); ok(((await h.locator('[data-out="log"]').innerText()).match(/approve/g) || []).length === 1, 'kétszer mentett');
  });
  await t('üres sor: pihenő méh, nincs gomb', async () => {
    ok((await c('rq-ures').innerText()).includes('Nincs ellenőrizendő tétel'), 'nincs üres-szöveg');
    ok((await c('rq-ures').getByRole('button').count()) === 0, 'van gomb');
  });
}
