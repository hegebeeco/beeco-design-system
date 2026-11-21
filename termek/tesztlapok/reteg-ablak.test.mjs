// Forgatókönyv – Rétegek: ablakok (billentyűzet, fókusz, Esc, őr, begépelős törlés, oldalpanel). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
// Vár, amíg a feltétel teljesül (legfeljebb 2 s) – nyitás/zárás animációja, fókusz-visszaadás
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t: t0 }) {
  // Minden eset után: nyitva maradt réteg bezárása (egy bukás ne rántsa magával a többit)
  const t = (n, fn) => t0(n, async () => { try { await fn(); } finally { for (let i = 0; i < 4 && await page.locator('[role=dialog],[role=alertdialog]').count(); i++) { await page.keyboard.press('Escape'); await page.waitForTimeout(200); } } });
  const opener = (id) => page.locator(`[data-open="${id}"]`);
  const active = () => page.evaluate(() => { const e = document.activeElement; return { tag: e?.tagName, text: (e?.textContent || '').trim(), open: e?.getAttribute('data-open'), inDialog: Boolean(e?.closest('[role=dialog],[role=alertdialog]')) }; });
  const dialogs = () => page.locator('[role=dialog]:visible, [role=alertdialog]:visible').count();
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  // Melyik elem van felül az (x, y) ponton: a legfelső elem vagy valamelyik őse illik a szelektorra? (a takarást az „isVisible” nem látja)
  // A Radix a nem legfelső réteg elemeire pointer-events: none-t tesz, és az elementFromPoint átlát az ilyenen – a mérés idejére mindent
  // „kattinthatóvá” teszünk, így a valódi festési (z-index) sorrendet kapjuk, nem azt, hova menne a kattintás.
  const topIs = (x, y, sel) => page.evaluate(({ x, y, sel }) => {
    const st = document.createElement('style'); st.textContent = '*, *::before, *::after { pointer-events: auto !important; }'; document.head.append(st);
    try { return !!document.elementFromPoint(x, y)?.closest(sel); } finally { st.remove(); }
  }, { x, y, sel });

  await t('ablak: Enterrel nyílik, a fókusz az első mezőn, Tab bent marad, Esc zár, a fókusz visszatér', async () => {
    await opener('alap').focus(); await page.keyboard.press('Enter');
    await until(async () => (await dialogs()) === 1, 'nem nyílt meg');
    ok((await active()).tag === 'INPUT', `a fókusz nem a mezőn: ${JSON.stringify(await active())}`);
    for (let i = 0; i < 7; i++) { await page.keyboard.press('Tab'); ok((await active()).inDialog, `a fókusz kiszökött az ablakból (${i + 1}. Tab)`); }
    await page.keyboard.press('Escape'); await until(async () => (await dialogs()) === 0, 'Esc nem zárta be');
    await until(async () => (await active()).open === 'alap', 'a fókusz nem tért vissza a nyitó gombra');
  });
  await t('mentetlen változás: Esc előbb kérdez, „Folytatom” visszavisz, „Elvetés” zár', async () => {
    await opener('mentetlen').click(); const i = page.getByRole('dialog').locator('input'); await i.pressSequentially(' új');
    await page.keyboard.press('Escape'); const q = page.getByRole('alertdialog'); await q.waitFor();
    ok((await q.innerText()).includes('Elveted'), 'nem kérdezett');
    ok((await active()).text === 'Folytatom a szerkesztést', `a fókusz nem a biztonságos gombon: ${(await active()).text}`);
    await page.keyboard.press('Enter'); await q.waitFor({ state: 'detached' });
    ok((await i.inputValue()).endsWith(' új'), 'elveszett a módosítás');
    await page.getByRole('dialog').getByRole('button', { name: 'Mégse' }).click(); await q.waitFor();
    await q.getByRole('button', { name: 'Elvetés' }).click(); await until(async () => (await dialogs()) === 0, 'nem zárt be elvetés után');
  });
  await t('folyamatban: Esc nem zár; hiba után az ablak nyitva marad, a hiba benne látszik', async () => {
    await opener('folyamat').click(); const d = page.getByRole('dialog'); await d.getByRole('button', { name: 'Mentés' }).click();
    await page.keyboard.press('Escape'); await page.waitForTimeout(100); ok((await dialogs()) === 1, 'folyamat közben bezárt');
    await d.locator('.bc-alert').waitFor({ timeout: 3000 }); ok((await dialogs()) === 1, 'hiba után bezárt');
    await page.keyboard.press('Escape'); await until(async () => (await dialogs()) === 0, 'utána Esc nem zár');
  });
  await t('ablak az ablakban: Esc csak a belsőt zárja, a fókusz a belső nyitójára tér vissza', async () => {
    await opener('beagyazott').click(); await page.locator('[data-open="belso"]').click();
    await until(async () => (await dialogs()) === 2, 'a belső nem nyílt meg'); await page.waitForTimeout(250);
    await page.keyboard.press('Escape'); await until(async () => (await dialogs()) === 1, 'nem csak a belső zárt be');
    await until(async () => (await active()).open === 'belso', 'a fókusz nem a belső nyitóján');
    await page.keyboard.press('Escape'); await until(async () => (await dialogs()) === 0, 'a külső nem zárt');
  });
  await t('megerősítés: a fókusz a Mégse-n, kívül kattintás nem zár, a gomb (ige) végrehajt és értesít', async () => {
    await opener('torles').click(); const d = page.getByRole('alertdialog'); await d.waitFor();
    ok((await active()).text === 'Mégse', `fókusz: ${(await active()).text}`);
    await page.mouse.click(5, 5); await page.waitForTimeout(100); ok(await d.isVisible(), 'kívül kattintásra bezárt');
    await d.getByRole('button', { name: 'Törlés' }).click(); await d.waitFor({ state: 'detached' });
    ok((await out('log')).includes('sablon törölve'), await out('log'));
    ok(await page.locator('.bc-toaster .bc-toast').filter({ hasText: 'A sablon törölve' }).isVisible(), 'nincs értesítés');
  });
  await t('megerősítés szerverhibával: nyitva marad, a hiba benne', async () => {
    await opener('hiba').click(); const d = page.getByRole('alertdialog'); await d.getByRole('button', { name: 'Közzététel' }).click();
    await d.locator('.bc-alert').filter({ hasText: 'nem válaszolt' }).waitFor({ timeout: 3000 });
    await d.getByRole('button', { name: 'Mégse' }).click(); await d.waitFor({ state: 'detached' });
  });
  await t('begépelős törlés (42): a gomb tiltott, amíg nem egyezik; Enter végrehajt', async () => {
    await opener('szam').click(); const d = page.getByRole('alertdialog'); const b = d.getByRole('button', { name: '42 POI végleges törlése' });
    ok((await active()).tag === 'INPUT', 'a fókusz nem a mezőn'); ok(await b.isDisabled(), 'üresen nem tiltott');
    await page.keyboard.type('4'); ok(await b.isDisabled(), '„4”-re engedett');
    await page.keyboard.type('2'); ok(await b.isEnabled(), '„42”-re sem engedett');
    await page.keyboard.press('Enter'); await d.waitFor({ state: 'detached' }); ok((await out('log')).includes('42 POI'), await out('log'));
  });
  await t('begépelős törlés (név): kis-nagybetű és ékezet nem számít', async () => {
    await opener('nev').click(); const d = page.getByRole('alertdialog'); await page.keyboard.type('mehes  kavezo');
    ok(await d.getByRole('button', { name: 'Partner végleges törlése' }).isEnabled(), 'nem fogadta el'); await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
  });
  await t('hatásvizsgálat hibája: egyezés mellett is tiltott, újrapróbálás után enged', async () => {
    await opener('hatas').click(); const d = page.getByRole('alertdialog'); await page.keyboard.type('15');
    const b = d.getByRole('button', { name: '15 kupon végleges törlése' }); ok(await b.isDisabled(), 'hibánál engedett');
    await d.getByRole('button', { name: 'Újrapróbálás' }).click(); await until(() => b.isEnabled(), 'újrapróbálás után sem enged');
    await page.keyboard.press('Escape'); await d.waitFor({ state: 'detached' });
  });
  await t('oldalpanel: saját URL (?reszlet=1), a böngésző Vissza gombja bezárja', async () => {
    await opener('drawer-1').click(); const d = page.getByRole('dialog'); await d.waitFor();
    ok(page.url().includes('reszlet=1'), page.url()); ok((await d.locator('h2').innerText()).includes('Méhes Kávézó'), 'rossz elem');
    await page.goBack(); await until(async () => (await dialogs()) === 0, 'a Vissza nem zárta be');
  });
  await t('oldalpanel: Esc zár, az URL tiszta, a fókusz visszatér', async () => {
    await opener('drawer-0').click(); await page.getByRole('dialog').waitFor(); await page.keyboard.press('Escape');
    await until(async () => (await dialogs()) === 0, 'Esc nem zárta be'); await until(async () => !page.url().includes('reszlet'), `az URL maradt: ${page.url()}`);
    await until(async () => (await active()).open === 'drawer-0', 'a fókusz nem tért vissza');
  });
  await t('oldalpanel → ablak: az ablak és a függönye a panel FÖLÖTT van (nem kerül mögé), a háttérre kattintás nem éri el a panelt', async () => {
    // A „látszik” (isVisible) nem elég: a takart elem is „látszik”. Azt mérjük, melyik elem van felül az adott ponton (elementFromPoint).
    await opener('drawer-ablak').click(); await page.locator('.bc-drawer').waitFor(); await page.waitForTimeout(500);
    await page.locator('[data-open="drawer-ablak-belso"]').click(); await page.locator('.bc-modal').waitFor(); await page.waitForTimeout(350);
    const db = await page.locator('.bc-drawer').boundingBox(), mb = await page.locator('.bc-modal').boundingBox();
    ok(mb.x + mb.width - 8 > db.x, `a próba nem bizonyít semmit: az ablak és a panel nem fed át (ablak ${JSON.stringify(mb)}, panel ${JSON.stringify(db)})`);
    ok(await topIs(mb.x + mb.width - 8, mb.y + mb.height / 2, '.bc-modal'), 'az ablak a panel mögé került (az átfedésben a panel van felül)');
    ok(await topIs(db.x + db.width - 12, db.y + db.height - 12, '.bc-scrim:not(.is-drawer)'), 'az ablak függönye a panel alatt van – a panel kattintható maradt');
    await page.locator('.bc-modal').getByRole('button', { name: 'Mentés' }).click(); // az igazi kattintás is elbukna, ha takarva lenne
    await until(async () => (await page.locator('.bc-modal').count()) === 0, 'az ablak nem zárt be a Mentés után');
    ok((await out('log')).includes('kupon-sablon mentve'), await out('log')); ok(await page.locator('.bc-drawer').isVisible(), 'a panel is bezárt');
  });
  await t('oldalpanel mentetlen változással: az „Elveted…?” kérdés a panel FÖLÖTT van, „Folytatom” a panelben hagy', async () => {
    await opener('drawer-ablak').click(); await page.locator('.bc-drawer').waitFor(); await page.waitForTimeout(500); // az előző eset után a keret bezárta a panelt
    const mezo = page.locator('.bc-drawer input'); await mezo.pressSequentially(' új');
    await page.keyboard.press('Escape'); const q = page.getByRole('alertdialog'); await q.waitFor(); await page.waitForTimeout(350);
    const db = await page.locator('.bc-drawer').boundingBox(), qb = await q.boundingBox();
    ok(qb.x + qb.width - 8 > db.x, `a próba nem bizonyít semmit: a kérdés és a panel nem fed át (kérdés ${JSON.stringify(qb)}, panel ${JSON.stringify(db)})`);
    ok(await topIs(qb.x + qb.width - 8, qb.y + qb.height / 2, '[role=alertdialog]'), 'a kérdés a panel mögé került');
    await q.getByRole('button', { name: 'Folytatom a szerkesztést' }).click(); await q.waitFor({ state: 'detached' });
    ok((await mezo.inputValue()).includes(' új'), 'elveszett a módosítás'); ok(await page.locator('.bc-drawer').isVisible(), 'a panel bezárt'); // (a kurzor a mező elején áll, ezért includes)
    await page.keyboard.press('Escape'); await q.waitFor(); await q.getByRole('button', { name: 'Elvetés' }).click();
    await until(async () => (await page.locator('.bc-drawer').count()) === 0, 'az Elvetés nem zárta be a panelt');
  });
  await t('oldalpanel telefonon (390 px): teljes képernyő, a gombsor látszik', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await opener('drawer-2').click(); const d = page.getByRole('dialog'); await d.waitFor(); await page.waitForTimeout(500);
      const r = await d.boundingBox(); ok(Math.round(r.width) === 390 && Math.round(r.x) === 0, `panel: ${JSON.stringify(r)}`);
      ok(await d.getByRole('button', { name: 'Mentés' }).isVisible(), 'a gombsor nem látszik');
      const f = await d.getByRole('button', { name: 'Mentés' }).boundingBox(); ok(f.y + f.height <= 844, 'a gombsor kilóg');
      await page.keyboard.press('Escape'); await until(async () => (await dialogs()) === 0, 'nem zárt');
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
}
