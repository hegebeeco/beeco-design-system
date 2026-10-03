// Forgatókönyv – Szűrősáv (valódi gépelés, választás, billentyűzet). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  await t('alapállapot: nincs aktív szűrő → nincs „Szűrők törlése”, van találatszám', async () => {
    ok((await c('szuro-elo').getByRole('button', { name: 'Szűrők törlése' }).count()) === 0, 'van Szűrők törlése');
    ok((await c('szuro-elo').locator('.bc-fb-count').innerText()).includes('312 találat'), 'nincs találatszám');
  });
  await t('szűrő választása → címke + kevesebb találat', async () => {
    await c('szuro-elo').locator('.bc-fb').getByLabel('Kategória', { exact: true }).selectOption('Természet');
    ok(await c('szuro-elo').locator('.bc-fb-chip', { hasText: 'Kategória: Természet' }).isVisible(), 'nincs címke');
    ok(!(await out('elo')).includes('312 találat'), await out('elo'));
  });
  await t('keresés ékezet nélkül, késleltetve („kave” → Kávézó); csak szóköz = nincs szűrés', async () => {
    await c('szuro-elo').locator('.bc-fb').getByLabel('Kategória', { exact: true }).selectOption('');
    const i = c('szuro-elo').locator('input[type=search]'); await i.pressSequentially('kave');
    await until(async () => (await out('elo')).includes('„kave”'), 'nem keresett');
    ok((await c('szuro-elo').locator('tbody tr').first().innerText()).includes('Kávézó'), 'nem talál ékezet nélkül');
    await i.fill('   '); await until(async () => (await out('elo')).includes('312 találat'), 'a szóköz szűrt');
    await i.fill('');
  });
  await t('0 találat: a táblázat üres állapota „Szűrők törlése” gombbal, ami mindent töröl', async () => {
    await c('szuro-elo').locator('input[type=search]').pressSequentially('zzzz');
    await until(async () => (await out('elo')).includes(' 0 találat'), 'nem lett 0');
    await c('szuro-elo').locator('.bc-empty').getByRole('button', { name: 'Szűrők törlése' }).click();
    await until(async () => (await out('elo')).includes('312 találat'), 'nem törölt');
    await until(async () => (await c('szuro-elo').locator('input[type=search]').inputValue()) === '', 'a kereső nem ürült');
  });
  await t('címke ×: csak azt a szűrőt törli', async () => {
    await c('szuro-aktiv').getByRole('button', { name: 'Szűrő törlése: Kategória: Vendéglátás' }).click();
    ok(!(await out('aktiv')).includes('Vendéglátás') && (await out('aktiv')).includes('bio'), await out('aktiv'));
  });
  await t('„Szűrők törlése”: minden szűrőt töröl, a gomb eltűnik', async () => {
    await c('szuro-aktiv').locator('.bc-fb-active').getByRole('button', { name: 'Szűrők törlése' }).click();
    ok((await out('aktiv')).includes('"cimke":null'), await out('aktiv'));
    ok((await c('szuro-aktiv').getByRole('button', { name: 'Szűrők törlése' }).count()) === 0, 'maradt a gomb');
  });
  await t('keskeny: „Szűrők 1” gomb → panel, alján „… találat mutatása”, Esc zár', async () => {
    const b = c('szuro-keskeny').locator('.bc-fb-toggle'); ok((await b.innerText()).includes('1'), await b.innerText());
    await b.click(); const panel = page.locator('.bc-fb-panel'); await panel.waitFor();
    ok((await panel.getByRole('button', { name: /találat mutatása/ }).innerText()).includes('250'), 'nincs találatszám a panelen');
    await panel.getByLabel('Kategória').selectOption('Természet');
    ok((await out('keskeny')).includes('Természet'), await out('keskeny'));
    await page.keyboard.press('Escape'); await panel.waitFor({ state: 'detached', timeout: 2000 });
    ok((await c('szuro-keskeny').locator('.bc-fb-toggle').innerText()).includes('2'), 'a darabszám nem nőtt');
  });
  await t('régi link érvénytelen értéke: kihagyja és szól', async () => {
    ok(await c('szuro-ervenytelen').locator('.bc-notice').isVisible(), 'nem szól');
    ok((await out('ervenytelen')).includes('"cimke":["bio"]') && (await out('ervenytelen')).includes('"kat":null'), await out('ervenytelen'));
  });
  await t('függő szűrő: a szülő törlése a gyereket is törli', async () => {
    await c('szuro-fuggo').getByRole('button', { name: 'Szűrő törlése: Kategória: Vendéglátás' }).click();
    ok((await out('fuggo')).includes('"alkat":null'), await out('fuggo'));
  });
  await t('számolás közben „Számolás…” (élő régió)', async () => ok((await c('szuro-szamol').locator('[role=status]').innerText()).includes('Számolás'), 'nincs'));
  await t('az opciók hibája a panelen: hibaszöveg + Újrapróbálás', async () => {
    await c('szuro-hiba').locator('.bc-fb-toggle').click(); const panel = page.locator('.bc-fb-panel');
    ok(await panel.getByText('Nem sikerült betölteni a kategóriákat.').isVisible(), 'nincs hiba');
    ok(await panel.getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs Újrapróbálás'); await page.keyboard.press('Escape');
  });
  await t('másodlagos szűrők: a „További szűrők” lenyitóban; kiválasztva a gombon a darabszám és címke jelenik meg', async () => {
    const k = c('szuro-masodlagos');
    if ((await page.viewportSize()).width < 700) return; // keskenyen minden szűrő a „Szűrők” panelben van – azt a „keskeny” eset méri
    ok((await k.locator('.bc-fb-row .bc-fb-count').count()) === 1, 'a találatszám nem a kereső sorában áll aktív szűrő nélkül');
    ok((await k.getByLabel('Aktív állapot', { exact: true }).count()) === 0, 'a másodlagos szűrő a sorban látszik');
    await k.getByRole('button', { name: /További szűrők/ }).click();
    const panel = page.getByRole('dialog', { name: 'További szűrők' }); await panel.waitFor();
    await panel.getByLabel('Aktív állapot', { exact: true }).selectOption('igen');
    await page.keyboard.press('Escape');
    ok((await k.getByRole('button', { name: /További szűrők/ }).innerText()).includes('1'), 'a gombon nincs aktív-darabszám');
    ok((await k.locator('.bc-fb-chips').innerText()).includes('aktív'), 'nincs címke a választott másodlagos szűrőről');
  });
}
