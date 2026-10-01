// Forgatókönyv – Média: képek (valódi fájlválasztás, húzás, billentyűzet). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 4000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
// Valódi (1×1-es) PNG, a végén kitöltéssel a kívánt méretre – a böngésző a kitöltést figyelmen kívül hagyja
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const png = (name, mb = 0.3) => ({ name, mimeType: 'image/png', buffer: Buffer.concat([PNG, Buffer.alloc(Math.round(mb * 1024 * 1024))]) });
const JPG = (name) => ({ name, mimeType: 'image/jpeg', buffer: Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(2000)]) });
const HEIC = { name: 'etlap.jpg', mimeType: 'image/jpeg', buffer: Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypheic'), Buffer.alloc(500)]) };

export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const input = (id) => c(id).locator('input[type=file]');
  const tile = (id, i) => c(id).locator('.bc-tile:not(.is-add):not(.is-upload)').nth(i);
  const menu = async (id, i, item) => {
    // Az előző ablak záráskor visszaadja a fókuszt – megvárjuk, hogy tényleg ezen a gombon legyen
    const trig = tile(id, i).locator('.bc-tile-menu');
    await until(async () => { await trig.focus(); await page.waitForTimeout(60); return trig.evaluate((e) => e === document.activeElement); }, 'a ⋯ gomb nem kap fókuszt');
    await page.keyboard.press('Enter');
    const m = page.locator('.bc-gmenu[data-state="open"]'); await m.waitFor();
    await m.locator('.bc-gmenu-item', { hasText: item }).focus(); await page.keyboard.press('Enter');
    await m.waitFor({ state: 'detached' });
  };

  await t('két kép feltöltése: a csempén „…/… MB”, a végén 6/10 kép', async () => {
    await input('kep-negy').setInputFiles([png('terasz.png', 1.5), png('pult.png', 0.4)]);
    await until(async () => (await c('kep-negy').locator('.bc-tile-size').count()) > 0, 'nincs haladás-csempe');
    ok(/\d+(,\d)?\/1,5 MB/.test(await c('kep-negy').locator('.bc-tile-size').first().innerText()), await c('kep-negy').locator('.bc-tile-size').first().innerText());
    await until(async () => (await out('negy')).split(',').length === 6, 'nem került fel mindkettő');
    ok((await c('kep-negy').locator('.bc-count').innerText()).startsWith('6/10 kép'), await c('kep-negy').locator('.bc-count').innerText());
  });
  await t('rossz típus (HEIC .jpg néven) és túl nagy fájl: el sem indul, ok + teendő a mező alatt', async () => {
    await input('kep-negy').setInputFiles([HEIC, png('nagy.png', 6)]);
    const err = c('kep-negy').locator('.bc-upload-errors'); await err.waitFor();
    const txt = await err.innerText();
    ok(txt.includes('etlap.jpg') && txt.includes('csak JPG, PNG, WebP') && txt.includes('töltsd fel újra'), txt);
    ok(txt.includes('nagy.png') && txt.includes('a határ 5 MB') && txt.includes('Kicsinyítsd le'), txt);
    ok((await c('kep-negy').locator('.bc-count').innerText()).startsWith('6/10'), 'a hibás is bekerült');
  });
  await t('ugyanaz a fájl kétszer: szól, nem tölti fel újra', async () => {
    await input('kep-negy').setInputFiles([png('terasz.png', 1.5)]);
    await until(async () => (await c('kep-negy').locator('.bc-upload-errors').innerText()).includes('már kiválasztottad'), 'nem szólt');
    ok((await out('negy')).split(',').length === 6, await out('negy'));
  });
  await t('több fájl, mint ami fér (2-es határ, 3 fájl): az első 2 indul, a harmadikról üzenet', async () => {
    await input('kep-kicsi').setInputFiles([JPG('a.jpg'), JPG('b.jpg'), JPG('c.jpg')]);
    await until(async () => (await out('kicsi')).split(',').length === 2, 'nem 2 került fel');
    ok((await c('kep-kicsi').locator('.bc-upload-errors').innerText()).includes('nem fért be'), 'nincs darab-üzenet');
    ok(await input('kep-kicsi').isDisabled(), 'tele van, mégis választható');
  });
  await t('megszakadt feltöltés: a csempén „Nem sikerült”, Újra → bekerül', async () => {
    await input('kep-egy').setInputFiles([png('hiba-kert.png')]);
    const fail = c('kep-egy').locator('.bc-tile.is-failed'); await fail.waitFor({ timeout: 4000 });
    ok((await c('kep-egy').locator('.bc-upload-errors').innerText()).includes('Megszakadt'), 'nincs ok a mező alatt');
    await fail.getByRole('button', { name: /Újrapróbálás/ }).click();
    await until(async () => (await out('egy')).split(',').length === 2, 'az újrapróbálás után sem került fel');
  });
  await t('megszakítás: a csempe eltűnik, és szól', async () => {
    await input('kep-ures').setInputFiles([png('lassu.png')]);
    await c('kep-ures').getByRole('button', { name: /Feltöltés megszakítása/ }).click();
    ok((await c('kep-ures').locator('.bc-tile.is-upload').count()) === 0, 'a csempe maradt');
    ok((await c('kep-ures').locator('.bc-notice').innerText()).includes('Megszakítottad'), 'nem szólt');
  });
  await t('billentyűzet: ⋯ menü → „Előre” → a 3. kép a 2. helyre kerül; „Legyen a borító” → első', async () => {
    await menu('kep-negy', 2, 'Előre'); ok((await out('negy')).startsWith('sorrend: k1, k3, k2'), await out('negy'));
    await menu('kep-negy', 3, 'Legyen a borító'); ok((await out('negy')).startsWith('sorrend: k4, k1, k3, k2'), await out('negy'));
    ok((await tile('kep-negy', 0).locator('.bc-tile-cover').count()) === 1, 'a borító jelvény nem az elsőn');
  });
  await t('húzás egérrel: az utolsó kép az első helyére', async () => {
    await tile('gal-szeles', 2).dragTo(tile('gal-szeles', 0));
    ok((await out('szeles')).startsWith('sorrend: k3'), await out('szeles'));
  });
  await t('képleírás: üresen nem menthető, kitöltve elmenti', async () => {
    await menu('kep-negy', 0, 'Leírás');
    const f = page.locator('.bc-modal input'); await f.waitFor(); await f.fill('');
    await page.locator('.bc-modal').getByRole('button', { name: 'Mentés' }).click();
    ok((await page.locator('.bc-modal .bc-error').innerText()).includes('kötelező'), 'nincs hiba');
    await f.fill('Kerti tó békákkal (mintaadat)'); await page.keyboard.press('Enter');
    await page.locator('.bc-modal').waitFor({ state: 'detached' });
    ok((await out('negy')).includes('leírás nélkül: 2'), await out('negy'));
  });
  await t('törlés: a DS rákérdez, Mégse nem töröl, Törlés igen', async () => {
    const before = (await out('hosszu')).split(',').length;
    await menu('gal-hosszu', 1, 'Törlés'); await page.locator('.bc-modal').getByRole('button', { name: 'Mégse' }).click();
    ok((await out('hosszu')).split(',').length === before, 'Mégse után is törölt');
    await menu('gal-hosszu', 1, 'Törlés'); await page.locator('.bc-modal').getByRole('button', { name: 'Törlés' }).click();
    ok((await out('hosszu')).split(',').length === before - 1, 'nem törölt');
  });
  await t('nagyító: „1/3”, → és ← lapoz (körbe is), Esc zár, a fókusz visszatér', async () => {
    const opener = tile('gal-hosszu', 0).locator('.bc-tile-open');
    await opener.click(); const n = page.locator('[data-lightbox-count]'); await n.waitFor();
    ok((await n.innerText()) === '1/2', await n.innerText());
    await page.keyboard.press('ArrowRight'); ok((await n.innerText()) === '2/2', await n.innerText());
    await page.keyboard.press('ArrowRight'); ok((await n.innerText()) === '1/2', 'nem lapozott körbe');
    ok((await page.locator('.bc-lightbox-cap').innerText()).includes('levendulával'), 'nincs képleírás');
    await page.keyboard.press('Escape'); await n.waitFor({ state: 'detached' });
    await until(() => opener.evaluate((e) => e === document.activeElement), 'a fókusz nem tért vissza');
  });
  await t('képvágó: nyíllal a csúszkán és + gombbal nagyít, Alaphelyzet vissza 1×', async () => {
    const r = c('vago').locator('input[type=range]'); await r.focus();
    for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
    ok((await c('vago').locator('[data-zoom]').innerText()) === '1,5×', await c('vago').locator('[data-zoom]').innerText());
    await c('vago').locator('.bc-cropper-area').focus(); await page.keyboard.press('+');
    ok((await c('vago').locator('[data-zoom]').innerText()) === '1,7×', await c('vago').locator('[data-zoom]').innerText());
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(100);
    await c('vago').getByRole('button', { name: 'Alaphelyzet' }).click();
    ok((await c('vago').locator('[data-zoom]').innerText()) === '1×', 'nem állt vissza');
  });
  await t('kicsi kép rögzített 1:1 aránnyal: nincs aránys-választó, szól, hogy homályos lehet', async () => {
    ok((await c('vago-kicsi').locator('[role=radiogroup]').count()) === 0, 'van arányválasztó');
    await until(async () => (await c('vago-kicsi').locator('.bc-notice').count()) === 1, 'nem figyelmeztet');
  });
  await t('avatar: monogram ékezettel és kettős betűvel, hibás képnél monogram', async () => {
    const lbl = await c('avatar').locator('.bc-avatar').allInnerTexts();
    ok(lbl.includes('KÁ') && lbl.includes('Zs') && lbl.includes('NÉ'), lbl.join(' '));
  });
}
