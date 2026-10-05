// Forgatókönyv – 06b/13 LocationPicker: gépelés (vessző, tartomány), keresés, térkép, jelenlegi hely (engedve / tiltva). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const lat = c('hely').getByRole('textbox', { name: 'Szélesség (lat)', exact: true }), lng = c('hely').getByRole('textbox', { name: 'Hosszúság (lng)', exact: true });

  await t('koordináta gépelése tizedesvesszővel és ponttal → pont, mini-térkép nélkül is', async () => {
    await lat.fill(''); await lat.pressSequentially('47,4979'); await lng.fill(''); await lng.pressSequentially('19.0402'); await lng.blur();
    const o = await out('hely'); ok(o.startsWith('47,4979 · 19,0402') && o.includes('fields'), o);
    ok((await lng.inputValue()) === '19,0402', `pont → vessző: ${await lng.inputValue()}`);
  });
  await t('betű nem írható be a koordináta-mezőbe', async () => {
    await lat.fill(''); await lat.pressSequentially('4a7,5x'); ok((await lat.inputValue()) === '47,5', await lat.inputValue()); await lat.blur();
  });
  await t('tartományon kívül: kilépéskor a határra igazít + jelzés (95 → 90)', async () => {
    await lat.fill(''); await lat.pressSequentially('95'); await lat.blur();
    ok((await lat.inputValue()) === '90', await lat.inputValue());
    ok((await c('hely').locator('.bc-notice').first().innerText()).includes('90'), 'nincs igazítás-jelzés');
    ok((await out('hely')).startsWith('90 ·'), await out('hely'));
  });
  await t('Magyarországon kívül: figyelmeztetés (nem hiba), felcserélésnél „Felcserélem” javít', async () => {
    ok(await c('hely-kulfold').locator('.bc-loc-warn').isVisible(), 'nincs figyelmeztetés');
    ok((await c('hely-kulfold').locator('[aria-invalid="true"]').count()) === 0, 'hibának jelölte');
    await c('hely-csere').getByRole('button', { name: 'Felcserélem' }).click();
    const o = await out('hely-csere'); ok(o.startsWith('47,4979 · 19,0402') && o.includes('swap'), o);
    ok((await c('hely-csere').locator('.bc-loc-warn').count()) === 0, 'a figyelmeztetés maradt');
  });
  await t('címkeresés: gépelés → lista → választás frissíti a koordinátákat (billentyűzettel)', async () => {
    const box = c('hely').getByRole('combobox', { name: 'Cím keresése' });
    await box.click(); await box.pressSequentially('szeged', { delay: 20 });
    await c('hely').page().locator('[role="option"]', { hasText: 'Széchenyi tér 1' }).waitFor({ timeout: 3000 });
    await page.keyboard.press('Enter');
    const o = await out('hely'); ok(o.startsWith('46,2547 · 20,1486') && o.includes('search'), o);
    ok((await lat.inputValue()) === '46,2547', await lat.inputValue());
  });
  await t('térképre kattintás letűzi a pontot, nyíllal mozgatható', async () => {
    const map = c('hely').locator('[data-terkep]'); const b = await map.boundingBox();
    await map.click({ position: { x: b.width / 2, y: b.height / 2 } });
    let o = await out('hely'); ok(o.includes('(map)') && o.startsWith('47,15'), o);
    await map.focus(); await page.keyboard.press('ArrowUp'); o = await out('hely'); ok(o.startsWith('47,2'), o);
    ok(await c('hely').locator('.bc-map-pin.is-selected').isVisible(), 'nincs tű');
  });
  await t('címkereső hiba → Újrapróbálás; töltés közben jelzés', async () => {
    const box = c('hely-kereso-hiba').getByRole('combobox'); await box.click(); await box.pressSequentially('pest');
    await page.getByRole('button', { name: 'Újrapróbálás' }).waitFor({ timeout: 3000 }); await page.keyboard.press('Escape');
    const box2 = c('hely-kereso-tolt').getByRole('combobox'); await box2.click(); await box2.pressSequentially('pest');
    await page.locator('.bc-list-note', { hasText: 'Töltöm' }).waitFor({ timeout: 3000 }); await page.keyboard.press('Escape');
  });
  await t('jelenlegi helyem: engedve → pont + pontosság', async () => {
    await page.context().grantPermissions(['geolocation']); await page.context().setGeolocation({ latitude: 47.53, longitude: 21.63, accuracy: 35 });
    await c('hely').getByRole('button', { name: 'Jelenlegi helyem' }).click();
    await c('hely').locator('.bc-loc-geo .bc-notice').waitFor({ timeout: 5000 });
    ok((await c('hely').locator('.bc-loc-geo .bc-notice').innerText()).includes('±35 m'), 'nincs pontosság');
    const o = await out('hely'); ok(o.startsWith('47,53 · 21,63') && o.includes('geo'), o);
  });
  await t('jelenlegi helyem: tiltva → teendős üzenet', async () => {
    // A fej nélküli Chromium a meg nem adott engedélyt nem utasítja el (a kérdés függőben marad) – a „nem engedted” választ itt utánozzuk
    await page.evaluate(() => { navigator.geolocation.getCurrentPosition = (_ok, err) => err({ code: 1, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3, message: 'denied' }); });
    await c('hely-mini').getByRole('button', { name: 'Jelenlegi helyem' }).click();
    const e = c('hely-mini').locator('[data-geo="denied"]'); await e.waitFor({ timeout: 5000 });
    ok((await e.innerText()).includes('keresd meg a címet'), await e.innerText());
  });
  await t('tiltott: a mezők és a térkép nem állíthatók; csak olvasható: nincs kereső és gomb', async () => {
    ok(await c('hely-tiltott').getByRole('textbox', { name: 'Szélesség (lat)', exact: true }).isDisabled(), 'a mező nem tiltott');
    ok(await c('hely-tiltott').locator('[data-terkep]').isDisabled(), 'a térkép nem tiltott');
    ok((await c('hely-olvas').getByRole('combobox').count()) === 0 && (await c('hely-olvas').getByRole('button', { name: 'Jelenlegi helyem' }).count()) === 0, 'van kereső/gomb');
    ok(await c('hely-olvas').getByRole('textbox', { name: 'Szélesség (lat)', exact: true }).evaluate((e) => e.readOnly), 'nem csak olvasható');
  });
  await t('hiba: a csoport aria-invalid, a szöveg megmondja a teendőt; vázlaton kívüli pont jelezve', async () => {
    ok((await c('hely-hiba').locator('fieldset').getAttribute('aria-invalid')) === 'true', 'nincs aria-invalid');
    ok((await c('hely-hiba').locator('.bc-error').innerText()).includes('Jelöld ki'), 'nincs hiba');
    ok((await c('hely-vazlaton-kivul').locator('.bc-loc-mini svg').getAttribute('aria-label')).includes('vázlaton kívül'), 'nincs jelzés');
  });
  await t('a koordináta-mezők név szerint is elérhetők (latName / lngName – Javaslat 18)', async () => {
    ok((await c('hely').locator('input[name="latitude"]').count()) === 1, 'nincs name=latitude');
    ok((await c('hely').locator('input[name="longitude"]').count()) === 1, 'nincs name=longitude');
  });
}
