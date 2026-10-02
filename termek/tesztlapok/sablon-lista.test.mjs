// Forgatókönyv – ListPage (06c): szűrés → „nincs találat” méhecske, részletek-panel saját URL-lel + Vissza, állapotok. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 60; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const base = page.url().split('?')[0];
  const go = async (a) => { await page.goto(a ? `${base}?allapot=${a}` : base); await page.waitForSelector('[data-case]'); };
  const bees = () => page.locator('.bc-bee:visible').count();
  const act = () => page.evaluate(() => ({ text: (document.activeElement?.textContent || '').trim(), label: document.activeElement?.getAttribute('aria-label'), id: document.activeElement?.id }));

  await t('noResultsText: kereső nélküli (szűrő miatti) üres találatnál a saját magyarázat látszik, nem a keresési tipp', async () => {
    await go('szuro-nincs');
    await page.locator('[data-pillanat="nincs-talalat"]').waitFor({ timeout: 3000 });
    const s = await page.locator('.bc-moment').innerText();
    ok(s.includes('Ezekkel a szűrőkkel nincs partner') && !s.includes('ékezet'), s);
    await go();
  });
  await t('egy h1, a lista 42 partnerrel, méhecske nincs (kész állapotban nem kell)', async () => {
    ok((await page.locator('h1').count()) === 1, 'nem egy h1 van'); ok((await page.locator('h1').innerText()) === 'Partnerek', 'rossz cím');
    ok((await page.locator('.bc-fb-count').innerText()).includes('42 partner'), 'nincs találatszám'); ok((await bees()) === 0, 'méhecske a kész listán');
    ok((await page.title()).startsWith('Partnerek – '), `fülcím: ${await page.title()}`);
  });
  await t('szűrés 0 találatra → „nincs-talalat” méhecske + Szűrők törlése visszahozza a listát', async () => {
    await page.locator('input[type=search]').pressSequentially('zzzz');
    await page.locator('[data-pillanat="nincs-talalat"]').waitFor({ timeout: 3000 });
    ok((await bees()) === 1, 'nem pontosan egy méhecske'); ok((await page.locator('table').count()) === 0, 'üresen is van táblázat');
    ok(await page.locator('.bc-fb').isVisible(), 'a szűrősáv eltűnt – nem lehetne visszaállítani');
    ok(!(await page.locator('.bc-moment').innerText()).includes('szűrőkkel'), 'kereséskor a szűrős magyarázat jelent meg');
    await page.locator('.bc-moment').getByRole('button', { name: 'Szűrők törlése' }).click();
    await until(async () => (await page.locator('.bc-fb-count').innerText()).includes('42 partner'), 'nem törölt');
    await until(async () => (await page.locator('[data-pillanat]').count()) === 0, 'a méhecske maradt');
  });
  await t('típus-szűrő → kevesebb sor, a táblázat követi', async () => {
    await page.locator('.bc-fb').getByLabel('Típus', { exact: true }).selectOption('Természet');
    await until(async () => !(await page.locator('.bc-fb-count').innerText()).includes('42'), 'nem szűrt');
    const n = await page.locator('tbody tr').count(); ok(n > 0 && n < 25, `sorok: ${n}`);
    await page.locator('.bc-fb').getByLabel('Típus', { exact: true }).selectOption('');
  });
  await t('részletek-panel: Esc zár, az URL tiszta, a fókusz a nyitó gombon', async () => {
    await go(); // friss lap: a visszaadott fókusz nyomán nyitva maradó tooltip elnyelné az Esc-et (közös Tooltip-hiba, jelentve)
    const btn = page.getByRole('button', { name: 'Részletek' }).nth(1); await btn.focus(); await page.keyboard.press('Enter');
    const d = page.getByRole('dialog'); await d.waitFor(); await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
    await until(async () => !page.url().includes('reszlet'), 'az URL maradt'); await until(() => btn.evaluate((e) => e === document.activeElement), 'a fókusz nem tért vissza');
  });
  await t('részletek-panel: Részletek → ?reszlet=p-1, a panelben a partner; böngésző Vissza bezárja, a fókusz visszatér', async () => {
    const btn = page.getByRole('button', { name: 'Részletek' }).first(); await btn.click();
    const d = page.getByRole('dialog'); await d.waitFor(); ok(page.url().includes('reszlet=p-1'), page.url());
    ok((await d.locator('h2').innerText()).includes('Méhes Kávézó'), 'rossz elem'); ok((await d.innerText()).includes('p-1'), 'nincs tartalom');
    ok((await d.getByRole('link', { name: 'Teljes oldal' }).count()) === 1, 'nincs „Teljes oldal”');
    await page.goBack(); await d.waitFor({ state: 'detached' }); ok(!page.url().includes('reszlet'), page.url());
  });
  await t('megosztott link (?reszlet=p-3) nyitott panellel indul', async () => {
    await page.goto(`${base}?reszlet=p-3`); await page.getByRole('dialog').waitFor();
    ok((await page.getByRole('dialog').locator('h2').innerText()).includes('Körforgó'), 'rossz elem'); await page.keyboard.press('Escape');
  });
  await t('ugrólink: az első Tab „Ugrás a tartalomra”, Enter a <main>-re visz', async () => {
    await go(); await page.keyboard.press('Tab'); ok((await act()).text === 'Ugrás a tartalomra', JSON.stringify(await act()));
    await page.keyboard.press('Enter'); await until(async () => (await act()).id === 'bc-content', 'nem ugrott');
    ok((await page.locator('main').count()) === 1, 'nem egy <main> van');
  });
  await t('üres lista: „ures” méhecske, teendő, nincs szűrősáv, fő gomb a fejlécben', async () => {
    await go('ures'); await page.locator('[data-pillanat="ures"]').waitFor();
    ok((await page.locator('.bc-fb').count()) === 0, 'üresen is van szűrősáv'); ok((await bees()) === 1, 'nem egy méhecske');
    ok((await page.locator('.bc-btn:not(.is-secondary):not(.is-ghost):not(.is-danger):visible').count()) === 1, 'nem pontosan egy méz gomb');
  });
  await t('töltés: csontváz-táblázat, aria-busy; hiba: újrapróbálás után betölt', async () => {
    await go('toltes'); ok((await page.locator('[data-sablon][aria-busy="true"]').count()) === 1, 'nincs aria-busy');
    ok((await page.locator('.bc-skel-row').count()) > 0, 'nincs csontváz');
    await go('hiba'); const al = page.locator('[role=alert]').filter({ hasText: 'partnereket' }); await al.waitFor();
    await al.getByRole('button', { name: 'Újrapróbálás' }).click(); await page.locator('tbody tr').first().waitFor({ timeout: 3000 });
  });
  await t('nincs jogosultság: szöveges jelzés, se szűrő, se táblázat', async () => {
    await go('tiltott'); ok((await page.innerText('body')).includes('Ehhez nincs jogosultságod'), 'nincs jelzés');
    ok((await page.locator('.bc-fb, table').count()) === 0, 'tiltva is van lista');
  });
  await t('hosszú cím, 5 szintű morzsa, ⋯ menü: telefonon (320 px) nincs kilógás', async () => {
    await go('hosszu'); await page.setViewportSize({ width: 320, height: 640 });
    try {
      await page.waitForTimeout(200);
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= 321), 'vízszintes kilógás');
      ok((await page.getByRole('button', { name: 'További műveletek: Partnerek' }).count()) === 1, 'nincs ⋯ menü');
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); await go(); }
  });
}
