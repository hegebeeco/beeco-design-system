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
}
