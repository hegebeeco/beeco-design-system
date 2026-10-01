// Forgatókönyv – EditPage (06c): hibaösszesítő (fókusz, link a mezőre), mentés (pörög → pipa → értesítés → méhecske),
// szerverhiba, mentetlen változás őre (link, Mégse), telefonos elrendezés. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 60; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const base = page.url().split('?')[0];
  const go = async (a) => { await page.goto(a ? `${base}?allapot=${a}` : base); await page.waitForSelector('[data-case]'); };
  const nev = () => page.locator('input[name="nev"]');
  const save = () => page.getByRole('button', { name: 'Mentés' });
  const summary = page.locator('.bc-sablon-summary');
  const focused = () => page.evaluate(() => ({ name: document.activeElement?.getAttribute('name'), sum: document.activeElement?.classList.contains('bc-sablon-summary') }));

  await t('kezdetben nincs „Nem mentett változások”, gépelésre megjelenik', async () => {
    ok((await page.locator('.bc-sablon-dirty').count()) === 0, 'tisztán is jelez');
    await nev().fill('ab'); await page.locator('.bc-sablon-dirty').waitFor();
  });
  await t('sikertelen beküldés: összesítő felül, rá kerül a fókusz, kíméletes rázás, a mező is hibás', async () => {
    const shook = page.evaluate(() => new Promise((res) => { const mo = new MutationObserver(() => { if (document.querySelector('.bc-anim-shake')) { mo.disconnect(); res(true); } }); mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true }); setTimeout(() => res(false), 2000); }));
    await save().click(); await summary.waitFor();
    await until(async () => (await focused()).sum, 'a fókusz nem az összesítőn');
    ok(await shook, 'nem rázott');
    ok((await summary.innerText()).includes('Kupon neve: Legalább 3 karakter kell – most 2.'), await summary.innerText());
    ok((await nev().getAttribute('aria-invalid')) === 'true', 'a mező nem hibás');
    ok((await page.locator('[data-out="mentett"]').innerText()).includes('10% kedvezmény kávéra'), 'hibásan is mentett');
  });
  await t('az összesítő linkje a mezőre ugrik (fókusz), javításkor az összesítő eltűnik', async () => {
    await summary.getByRole('link', { name: /Kupon neve/ }).click();
    await until(async () => (await focused()).name === 'nev', `fókusz: ${JSON.stringify(await focused())}`);
    await page.keyboard.type('c'); await summary.waitFor({ state: 'detached' });
  });
  await t('mentés: a gomb pörög (dupla kattintás nem küld kétszer) → pipa → értesítés → „mentve” méhecske; a jelzés eltűnik', async () => {
    await nev().fill('Kávé saját pohárral'); await save().click(); await save().click({ force: true }).catch(() => {});
    ok((await save().getAttribute('aria-busy')) === 'true', 'nem pörög');
    await page.locator('.bc-anim-tick').waitFor({ timeout: 3000 });
    ok(await page.locator('.bc-toast').filter({ hasText: 'A kupon mentve.' }).isVisible(), 'nincs értesítés');
    ok((await page.locator('.bc-toast').filter({ hasText: 'A kupon mentve.' }).innerText()).indexOf('×2') < 0, 'kétszer mentett');
    await page.locator('[data-pillanat="mentve"]').waitFor(); ok((await page.locator('.bc-bee:visible').count()) === 1, 'nem egy méhecske');
    ok((await page.locator('.bc-sablon-dirty').count()) === 0, 'mentés után is jelez');
    ok((await page.locator('[data-out="mentett"]').innerText()).includes('Kávé saját pohárral'), 'nem mentett');
    await page.locator('.bc-anim-tick').waitFor({ state: 'detached', timeout: 3000 });
    await nev().fill('Kávé saját pohárral!'); await until(async () => (await page.locator('[data-pillanat="mentve"]').count()) === 0, 'a méhecske újabb módosításnál is maradt');
  });
  await t('szerveroldali mezőhiba („Foglalt”): összesítő a szerver üzenetével, fókusz rajta', async () => {
    await nev().fill('Foglalt'); await save().click();
    await summary.filter({ hasText: 'már van' }).waitFor({ timeout: 3000 }); await until(async () => (await focused()).sum, 'a fókusz nem az összesítőn');
  });
  await t('szerverhiba: általános hiba az összesítőben, a beírt érték megmarad', async () => {
    await nev().fill('hiba teszt'); await save().click();
    await summary.filter({ hasText: 'nem válaszolt' }).waitFor({ timeout: 3000 });
    ok((await nev().inputValue()) === 'hiba teszt', 'elveszett az érték'); ok((await summary.innerText()).includes('próbáld újra'), 'nincs teendő');
  });
  await t('mentetlen változás + oldalsáv-link: kérdez, „Maradok” → marad és megvan az érték', async () => {
    await nev().fill('Félbehagyott'); await page.locator('nav.bc-sidebar').getByRole('link', { name: 'Partnerek' }).click();
    const d = page.getByRole('alertdialog'); await d.waitFor(); ok((await d.innerText()).includes('Nem mentett változásaid vannak'), 'nem kérdezett');
    await d.getByRole('button', { name: 'Maradok' }).click(); await d.waitFor({ state: 'hidden' });
    ok(page.url().includes('sablon-szerkeszto'), 'elnavigált'); ok((await nev().inputValue()) === 'Félbehagyott', 'elveszett');
  });
  await t('Mégse mentetlen változással: kérdez, „Elvetés és továbblépés” → a listára visz (a böngésző nem kérdez még egyszer)', async () => {
    let native = false; const h = (dl) => { native = true; void dl.dismiss(); }; page.on('dialog', h);
    try {
      await page.getByRole('button', { name: 'Mégse' }).click(); const d = page.getByRole('alertdialog'); await d.waitFor();
      await d.getByRole('button', { name: 'Elvetés és továbblépés' }).click();
      await page.waitForURL(/sablon-lista/, { timeout: 3000 }); ok(!native, 'a böngésző is rákérdezett');
    } finally { page.off('dialog', h); await go(); }
  });
  await t('változás nélkül a Mégse azonnal továbblép', async () => {
    await page.getByRole('button', { name: 'Mégse' }).click(); await page.waitForURL(/sablon-lista/, { timeout: 3000 }); await go();
  });
  await t('telefonon (390 px) az előnézet az űrlap alá kerül, a gombsor alul ragad', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => { const f = document.querySelector('.bc-sablon-form').getBoundingClientRect(), p = document.querySelector('.bc-sablon-preview').getBoundingClientRect(), b = document.querySelector('.bc-sablon-bar').getBoundingClientRect(); return { below: p.top >= f.bottom - 1, bar: b.bottom <= innerHeight + 1 && b.bottom > innerHeight - 40 }; });
      ok(r.below, 'az előnézet nem alatta'); ok(r.bar, 'a gombsor nem ragad alul');
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= 391), 'kilógás');
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
  await t('nagyon hosszú űrlap: 6 szakasz, a gombsor görgetés közben is látszik', async () => {
    await go('hosszu'); ok((await page.locator('.bc-sablon-form > section').count()) === 6, 'nem 6 szakasz');
    await page.mouse.wheel(0, 900); await page.waitForTimeout(150);
    ok(await page.locator('.bc-sablon-bar').evaluate((b) => { const r = b.getBoundingClientRect(); return r.bottom <= innerHeight + 1 && r.top >= 0; }), 'a gombsor kigördült');
  });
  await t('töltés / hiba / tiltott állapot', async () => {
    await go('toltes'); ok((await page.locator('h1[aria-busy="true"]').count()) === 1, 'nincs csontváz-cím'); ok((await page.locator('form').count()) === 0, 'töltés közben űrlap');
    await go('hiba'); await page.getByRole('button', { name: 'Újrapróbálás' }).click(); await nev().waitFor();
    await go('tiltott'); ok((await page.innerText('body')).includes('Ehhez nincs jogosultságod'), 'nincs jelzés'); await go();
  });
}
