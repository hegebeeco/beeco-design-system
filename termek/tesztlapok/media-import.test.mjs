// Forgatókönyv – Média: videó és Excel-import (valódi fájlválasztás). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 5000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
const pad = (head, kb) => Buffer.concat([head, Buffer.alloc(Math.round(kb * 1024))]);
const MP4 = (name, kb = 900) => ({ name, mimeType: 'video/mp4', buffer: pad(Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypisom')]), kb) });
const MOV = { name: 'kert.mov', mimeType: 'video/quicktime', buffer: pad(Buffer.concat([Buffer.from([0, 0, 0, 0x14]), Buffer.from('ftypqt  ')]), 50) };
const XLSX = (name, kb = 40) => ({ name, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: pad(Buffer.from([0x50, 0x4b, 3, 4]), kb) });
const CSV = { name: 'partnerek.csv', mimeType: 'text/csv', buffer: Buffer.from('nev;irsz\nZöld Sarok;1105\n') };

export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const file = (id) => c(id).locator('input[type=file]');
  const step = (id) => c(id).locator('.bc-steps [aria-current=step]').innerText();

  await t('videó: .mov → nem indul, ok + teendő; túl nagy MP4 → a határ és a teendő', async () => {
    const err = c('video').locator('.bc-error');
    await file('video').setInputFiles(MOV);
    await until(async () => (await err.count()) && (await err.innerText()).includes('MOV') && (await err.innerText()).includes('csak MP4'), 'nincs típus-hiba');
    await file('video').setInputFiles(MP4('nagy.mp4', 4000));
    await until(async () => (await err.innerText()).includes('a határ 3 MB') && (await err.innerText()).includes('tömörítsd'), 'nincs méret-hiba');
    ok((await c('video').locator('.bc-count').innerText()).startsWith('0/1'), 'számláló nem 0/1');
  });
  await t('videó: fájl → feltöltés (MB-számláló, haladás) → feldolgozás → kész', async () => {
    await file('video').setInputFiles(MP4('tavaszi-kert.mp4'));
    await until(async () => (await step('video')).includes('Feltöltés'), 'nem a feltöltés lépés');
    ok(/\/\d+ kB|\/0,9 MB/.test(await c('video').locator('.bc-filecard-size').innerText()), await c('video').locator('.bc-filecard-size').innerText());
    ok(await c('video').locator('[role=progressbar]').isVisible(), 'nincs haladásjelző');
    await until(async () => (await out('video')).includes('tavaszi-kert.mp4'), 'nem lett kész');
    ok((await c('video').locator('.bc-steps .is-done').count()) === 4, 'nem minden lépés kész');
  });
  await t('videó: megszakítás → vissza a fájlválasztáshoz, és szól', async () => {
    await c('video').getByRole('button', { name: 'Másik videó' }).click();
    await file('video').setInputFiles(MP4('lassu.mp4'));
    await c('video').getByRole('button', { name: 'Megszakítás' }).click();
    ok((await c('video').locator('.bc-error').innerText()).includes('megszakítottad'), 'nem szólt'); ok(await file('video').isVisible(), 'nincs fájlválasztó');
  });
  await t('videó: a feldolgozás hibázik → a lépésjelzőn hiba, Újrapróbálás → kész', async () => {
    await file('video-proc').setInputFiles(MP4('kert.mp4', 300));
    await until(async () => (await c('video-proc').locator('.bc-steps .is-error').count()) === 1, 'nincs hiba-lépés');
    ok((await c('video-proc').locator('.bc-filecard .bc-error').innerText()).includes('A videó fent van'), 'nem mondja, hogy a feltöltés megmaradt');
    await c('video-proc').getByRole('button', { name: 'Újrapróbálás' }).click();
    await until(async () => (await out('videoproc')).includes('kert.mp4'), 'nem lett kész');
  });
  await t('import: CSV → a mező alatt, teendővel (nem értesítésben)', async () => {
    await file('import').setInputFiles(CSV);
    const err = c('import').locator('.bc-error');
    await until(async () => (await err.count()) && (await err.innerText()).includes('CSV') && (await err.innerText()).includes('.xlsx'), 'nincs típus-hiba');
  });
  await t('import: hibás sorok → összesítő + sor, oszlop, ok, teendő; sorszám szerint', async () => {
    await file('import').setInputFiles(XLSX('partnerek.xlsx'));
    await c('import').locator('.bc-import-result').waitFor({ timeout: 5000 });
    ok((await c('import').locator('.bc-alert').first().innerText()).includes('128 sorból 125 bekerült'), 'nincs összesítő');
    const rows = await c('import').locator('tbody tr').allInnerTexts();
    ok(rows.length === 4 && rows[0].startsWith('14.') && rows[0].includes('Irányítószám') && rows[0].includes('Javítsd'), rows[0]);
    ok(rows[2].includes('Figyelmeztetés'), 'a szint nincs kiírva');
  });
  await t('import: hibalista letöltése CSV-ként', async () => {
    const [dl] = await Promise.all([page.waitForEvent('download'), c('import').getByRole('button', { name: 'Hibalista letöltése' }).click()]);
    ok(dl.suggestedFilename() === 'partnerek-hibalista.csv', dl.suggestedFilename());
  });
  await t('import: másolás → jelzés', async () => {
    await c('import').getByRole('button', { name: 'Másolás' }).click();
    await until(async () => /vágólapra|Nem sikerült/.test(await c('import').locator('.bc-import-result .bc-notice').innerText()), 'nincs jelzés');
  });
  await t('import: ugyanaz a fájl kétszer → rákérdez, Mégis importálom', async () => {
    await c('import').getByRole('button', { name: 'Másik fájl' }).click();
    await file('import').setInputFiles(XLSX('partnerek.xlsx'));
    await c('import').locator('.bc-alert.is-warning').waitFor();
    ok((await c('import').locator('.bc-alert.is-warning').innerText()).includes('már importáltad'), 'nem szólt');
    await c('import').getByRole('button', { name: 'Mégis importálom' }).click();
    await c('import').locator('.bc-import-result').waitFor({ timeout: 5000 });
  });
  await t('import: szerverhiba → ok + Újrapróbálás; üres fájl → „nincs adatsor”', async () => {
    await c('import').getByRole('button', { name: 'Másik fájl' }).click();
    await file('import').setInputFiles(XLSX('szerverhiba.xlsx'));
    await until(async () => (await c('import').locator('.bc-filecard .bc-error').count()) === 1, 'nincs hiba');
    ok(await c('import').getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs Újrapróbálás');
    await c('import').getByRole('button', { name: 'Másik fájl' }).click();
    await file('import').setInputFiles(XLSX('ures.xlsx'));
    await until(async () => (await c('import').locator('.bc-import-result').count()) === 1, 'nincs eredmény');
    ok((await c('import').locator('.bc-import-result').innerText()).includes('nincs adatsor'), 'nem szól az üres fájlról');
  });
  await t('csak sorszám a backendtől: az ok helyén teendő', async () => ok((await c('eredmeny-sorszam').locator('tbody').innerText()).includes('nyisd meg a sort'), 'nincs tartalék szöveg'));
  await t('1 200 hiba: 200 sor látszik + szól a többiről', async () => {
    ok((await c('eredmeny-sok').locator('tbody tr').count()) === 200, 'nem 200 sor');
    ok((await c('eredmeny-sok').innerText()).toLowerCase().includes('az első 200'), 'nem szól');
  });
}
