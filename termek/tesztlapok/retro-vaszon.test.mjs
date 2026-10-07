// Forgatókönyv – RetroVaszon (06e): zónák címsorral és számmal, új cetli zónánként (név nélkül is, üres szöveg hibával, Esc),
// áthelyezés választóval (billentyűzet) és húzással (pointer), élő bejelentés, szerkesztés, törlés, idegen cetli nem kezelhető,
// moderátor, csak olvasható, töltés, kivetítő-mód, telefonon egymás alatt, nincs kilógás. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const allapot = (id) => c(id).locator(`[data-out="${id}"]`).innerText();
  const zona = (id, k) => c(id).locator(`[data-retro-zona="${k}"]`);

  await t('vitorlás: 4 zóna címsorral, kérdéssel, ikonnal és cetliszámmal', async () => {
    const h = await c('vitorlas').locator('.bc-retro-zona h3').allInnerTexts();
    ok(h.length === 4 && h[0].includes('Szél') && h[3].includes('Sziget'), h.join('|'));
    ok((await zona('vitorlas', 'szel').locator('.bc-retro-db').innerText()).includes('2'), 'rossz szám');
    ok((await zona('vitorlas', 'horgony').locator('.bc-retro-kerdes').innerText()) === 'Mi tart vissza?', 'nincs kérdés');
    ok((await zona('vitorlas', 'sziget').locator('.bc-retro-ures').innerText()).includes('Még üres'), 'nincs üres-szöveg');
  });
  await t('szerző: név nélkül / név / „a tiéd”; idegen cetlinél nincs kezelőgomb', async () => {
    const sz = await c('vitorlas').locator('.bc-retro-szerzo').allInnerTexts();
    ok(sz.includes('Kovács Anna · a tiéd') && sz.includes('Név nélkül') && sz.includes('Nagy Péter'), sz.join('|'));
    ok((await c('vitorlas').locator('[data-cetli="c3"] select, [data-cetli="c3"] button').count()) === 0, 'idegen cetli kezelhető');
    ok((await c('vitorlas').locator('[data-cetli="c1"] select').count()) === 1, 'a saját cetli nem mozgatható');
  });
  await t('új cetli: a zóna gombja űrlapot nyit fókusszal; üresen hiba; név nélkül feltéve a zónába kerül', async () => {
    await zona('vitorlas', 'sziget').getByRole('button', { name: 'Cetli ide: Sziget' }).click();
    const ta = zona('vitorlas', 'sziget').getByLabel('Új cetli – Sziget', { exact: true });
    ok(await ta.evaluate((e) => e === document.activeElement), 'nincs fókuszban a mező');
    await zona('vitorlas', 'sziget').getByRole('button', { name: 'Felteszem' }).click();
    ok((await zona('vitorlas', 'sziget').locator('.bc-error').innerText()).includes('legalább egy szót'), 'nincs hiba üres szövegre');
    await ta.fill('Nyári tábor a Balatonnál');
    await zona('vitorlas', 'sziget').getByRole('checkbox', { name: 'Név nélkül' }).check();
    await zona('vitorlas', 'sziget').getByRole('button', { name: 'Felteszem' }).click();
    ok((await zona('vitorlas', 'sziget').locator('.bc-retro-cetli').innerText()).includes('Nyári tábor'), 'nem került fel');
    ok((await zona('vitorlas', 'sziget').locator('.bc-retro-szerzo').innerText()).startsWith('Név nélkül'), 'nem név nélkül');
    ok((await zona('vitorlas', 'sziget').locator('form').count()) === 0, 'az űrlap nyitva maradt');
  });
  await t('Esc bezárja az új-cetli űrlapot', async () => {
    await zona('vitorlas', 'horgony').getByRole('button', { name: /Cetli ide/ }).click();
    await page.keyboard.press('Escape');
    ok((await zona('vitorlas', 'horgony').locator('form').count()) === 0, 'Esc után is nyitva');
  });
  await t('billentyűzet: a cetli „Áthelyezés” választójával másik zónába kerül, és az élő régió bemondja', async () => {
    const s = c('vitorlas').locator('[data-cetli="c1"] select');
    ok((await s.getAttribute('id')) && (await c('vitorlas').locator(`label[for="${await s.getAttribute('id')}"]`).innerText()).includes('Áthelyezés'), 'nincs címke');
    await s.focus(); await s.selectOption('horgony');
    ok((await allapot('vitorlas')).includes('c1@horgony'), await allapot('vitorlas'));
    ok((await c('vitorlas').locator('[role="status"][aria-live="polite"]').innerText()).includes('Horgony'), 'nincs bejelentés');
  });
  await t('húzás (pointer): a fogót egy másik zónába húzva áthelyez; a célzóna kiemelve húzás közben', async () => {
    const fogo = c('vitorlas').locator('[data-cetli="c4"] .bc-retro-fogo');
    const a = await fogo.boundingBox(); const b = await zona('vitorlas', 'szel').boundingBox();
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
    await page.mouse.move(a.x + 20, a.y + 10, { steps: 3 });
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
    ok((await zona('vitorlas', 'szel').getAttribute('class')).includes('is-cel'), 'a célzóna nincs kiemelve');
    await page.mouse.up();
    ok((await allapot('vitorlas')).includes('c4@szel'), await allapot('vitorlas'));
  });
  await t('húzás Esc-re megszakad (nem mozdul)', async () => {
    const fogo = c('vitorlas').locator('[data-cetli="c4"] .bc-retro-fogo');
    const a = await fogo.boundingBox(); const b = await zona('vitorlas', 'sziklak').boundingBox();
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 });
    await page.keyboard.press('Escape'); await page.mouse.up();
    ok((await allapot('vitorlas')).includes('c4@szel'), await allapot('vitorlas'));
  });
  await t('szerkesztés és törlés a saját cetlin (ikongomb névvel)', async () => {
    await c('vitorlas').getByRole('button', { name: 'Cetli szerkesztése: Az új rajvezetők nagyon lelkesek.' }).click();
    const ta = c('vitorlas').getByLabel('Cetli szövege', { exact: true });
    await ta.fill('Az új rajvezetők nagyon lelkesek!'); await c('vitorlas').getByRole('button', { name: 'Mentés' }).click();
    ok((await c('vitorlas').locator('[data-cetli="c1"]').innerText()).includes('lelkesek!'), 'nem mentette');
    await c('vitorlas').getByRole('button', { name: /Cetli törlése: Az új rajvezetők/ }).click();
    ok(!(await allapot('vitorlas')).includes('c1@'), 'nem törölte');
  });
  await t('moderátor bárki cetlijét kezelheti', async () => {
    ok((await c('moderator').locator('[data-cetli="m1"] select').count()) === 1, 'a moderátor nem mozgathat');
    await c('moderator').locator('[data-cetli="m2"] select').selectOption('vagytunk');
    ok((await allapot('moderator')).includes('m2@vagytunk'), await allapot('moderator'));
  });
  await t('csak olvasható: magyarázat, nincs gomb, választó, fogó', async () => {
    ok((await c('csak-olvashato').locator('.bc-retro-zarva').innerText()).includes('lezárult'), 'nincs magyarázat');
    ok((await c('csak-olvashato').locator('button, select, .bc-retro-fogo').count()) === 0, 'kezelhető elem maradt');
  });
  await t('töltés: aria-busy, bejelentés, csontváz; kivetítő-mód kezelőgombok nélkül', async () => {
    ok((await c('tolt').locator('.bc-retro').getAttribute('aria-busy')) === 'true', 'nincs aria-busy');
    ok((await c('tolt').locator('.bc-skeleton').count()) >= 3, 'nincs csontváz');
    ok((await c('tolt').locator('button').count()) === 0, 'töltés közben írható');
    ok((await c('nagy').locator('button, select, form').count()) === 0, 'kivetítőn kezelő');
  });
  await t('3 zóna (SSC): hosszú szó és sortörés a cetlin belül marad', async () => {
    const ki = await c('ssc').evaluate((box) => [...box.querySelectorAll('.bc-retro-cetli')].filter((li) => { const b = li.getBoundingClientRect(); return [...li.querySelectorAll('*')].some((e) => e.getBoundingClientRect().right > b.right + 1); }).length);
    ok(ki === 0, `${ki} cetliből kilóg a szöveg`);
  });
  await t('telefonon (320): a zónák egymás alatt, nincs kilógás; a kezelők ≥ 44 px', async () => {
    await page.setViewportSize({ width: 320, height: 640 }); await page.reload(); await page.waitForSelector('[data-case]'); await page.waitForTimeout(100);
    const r = await page.evaluate(() => {
      const z = [...document.querySelectorAll('[data-case="vitorlas"] .bc-retro-zona')].map((e) => e.getBoundingClientRect());
      const kicsi = [...document.querySelectorAll('[data-case="vitorlas"] .bc-retro button, [data-case="vitorlas"] .bc-retro select')].map((e) => e.getBoundingClientRect().height).filter((h) => h < 44).length;
      return { lap: document.documentElement.scrollWidth - innerWidth, egymasAlatt: z.every((b, i) => i === 0 || b.top >= z[i - 1].bottom - 1), kicsi };
    });
    ok(r.lap <= 0, `az oldal ${r.lap} px-szel kilóg`); ok(r.egymasAlatt, 'a zónák nem egymás alatt'); ok(r.kicsi === 0, `${r.kicsi} kezelő < 44 px`);
    await page.setViewportSize({ width: 1280, height: 800 }); await page.reload(); await page.waitForSelector('[data-case]');
  });
}
