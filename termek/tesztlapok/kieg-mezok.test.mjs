// Forgatókönyv – 06a mezők és gombok (valódi gépelés, beillesztés, billentyűzet, kattintás). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
const paste = (page, text) => page.evaluate((t) => { const el = document.activeElement; const dt = new DataTransfer(); dt.setData('text', t); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, text);
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const tel = c('tel-ures').locator('input');

  await t('telefon: gépelés közben tagol (30 123 4567), E.164 kifelé', async () => {
    await tel.click(); await tel.pressSequentially('301234567');
    ok((await tel.inputValue()) === '30 123 4567', `mező: ${await tel.inputValue()}`);
    ok((await out('tel-ures')).includes('+36301234567') && (await out('tel-ures')).includes('érvényes'), await out('tel-ures'));
    ok((await c('tel-ures').locator('.bc-meta').innerText()).includes('9/9'), 'nincs 9/9 állapot');
  });
  await t('telefon: betű nem írható be, és szól', async () => {
    await tel.fill(''); await tel.pressSequentially('30a');
    ok((await c('tel-ures').locator('.bc-notice').innerText()).includes('számjegy'), 'nincs jelzés a betűről');
    await tel.pressSequentially('1');
    ok((await tel.inputValue()) === '30 1', `mező: ${await tel.inputValue()}`);
  });
  await t('telefon: a 9. jegy után a gépelés megáll', async () => {
    await tel.fill(''); await tel.pressSequentially('3012345678999');
    ok((await tel.inputValue()) === '30 123 4567', `mező: ${await tel.inputValue()}`);
  });
  await t('telefon: Backspace átugorja a tagoló szóközt', async () => {
    await tel.fill(''); await tel.pressSequentially('30123'); // „30 123”
    await tel.press('ArrowLeft'); await tel.press('ArrowLeft'); await tel.press('ArrowLeft'); // a „1” elé
    await tel.press('Backspace');
    ok((await tel.inputValue()) === '31 23', `mező: ${await tel.inputValue()}`);
  });
  await t('telefon: beillesztés +36-tal, 06-tal, betűvel; külföldi szám elutasítva', async () => {
    for (const [txt, want] of [['+36 (30) 123-4567', '30 123 4567'], ['06 1 234 5678', '1 234 5678'], ['tel: 06-52/123-456', '52 123 456']]) {
      await tel.fill(''); await tel.focus(); await paste(page, txt);
      await until(async () => (await tel.inputValue()) === want, `„${txt}” → ${await tel.inputValue()} (várt: ${want})`);
    }
    await tel.fill(''); await tel.focus(); await paste(page, '+44 20 7946 0958');
    ok((await tel.inputValue()) === '', 'külföldi számot beírt');
    ok((await c('tel-ures').locator('.bc-notice').innerText()).includes('+36'), 'nem szólt a külföldi számról');
  });
  await t('telefon: túl hosszú beillesztés levágva + jelzés', async () => {
    await tel.fill(''); await tel.focus(); await paste(page, '+36 30 123 4567 89');
    await until(async () => (await tel.inputValue()) === '30 123 4567', 'nem vágta le');
    ok((await c('tel-ures').locator('.bc-notice').innerText()).includes('levágtam'), 'nincs levágás-jelzés');
  });
  await t('telefon: kilépéskor jelzi a hiányzó jegyeket és az ismeretlen előhívót', async () => {
    await tel.fill(''); await tel.pressSequentially('3012'); await tel.blur();
    ok((await c('tel-ures').locator('.bc-error').innerText()).includes('5 számjegy hiányzik'), 'nincs hiányzó-jegy hiba');
    ok((await tel.getAttribute('aria-invalid')) === 'true', 'nincs aria-invalid');
    await tel.fill(''); await tel.pressSequentially('4012345'); await tel.blur();
    ok((await c('tel-ures').locator('.bc-error').innerText()).includes('Ismeretlen előhívó: 40'), 'nincs előhívó-hiba');
  });
  await t('telefon: csak mobil kell – vezetékesre kilépéskor szól', async () => {
    const i = c('tel-csakmobil').locator('input'); await i.focus(); await i.blur();
    ok((await c('tel-csakmobil').locator('.bc-error').innerText()).includes('mobilszám'), 'nincs mobil-hiba');
  });
  await t('csúszka: nyilak, PageUp/Down, Home/End', async () => {
    const th = c('slider-alap').locator('[role=slider]'); await th.focus();
    await page.keyboard.press('ArrowRight'); ok((await out('km')) === 'km: 11', await out('km'));
    await page.keyboard.press('PageUp'); ok((await out('km')) === 'km: 16', await out('km'));
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('PageDown'); ok((await out('km')) === 'km: 10', await out('km'));
    await page.keyboard.press('End'); ok((await out('km')) === 'km: 50', 'End nem a max');
    await page.keyboard.press('ArrowRight'); ok((await out('km')) === 'km: 50', 'túlment a maximumon');
    await page.keyboard.press('Home'); ok((await out('km')) === 'km: 0', 'Home nem a min');
    ok((await th.getAttribute('aria-valuetext')) === '0 km', `aria-valuetext: ${await th.getAttribute('aria-valuetext')}`);
  });
  await t('csúszka: tizedes lépés lebegőpontos hiba nélkül', async () => {
    const th = c('slider-tized').locator('[role=slider]'); await th.focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft');
    ok((await out('csillag')) === 'csillag: 2', await out('csillag'));
  });
  await t('csúszka: kattintás a sávra odaugrik', async () => {
    const tr = c('slider-alap').locator('.bc-slider-track'); const b = await tr.boundingBox();
    await page.mouse.click(b.x + b.width * 0.5, b.y + b.height / 2);
    ok((await out('km')) === 'km: 25', await out('km'));
  });
  await t('tartomány: a fogantyúk nem kereszteződnek (legalább 1 év köz)', async () => {
    const [lo, hi] = [c('range').locator('[role=slider]').first(), c('range').locator('[role=slider]').last()];
    await lo.focus(); await page.keyboard.press('End'); ok((await out('kor')) === 'kor: 64–65', await out('kor'));
    await hi.focus(); await page.keyboard.press('Home'); ok((await out('kor')) === 'kor: 64–65', await out('kor'));
    await page.keyboard.press('End'); ok((await out('kor')) === 'kor: 64–99', await out('kor'));
  });
  await t('tiltott csúszka: nem fókuszálható, billentyű nem hat', async () => ok((await c('slider-tiltott').locator('[role=slider]').getAttribute('tabindex')) === '-1', 'fókuszálható'));
  await t('másolás: vágólapra kerül, „Másolva” pipa, bejelentés, majd visszaáll', async () => {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(page.url()).origin });
    await c('copy-gomb').locator('button').click();
    await until(async () => (await c('copy-gomb').locator('.bc-copy').getAttribute('data-state')) === 'done', 'nem lett kész');
    ok((await c('copy-gomb').locator('button').innerText()).includes('Másolva'), 'nincs „Másolva”');
    ok((await c('copy-gomb').locator('[role=status]').innerText()).includes('kuponkód'), 'nincs bejelentés');
    ok((await page.evaluate(() => navigator.clipboard.readText())) === 'BEECO-OSZ-10', 'nem a kód került a vágólapra');
    await until(async () => (await c('copy-gomb').locator('.bc-copy').getAttribute('data-state')) === 'idle', 'nem állt vissza', 2500);
  });
  await t('másolás: ha a böngésző nem enged, kijelölt tartalék mező jelenik meg', async () => {
    await c('copy-hiba').getByRole('button', { name: /letiltása/ }).click();
    await c('copy-hiba').getByRole('button', { name: /Másolás/ }).click();
    const f = c('copy-hiba').locator('.bc-copy-fallback input');
    await until(() => f.isVisible(), 'nincs tartalék mező');
    ok((await f.inputValue()) === 'BEECO-OSZ-10', 'rossz érték');
    ok(await f.evaluate((e) => e === document.activeElement && e.selectionEnd - e.selectionStart === e.value.length), 'nincs kijelölve');
  });
  await t('letöltés: kész → készül (haladás) → letöltve (méret)', async () => {
    const box = c('dl-siker').locator('.bc-download');
    const dl = page.waitForEvent('download', { timeout: 5000 });
    await box.getByRole('button').first().click();
    ok((await box.getAttribute('data-state')) === 'busy', 'nem készül');
    await until(async () => (await box.locator('[role=progressbar]').count()) > 0, 'nincs haladásjelző');
    await box.getByRole('button').first().click(); // dupla kattintás: nem indít újat
    ok((await (await dl).suggestedFilename()) === 'partnerek-2026-10-01.csv', 'rossz fájlnév');
    await until(async () => (await box.getAttribute('data-state')) === 'done', 'nem lett kész');
    ok(/Letöltve: partnerek-2026-10-01\.csv · [\d,]+ KB/.test(await box.locator('.bc-download-meta').innerText()), await box.locator('.bc-download-meta').innerText());
  });
  await t('letöltés: hiba → „Újra” gomb + szöveges hiba', async () => {
    const box = c('dl-hiba').locator('.bc-download');
    await box.getByRole('button').click();
    await until(async () => (await box.getAttribute('data-state')) === 'error', 'nem lett hiba');
    ok((await box.locator('.bc-error').innerText()).includes('próbáld újra'), 'nincs teendő a hibában');
    ok((await box.getByRole('button').innerText()).includes('Újra'), 'nincs Újra');
  });
  await t('letöltés: megszakítás', async () => {
    const box = c('dl-nincs').locator('.bc-download');
    await box.getByRole('button').first().click(); await box.getByRole('button', { name: 'Megszakítás' }).click();
    ok((await box.getAttribute('data-state')) === 'idle', 'nem állt meg');
    ok((await box.locator('.bc-download-meta').innerText()).includes('megszakítottad'), 'nincs jelzés');
  });
}
