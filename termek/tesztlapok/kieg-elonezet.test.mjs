// Forgatókönyv – 06a app-előnézet (levágás mérése, élő frissítés). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const notes = (id) => c(id).locator('.bc-pv-notes').innerText();
  await t('rövid szövegnél: „Minden szöveg kifér”', async () => ok((await notes('pv-partner')).includes('Minden szöveg kifér'), await notes('pv-partner')));
  await t('hosszú szövegnél: megnevezi a levágott mezőket és a sorszámot, jelöli is', async () => {
    const n = await notes('pv-partner-hosszu');
    ok(n.includes('A partner neve levágódik: 1 sor') && n.includes('A leírás levágódik: 3 sor'), n);
    ok((await c('pv-partner-hosszu').locator('.bc-clamp[data-cut]').count()) >= 2, 'nincs jelölés a levágott szövegen');
  });
  await t('üres mezőknél helykitöltő, nem „levágódik”', async () => {
    ok((await c('pv-partner-ures').locator('.bc-clamp.is-placeholder').count()) === 3, 'nincs helykitöltő');
    ok((await notes('pv-partner-ures')).includes('Minden szöveg kifér'), 'üresen levágást jelez');
  });
  await t('élő: gépelés közben megjelenik és eltűnik a levágás-jelzés', async () => {
    const body = c('pv-elo').locator('textarea');
    ok((await notes('pv-elo')).includes('Minden szöveg kifér'), 'kezdetben levág');
    await body.fill('Hosszú üzenet, amely biztosan nem fér el négy sorban a telefon kis képernyőjén. '.repeat(4));
    await until(async () => (await notes('pv-elo')).includes('Az üzenet levágódik: 4 sor'), `nincs jelzés: ${await notes('pv-elo')}`);
    ok((await c('pv-elo').locator('[data-clamp="body"]').innerText()).startsWith('Hosszú üzenet'), 'az előnézet nem frissült');
    await body.fill('Rövid.');
    await until(async () => (await notes('pv-elo')).includes('Minden szöveg kifér'), 'a jelzés nem tűnt el');
    await c('pv-elo').locator('input').first().fill('Hatalmas őszi kuponeső a Zöld Sarokban, a Javító Kávézóban és a Méhes Piacon');
    await until(async () => (await notes('pv-elo')).includes('A cím levágódik: 2 sor'), 'a cím levágása nincs jelezve');
  });
  await t('szóköz nélküli szó nem lóg ki, HTML-szerű szöveg szövegként', async () => {
    const card = await c('pv-kupon-hosszu').locator('.bc-pv-card').boundingBox(); const ph = await c('pv-kupon-hosszu').locator('.bc-pv-screen').boundingBox();
    ok(card.x + card.width <= ph.x + ph.width + 1, 'kilóg a kártya');
    ok((await c('pv-kupon-hosszu').locator('[data-clamp="description"]').innerText()).includes('<b>'), 'HTML lett belőle');
  });
  // Javaslat 20
  await t('edukáció kártya: típus-címke, kártyaszöveg; kártyaszöveg nélkül a leírás eleje', async () => {
    ok((await c('pv-edu').locator('.bc-badge.is-tag').innerText()) === 'Cikk', 'nincs típus');
    ok((await c('pv-edu').locator('[data-clamp="cardText"]').innerText()).startsWith('Három perc'), 'nem a kártyaszöveg');
    ok((await c('pv-edu').locator('[data-clamp="meta"]').innerText()) === 'Klíma · Zöld Sarok', 'nincs témakör/partner');
    ok((await c('pv-edu-leiras').locator('[data-clamp="cardText"]').innerText()).startsWith('Csomagolásmentes'), 'nem a leírás eleje');
    ok((await notes('pv-edu-leiras')).includes('A kártyaszöveg levágódik: 3 sor'), await notes('pv-edu-leiras'));
  });
  await t('részletek nézet: teljes szöveg sortörésekkel, nincs levágás-mérés, a képernyő görgethető régió, 4:3 kép', async () => {
    const k = c('pv-edu-reszlet');
    ok((await k.locator('.bc-clamp').count()) === 0, 'részleteken is vág');
    ok((await k.locator('.bc-pv-full').first().innerText()).includes('teljes hosszában'), 'nem a teljes cím');
    ok((await k.locator('.bc-pv-text.bc-pv-full').evaluate((el) => getComputedStyle(el).whiteSpace)) === 'pre-line', 'a sortörés elveszik');
    ok((await notes('pv-edu-reszlet')).includes('Részletek'), await notes('pv-edu-reszlet'));
    const scr = k.getByRole('region'); ok((await scr.getAttribute('tabindex')) === '0', 'a görgető nem érhető el billentyűzettel');
    ok(await scr.evaluate((el) => el.scrollHeight > el.clientHeight), 'nem görget (rövid?)');
    ok((await k.locator('.bc-pv-rows').innerText()).includes('beeco szerkesztőség'), 'nincs adatsor');
    const r = await k.locator('img.bc-pv-img').boundingBox(); ok(Math.abs(r.width / r.height - 4 / 3) < 0.05, `képarány ${(r.width / r.height).toFixed(2)}`);
    ok((await c('pv-edu-ures').locator('.bc-pv-img.is-empty').innerText()).includes('alapkép'), 'nincs saját üres-kép felirat');
    ok((await c('pv-edu-ures').locator('.is-placeholder').count()) >= 2, 'üresen nincs helykitöltő');
  });
  await t('esemény: kezdés, kiemelt jelvény; kezdés nélkül helykitöltő; 1:1 képarány', async () => {
    ok((await c('pv-esemeny').locator('.bc-pv-featured').innerText()) === 'Kiemelt', 'nincs kiemelés');
    ok((await c('pv-esemeny').locator('.bc-pv-meta').first().innerText()).includes('2026. 10. 10.'), 'nincs kezdés');
    ok((await c('pv-esemeny-ures').locator('.bc-pv-meta.is-placeholder').first().innerText()) === 'Kezdés helye', 'nincs helykitöltő');
    const r = await c('pv-esemeny-ures').locator('.bc-pv-img').boundingBox(); ok(Math.abs(r.width - r.height) < 2, 'nem 1:1');
  });
  await t('nézetváltó: kártyán levágás, részleteken teljes leírás és adatsor', async () => {
    const k = c('pv-nezet');
    ok((await k.locator('[data-clamp="name"]').count()) === 1, 'kártyán nincs mért cím');
    await k.getByRole('radio', { name: 'Részletek' }).click();
    await until(async () => (await k.locator('.bc-preview').getAttribute('data-view')) === 'detail', 'nem váltott');
    ok((await k.locator('.bc-pv-rows').innerText()).includes('Méhes Egyesület'), 'nincs szervező');
    ok((await k.locator('.bc-pv-text.bc-pv-full').innerText()).includes('Hozz kesztyűt'), 'nincs teljes leírás');
  });
  await t('kupon részletek: tudnivalók, kód, ár, gomb; kártyán alcím és ár; Clamp önállóan jelez', async () => {
    const rows = await c('pv-kupon-reszlet').locator('.bc-pv-rows').innerText();
    ok(rows.includes('KAVE-2026') && rows.includes('300 Nektár') && rows.includes('Egy kupon'), rows);
    ok((await c('pv-kupon-reszlet').locator('.bc-pv-btn').innerText()) === 'Beváltom', 'nincs gomb');
    ok((await c('pv-kupon-arany').locator('[data-clamp="subtitle"]').count()) === 1, 'nincs alcím');
    await until(async () => (await page.locator('[data-out="vagas"]').innerText()).includes('igen'), 'az onCut nem jelzett');
  });
}
