// Forgatókönyv – EditPage lépés-módban (Javaslat 20): Tovább csak a lépés mezőit ellenőrzi, fókusz a lépés címére / a hibás mezőre,
// Enter = Tovább, kattintható lépésjelző, Vissza, mentéskori (szerver) hiba korábbi lépésben → odaugrik, összesítő-link lépést vált,
// ⌘S / Ctrl+S mentés (köztes lépésen figyelmeztet), másolat: minden lépés elérhető, de pipa csak a látott, hibátlan lépésen (Javaslat 21), telefonos gombsor. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const base = page.url().split('?')[0];
  const go = async (a) => { await page.goto(a ? `${base}?allapot=${a}` : base); await page.waitForSelector('[data-case]'); };
  const title = () => page.locator('.bc-sablon-step-title').innerText();
  const next = () => page.locator('.bc-sablon-bar').getByRole('button', { name: 'Tovább' });
  const back = () => page.locator('.bc-sablon-bar').getByRole('button', { name: 'Vissza' });
  const save = () => page.getByRole('button', { name: 'Kupon létrehozása' });
  const stepper = page.locator('ol.bc-steps');
  const summary = page.locator('.bc-sablon-summary');
  const focused = () => page.evaluate(() => ({ name: document.activeElement?.getAttribute('name'), cls: document.activeElement?.className, tag: document.activeElement?.tagName }));
  const out = () => page.locator('[data-out="mentett"]').innerText();

  await t('kezdetben: 1/3. lépés, a jelző 3 lépés (a mostani aria-current="step"), még nincs kattintható lépés, nincs Mentés', async () => {
    ok((await title()).includes('Alapadatok') && (await title()).includes('1/3. lépés'), await title());
    ok((await stepper.locator('li').count()) === 3, 'nem 3 lépés');
    ok((await stepper.locator('li').first().getAttribute('aria-current')) === 'step', 'nincs aria-current');
    ok((await stepper.locator('button').count()) === 0, 'előre is kattintható');
    ok((await save().count()) === 0, 'köztes lépésen is van Mentés'); ok((await back().count()) === 0, 'az első lépésen van Vissza');
  });
  await t('Tovább hibás lépéssel: marad, jelzi („2 mezőt javíts ki…”), a fókusz az első hibás mezőn; a többi lépés hibája nem látszik', async () => {
    await next().click();
    await page.locator('.bc-sablon-step-error').filter({ hasText: '2 mezőt javíts ki' }).waitFor();
    await until(async () => (await focused()).name === 'nev', `fókusz: ${JSON.stringify(await focused())}`);
    ok((await title()).includes('1/3'), 'továbblépett'); ok((await summary.count()) === 0, 'az összesítő is megjelent');
    ok((await stepper.locator('li').first().getAttribute('class')).includes('is-current'), 'nem a mostani');
  });
  await t('javításkor a hiba élőben eltűnik; Tovább → 2. lépés, fókusz a lépés címén, az 1. lépés kész és kattintható', async () => {
    await page.locator('input[name="nev"]').fill('Kávé saját pohárral');
    await page.locator('select[name="kategoria"]').selectOption('vendeglatas');
    await until(async () => (await page.locator('.bc-sablon-step-error').count()) === 0, 'a lépéshiba maradt');
    await next().click();
    await until(async () => (await title()).includes('2/3'), await title());
    await until(async () => (await focused()).cls?.includes('bc-sablon-step-title'), `fókusz: ${JSON.stringify(await focused())}`);
    ok((await stepper.locator('li').first().getAttribute('class')).includes('is-done'), 'az 1. nem kész');
    ok((await stepper.getByRole('button').count()) === 1, 'nem pontosan az 1. lépés kattintható');
    ok((await out()).includes('lépés: hely'), 'az onStepChange nem jött');
  });
  await t('Enter a szövegmezőben = Tovább (nem küldi be az űrlapot); üresen hibát jelez', async () => {
    await page.locator('input[name="cim"]').focus(); await page.keyboard.press('Enter');
    await page.locator('.bc-sablon-step-error').filter({ hasText: 'Egy mezőt javíts ki' }).waitFor();
    ok((await page.locator('input[name="cim"]').getAttribute('aria-invalid')) === 'true', 'a mező nem hibás');
    await page.locator('input[name="cim"]').fill('Ráday u. 12.'); await page.keyboard.press('Enter');
    await until(async () => (await title()).includes('3/3'), await title());
    ok(await save().isVisible(), 'az utolsó lépésen nincs Mentés'); ok((await next().count()) === 0, 'az utolsó lépésen is van Tovább');
  });
  await t('lépésjelző: a bejárt lépés gomb (44 px érintés, a pirula nem nő), rákattintva oda vált; Vissza egy lépést lép', async () => {
    const btn = stepper.getByRole('button', { name: /Alapadatok/ });
    const b = await btn.boundingBox(); const li = await stepper.locator('li').first().boundingBox();
    ok(b.height >= 44, `a gomb ${b.height} px`); ok(li.height <= 34, `a pirula ${li.height} px magas`);
    await btn.click(); await until(async () => (await title()).includes('1/3'), await title());
    ok((await stepper.getByRole('button').count()) === 2, 'a 2. és 3. lépés nem kattintható');
    await stepper.getByRole('button', { name: /Kedvezmény/ }).click(); await until(async () => (await title()).includes('3/3'), await title());
    await back().click(); await until(async () => (await title()).includes('2/3'), await title());
    await next().click(); await until(async () => (await title()).includes('3/3'), await title());
  });
  await t('Ctrl+S a köztes lépésen: nem ment, figyelmeztet, a fókusz a Tovább-on', async () => {
    await stepper.getByRole('button', { name: /Hely/ }).click(); await until(async () => (await title()).includes('2/3'), await title());
    await page.locator('input[name="cim"]').focus(); await page.keyboard.press('Control+s');
    await page.locator('.bc-toast').filter({ hasText: 'Mentés az utolsó lépésen' }).waitFor();
    ok((await focused()).tag === 'BUTTON' && (await page.evaluate(() => document.activeElement?.textContent)).includes('Tovább'), 'a fókusz nem a Tovább-on');
    ok((await out()).includes('mentett név: –'), 'mentett');
    await next().click(); await until(async () => (await title()).includes('3/3'), await title());
  });
  await t('mentés hibával egy korábbi lépésben (Ctrl+S): az összesítő felül, fókusz rajta, a jelző az 1. lépésre vált; a link a mezőre visz', async () => {
    await page.locator('input[name="kedvezmeny"]').fill('10');
    await stepper.getByRole('button', { name: /Alapadatok/ }).click(); await page.locator('input[name="nev"]').fill('Foglalt');
    await stepper.getByRole('button', { name: /Kedvezmény/ }).click(); await until(async () => (await title()).includes('3/3'), await title());
    await page.keyboard.press('Control+s');
    await summary.filter({ hasText: 'már van' }).waitFor({ timeout: 3000 });
    await until(async () => (await title()).includes('1/3'), `nem ugrott: ${await title()}`);
    await until(async () => (await focused()).cls?.includes('bc-sablon-summary'), 'a fókusz nem az összesítőn');
    ok((await stepper.locator('li').first().getAttribute('class')).includes('is-current'), 'a hibás lépés nem a mostani');
    await stepper.getByRole('button', { name: /Kedvezmény/ }).click(); await until(async () => (await title()).includes('3/3'), await title());
    ok((await stepper.locator('li').first().getAttribute('class')).includes('is-error'), 'a hibás lépés nincs jelölve');
    await summary.getByRole('link', { name: /Kupon neve/ }).click();
    await until(async () => (await title()).includes('1/3'), 'az összesítő-link nem váltott lépést');
    await until(async () => (await focused()).name === 'nev', `fókusz: ${JSON.stringify(await focused())}`);
  });
  await t('sikeres mentés az utolsó lépésen: értesítés, mentett érték, a hibajelzés eltűnik', async () => {
    await page.locator('input[name="nev"]').fill('Kávé saját pohárral');
    await stepper.getByRole('button', { name: /Kedvezmény/ }).click(); await until(async () => (await title()).includes('3/3'), await title());
    await save().click();
    await page.locator('.bc-toast').filter({ hasText: 'A kupon létrejött.' }).waitFor({ timeout: 3000 });
    ok((await out()).includes('mentett név: Kávé saját pohárral'), await out());
    await until(async () => (await summary.count()) === 0, 'az összesítő maradt');
  });
  await t('telefonon (390 px): a gombsor elfér (Mégse · Vissza · Tovább), nincs kilógás', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await stepper.getByRole('button', { name: /Hely/ }).click(); await page.waitForTimeout(150);
      const r = await page.evaluate(() => { const b = document.querySelector('.bc-sablon-bar').getBoundingClientRect(); const gombok = [...document.querySelectorAll('.bc-sablon-bar .bc-btn')].map((x) => x.getBoundingClientRect()); return { bent: gombok.every((g) => g.left >= b.left - 1 && g.right <= b.right + 1), n: gombok.length }; });
      ok(r.n === 3 && r.bent, JSON.stringify(r));
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= 391), 'kilógás');
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
  const cls = async () => stepper.locator('li').evaluateAll((l) => l.map((e) => e.className));
  await t('másolat: minden lépés kezdettől elérhető, de a még nem látott „hátravan” (szám, nem pipa) – Javaslat 21', async () => {
    await go('masolat');
    ok((await stepper.getByRole('button').count()) === 2, `${await stepper.getByRole('button').count()} kattintható lépés`);
    let k = await cls();
    ok(k[0].includes('is-current') && k[1].includes('is-todo') && k[2].includes('is-todo'), `kezdetben: ${k}`);
    ok((await stepper.locator('li').nth(1).innerText()).includes('2'), 'a nem látott lépésen nincs szám');
    ok((await stepper.locator('li').nth(1).locator('.bc-sr').innerText()).includes('még hátravan'), 'képernyőolvasónak nem „hátravan”');
    await stepper.getByRole('button', { name: /Kedvezmény/ }).click(); await until(async () => (await title()).includes('3/3'), await title());
    k = await cls();
    ok(k[0].includes('is-done') && k[1].includes('is-todo') && k[2].includes('is-current'), `a 3. lépésre ugrás után: ${k}`);
    ok((await stepper.getByRole('button', { name: /Hely/ }).count()) === 1, 'a nem látott lépés nem kattintható');
    await stepper.getByRole('button', { name: /Hely/ }).click(); await until(async () => (await title()).includes('2/3'), await title());
    k = await cls();
    ok(k[0].includes('is-done') && k[1].includes('is-current') && k[2].includes('is-done'), `a 2. lépésen: ${k}`);
  });
  await t('másolat: a látott, de kiürített lépés nem kap pipát (hátravan), csak újra kitöltve', async () => {
    await page.locator('input[name="cim"]').fill('');
    await stepper.getByRole('button', { name: /Alapadatok/ }).click(); await until(async () => (await title()).includes('1/3'), await title());
    ok((await cls())[1].includes('is-todo'), `a kiürített lépés: ${(await cls())[1]}`);
    await stepper.getByRole('button', { name: /Hely/ }).click(); await page.locator('input[name="cim"]').fill('Ráday u. 12.');
    await stepper.getByRole('button', { name: /Alapadatok/ }).click(); await until(async () => (await title()).includes('1/3'), await title());
    ok((await cls())[1].includes('is-done'), `újra kitöltve: ${(await cls())[1]}`);
    await go();
  });
  await t('hosszú lépésnevek: a jelző tördel, nincs kilógás telefonon', async () => {
    await go('hosszu');
    await page.setViewportSize({ width: 320, height: 640 });
    try { await page.waitForTimeout(150); ok(await page.evaluate(() => document.documentElement.scrollWidth <= 321), 'kilógás'); }
    finally { await page.setViewportSize({ width: 1280, height: 800 }); await go(); }
  });
  await t('1.43.1: a „Tovább” kattintás az utolsó lépésre NEM küldi be az űrlapot (a gomb nem változik helyben Mentéssé)', async () => {
    await go();
    await page.locator('input[name="nev"]').fill('Kávé saját pohárral');
    await page.locator('select[name="kategoria"]').selectOption('vendeglatas');
    await next().click(); await until(async () => (await title()).includes('2/3'), await title());
    await page.locator('input[name="cim"]').fill('Ráday u. 12.');
    await next().click(); await until(async () => (await title()).includes('3/3'), await title());
    await page.waitForTimeout(900); // a minta-mentés 400 ms
    ok((await summary.count()) === 0, 'az utolsó lépésre lépve beküldte az űrlapot (hibaösszesítő jelent meg)');
    ok((await page.locator('.bc-sablon-step-error').count()) === 0, 'az utolsó lépésre lépve ellenőrzött (beküldés)');
    ok((await out()).includes('mentett név: –'), 'az utolsó lépésre lépve elmentette');
  });
}
