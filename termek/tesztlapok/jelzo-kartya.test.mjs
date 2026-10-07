// Forgatókönyv – JelzoKartya (06e): vezérelt érték (kattintás, nyilak), ikon + szöveg minden jelzésnél, irány, szövegek (számláló,
// max. hossz), kötelező + hiba (aria-invalid, aria-describedby, fókusz), tiltott, 44 px, telefonon nincs kilógás. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const ertek = async (id) => JSON.parse(await c(id).locator(`[data-out="${id}"]`).innerText());

  await t('két rádiócsoport névvel (legend), három jelzés, három irány; mind ikon + szöveg', async () => {
    const g = c('ures').getByRole('radiogroup');
    ok((await c('ures').locator('fieldset').count()) === 2, 'nem két fieldset');
    ok((await c('ures').getByRole('group', { name: 'Hogy áll most?' }).count()) === 1 && (await c('ures').getByRole('group', { name: 'Merre tart?' }).count()) === 1, 'nincs csoportnév');
    const opc = c('ures').locator('.bc-jelzo-opcio.is-nagy');
    ok((await opc.count()) === 3, 'nem 3 jelzés');
    for (let i = 0; i < 3; i++) {
      ok((await opc.nth(i).locator('svg').count()) === 1, `${i}: nincs ikon`);
      ok((await opc.nth(i).innerText()).trim().length > 3, `${i}: nincs szöveg`);
    }
    void g;
  });
  await t('kattintás: jelzés és irány bekerül a vezérelt értékbe', async () => {
    await c('ures').getByRole('radio', { name: /Sárga/ }).check({ force: true });
    await c('ures').getByRole('radio', { name: 'Előre megy' }).check({ force: true });
    const e = await ertek('ures'); ok(e.jelzes === 'sarga' && e.irany === 'elore', JSON.stringify(e));
  });
  await t('billentyűzet: egy Tab-megálló csoportonként, a nyilak léptetnek és választanak; a fókusz a kártyán látszik', async () => {
    await c('ures').getByRole('radio', { name: /Sárga/ }).focus();
    await page.keyboard.press('ArrowRight');
    ok((await ertek('ures')).jelzes === 'piros', 'a nyíl nem váltott');
    const keret = await page.evaluate(() => getComputedStyle(document.activeElement.closest('.bc-jelzo-opcio')).outlineStyle);
    ok(keret !== 'none', 'nincs látható fókusz a kártyán');
    await page.keyboard.press('Tab');
    const most = await page.evaluate(() => document.activeElement.value);
    ok(most === 'elore', `a Tab nem a következő csoportra ugrott: ${most}`);
  });
  await t('szövegek: lenyitható, számláló, a max. hossznál megáll; az érték kulcs szerint kerül be', async () => {
    const d = c('ures').locator('details');
    ok(!(await d.getAttribute('open')), 'üresen is nyitva');
    await d.locator('summary').click();
    const ta = c('ures').getByLabel('Mi akadályoz?', { exact: true });
    await ta.fill('Kevés az idő.');
    ok((await ertek('ures')).szovegek.akadaly === 'Kevés az idő.', 'nem került be');
    await c('sajat-mezo').getByLabel('Egy szó a hónapról', { exact: true }).fill('x'.repeat(60));
    ok((await ertek('sajat-mezo')).szovegek.egy.length <= 40, 'a 40 karakteres határ nem fog');
    ok((await c('sajat-mezo').locator('.bc-field').innerText()).includes('/40'), 'nincs számláló');
  });
  await t('kitöltött érték: kijelölve jelenik meg, a szöveges rész nyitva', async () => {
    ok(await c('kitoltott').getByRole('radio', { name: /Sárga/ }).isChecked(), 'nem kijelölt');
    ok(await c('kitoltott').getByRole('radio', { name: 'Helyben áll' }).isChecked(), 'irány nem kijelölt');
    ok((await c('kitoltott').locator('details').getAttribute('open')) !== null, 'nincs nyitva');
    ok((await c('kitoltott').locator('.bc-jelzo-cim').evaluate((e) => e.tagName)) === 'H2', 'cimSzint=2 nem h2');
  });
  await t('kötelező + hiba: beküldés választás nélkül → hibaszöveg, aria-invalid, aria-describedby; választás után eltűnik', async () => {
    await c('hiba').getByRole('button', { name: 'Beküldöm' }).click();
    const fs = c('hiba').locator('fieldset').first();
    ok((await fs.getAttribute('aria-invalid')) === 'true', 'nincs aria-invalid');
    const idr = await fs.getAttribute('aria-describedby');
    ok(idr && (await page.locator(`[id="${idr}"]`).innerText()).includes('Válassz'), 'a hiba nincs a csoporthoz kötve');
    ok((await c('hiba').locator('legend').first().innerText()).includes('*'), 'nincs kötelező jel');
    await c('hiba').getByRole('radio', { name: /Zöld/ }).check({ force: true });
    ok((await c('hiba').locator('.bc-error').count()) === 0, 'a hiba megmaradt');
  });
  await t('tiltott: a rádiók tiltottak, a választás nem változik', async () => {
    const r = c('tiltott').getByRole('radio', { name: /Piros/ });
    ok(await r.isDisabled(), 'nem tiltott');
    ok(await c('tiltott').getByRole('radio', { name: /Zöld/ }).isChecked(), 'a kitöltött érték nem látszik');
  });
  await t('irány és szöveg nélkül csak a jelzés-csoport van', async () => {
    ok((await c('irany-nelkul').locator('fieldset').count()) === 1 && (await c('irany-nelkul').locator('details').count()) === 0, 'fölösleges rész');
  });
  await t('angol feliratok', async () => {
    ok(await c('angol').getByRole('radio', { name: /Red/ }).isChecked(), 'nincs angol felirat / érték');
    ok(await c('angol').getByRole('group', { name: 'Where is it heading?' }).isVisible(), 'nincs angol irány-kérdés');
  });
  await t('44 px és telefonon (320) nincs kilógás, hosszú cím tördelődik', async () => {
    const h = await c('ures').locator('.bc-jelzo-opcio').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    ok(h.every((x) => x >= 44), h.join(','));
    await page.setViewportSize({ width: 320, height: 640 }); await page.reload(); await page.waitForSelector('[data-case]'); await page.waitForTimeout(100);
    const r = await page.evaluate(() => {
      const box = document.querySelector('[data-case="hosszu"] .bc-jelzo').getBoundingClientRect();
      const ki = [...document.querySelectorAll('[data-case="hosszu"] .bc-jelzo *')].filter((e) => e.getBoundingClientRect().right > box.right + 1).length;
      return { lap: document.documentElement.scrollWidth - innerWidth, ki };
    });
    ok(r.lap <= 0 && r.ki === 0, `kilógás: oldal ${r.lap} px, ${r.ki} elem`);
    await page.setViewportSize({ width: 1280, height: 800 }); await page.reload(); await page.waitForSelector('[data-case]');
  });
}
