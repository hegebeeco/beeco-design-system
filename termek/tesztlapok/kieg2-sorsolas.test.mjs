// Időkorlátok: a waitFor csak a terhelt CI-gép miatt bő (8 s / 3 s); a tényleges időt a komponens méri (data-out: …ms), az állítás azon fut.
// Forgatókönyv – 06b/14 PrizeDrawReveal: felfedés ≤ 2,5 s, csökkentett mozgásnál azonnal, újrasorsolás csak indokkal, 0/1 résztvevő, hiba. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t, stabil = async () => {} }) {
  await stabil();
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();

  await t('résztvevők száma látszik', async () => { ok((await c('sorsolas').locator('.bc-draw-count').innerText()).replace(/\s+/g, ' ').includes('24 résztvevő'), 'nincs szám'); });
  await t('sorsolás: méhsejt-felfedés, nyertes ≤ 2,5 s alatt, fókusz a nevén, dupla kattintás nem húz kétszer', async () => {
    const b = c('sorsolas').getByRole('button', { name: 'Sorsolás' });
    await b.click(); await b.click({ force: true }).catch(() => undefined);
    ok(await c('sorsolas').locator('.bc-draw-stage').isVisible(), 'nincs felfedés');
    await c('sorsolas').locator('.bc-draw-winner').waitFor({ timeout: 8000 });
    const o = await out('sorsolas'); const ms = Number(/(\d+)ms/.exec(o)[1]);
    ok(ms <= 2500 && ms >= 1000, `felfedés ${ms} ms`); ok(o.split('|').length === 1, `többször húzott: ${o}`);
    ok(o.includes('p3'), o);
    ok(await page.evaluate(() => document.activeElement?.classList.contains('bc-draw-name')), 'a fókusz nem a nyertesen');
    ok(await c('sorsolas').locator('.bc-bee[data-szerep="bajnok"]').isVisible(), 'nincs Bajnok méh');
  });
  await t('újrasorsolás indok nélkül nem megy (hiba + teendő), indokkal igen, az előző nyertes kimarad', async () => {
    await c('sorsolas').getByRole('button', { name: 'Újrasorsolás' }).click();
    await c('sorsolas').getByRole('button', { name: 'Újrasorsolom' }).click();
    ok((await c('sorsolas').locator('.bc-error').innerText()).includes('miért sorsolsz újra'), 'nincs hiba');
    ok(await page.evaluate(() => document.activeElement?.tagName === 'TEXTAREA'), 'a fókusz nem az indokon');
    await page.keyboard.type('abc'); await c('sorsolas').getByRole('button', { name: 'Újrasorsolom' }).click();
    ok((await c('sorsolas').locator('.bc-error').innerText()).includes('most 3'), 'rövid indok átment');
    await page.keyboard.type(' – nem válaszolt 7 napig'); await c('sorsolas').getByRole('button', { name: 'Újrasorsolom' }).click();
    await c('sorsolas').locator('.bc-draw-kicker', { hasText: '2. húzás' }).waitFor({ timeout: 8000 });
    const o = await out('sorsolas'); ok(o.includes('újra: p3 – abc – nem válaszolt') && o.includes('húzás 2: p4'), o);
    ok((await c('sorsolas').locator('.bc-draw-log li').count()) === 2, 'nincs jegyzőkönyv');
  });
  await t('újrasorsolás Mégse: marad a nyertes', async () => {
    await c('sorsolas').getByRole('button', { name: 'Újrasorsolás' }).click(); await c('sorsolas').getByRole('button', { name: 'Mégse' }).click();
    ok(await c('sorsolas').locator('.bc-draw-winner').isVisible(), 'eltűnt a nyertes');
  });
  await t('csökkentett mozgás: a nyertes azonnal (felfedés nélkül)', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await c('sorsolas-teszt').getByRole('button', { name: 'Sorsolás' }).click();
    await c('sorsolas-teszt').locator('.bc-draw-winner').waitFor({ timeout: 3000 });
    const ms = Number(/(\d+)ms/.exec(await out('sorsolas-teszt'))[1]); ok(ms < 300, `${ms} ms`);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
  await t('teszt-sorsolás: jól látható jelzés a kártyán és a jegyzőkönyvben', async () => {
    ok(await c('sorsolas-teszt').locator('.bc-draw-testnote').isVisible(), 'nincs sáv'); ok(await c('sorsolas-teszt').locator('.bc-draw-test').isVisible(), 'nincs jelvény');
    ok((await out('sorsolas-teszt')).includes('teszt'), 'a napló nem jelzi');
  });
  await t('0 résztvevő: Sorsolás tiltva, méh + teendő', async () => {
    ok(await c('sorsolas-ures').getByRole('button', { name: 'Sorsolás' }).isDisabled(), 'nem tiltott');
    ok(await c('sorsolas-ures').locator('.bc-moment').isVisible(), 'nincs üres állapot');
  });
  await t('1 résztvevő: azonnal ő, újrasorsolás tiltva magyarázattal', async () => {
    await c('sorsolas-egy').getByRole('button', { name: 'Sorsolás' }).click();
    await c('sorsolas-egy').locator('.bc-draw-winner').waitFor({ timeout: 3000 });
    const ms1 = Number((/(\d+)ms/.exec(await out('sorsolas-egy')) || [0, 0])[1]); ok(ms1 < 400, `1 résztvevőnél sem azonnali: ${ms1} ms`);
    ok(await c('sorsolas-egy').getByRole('button', { name: 'Újrasorsolás' }).isDisabled(), 'újrasorsolás nem tiltott');
    ok((await c('sorsolas-egy').locator('.bc-draw-hint').innerText()).includes('Nincs több'), 'nincs magyarázat');
  });
  await t('sorsoló hiba: üzenet + Újrapróbálás, nincs nyertes', async () => {
    await c('sorsolas-hiba').getByRole('button', { name: 'Sorsolás' }).click();
    await c('sorsolas-hiba').locator('.bc-alert.is-danger').waitFor({ timeout: 8000 });
    ok(await c('sorsolas-hiba').getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs újrapróbálás');
    ok((await out('sorsolas-hiba')) === 'még nincs húzás', 'mégis lett nyertes');
  });
  await t('hosszú név és HTML-szerű szöveg: szövegként, nem lóg ki', async () => {
    await c('sorsolas-hosszu').getByRole('button', { name: 'Sorsolás' }).click();
    await c('sorsolas-hosszu').locator('.bc-draw-winner').waitFor({ timeout: 8000 });
    const card = c('sorsolas-hosszu'); ok(await card.evaluate((e) => e.scrollWidth <= e.clientWidth + 1), 'kilóg');
    ok((await card.locator('.bc-draw-log b').count()) === 1, 'jegyzőkönyv hiányzik');
  });
}
