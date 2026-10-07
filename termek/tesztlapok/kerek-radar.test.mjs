// Forgatókönyv – KerekRadar (06e): tengelycímke-gombok (egy Tab-megálló, nyilak, Enter/Szóköz, egér), kijelölés kiemelése,
// lista és táblázat ugyanazzal az adattal, hiányzó érték ≠ 0, változás előjellel, 2/14 tengely → csak táblázat, üres, töltés,
// hosszú címke tördelve, telefonon nincs kilógás, 44 px. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = () => c('alap').locator('[data-out="kijelolt"]').innerText();

  await t('a rajzon tengelyenként egy címke-gomb, pontosan egy Tab-megálló, a kijelölt aria-pressed', async () => {
    const g = c('alap').locator('svg [role="button"]');
    ok((await g.count()) === 8, `${await g.count()} címke`);
    ok((await c('alap').locator('svg [role="button"][tabindex="0"]').count()) === 1, 'nem egy Tab-megálló');
    const on = c('alap').locator('svg [role="button"][aria-pressed="true"]');
    ok((await on.count()) === 1 && (await on.getAttribute('aria-label')).startsWith('Kommunikáció: 5'), await on.getAttribute('aria-label'));
    ok((await on.getAttribute('aria-label')).includes('előző 6,5') && (await on.getAttribute('aria-label')).includes('változás −1,5'), 'nincs előző / változás a névben');
  });
  await t('billentyűzet: nyíllal lép, Enterrel és Szóközzel választ; Home/End', async () => {
    const on = c('alap').locator('svg [role="button"][tabindex="0"]');
    await on.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
    ok((await out()).includes('tanulas'), await out());
    await page.keyboard.press('End'); await page.keyboard.press(' ');
    ok((await out()).includes('hatas'), await out());
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
    ok((await out()).includes('cel'), `körbe: ${await out()}`);
    const fokusz = await page.evaluate(() => { const e = document.activeElement; const s = getComputedStyle(e); return s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0; });
    ok(fokusz, 'a címke-gomb fókusza nem látszik');
  });
  await t('egér: a rajzon a címkére, a listában a sorra kattintva választ; a kijelölt küllő kiemelve', async () => {
    await c('alap').locator('svg [role="button"]').nth(6).click();
    ok((await out()).includes('penz'), await out());
    ok((await c('alap').locator('.bc-kerek-kullo.is-on').count()) === 1, 'nincs kiemelt küllő');
    await c('alap').locator('.bc-kerek-lista').getByRole('button', { name: /Jókedv/ }).click();
    ok((await out()).includes('jokedv'), await out());
    ok((await c('alap').locator('.bc-kerek-lista [aria-pressed="true"]').innerText()).includes('Jókedv'), 'a lista nem jelzi a kijelöltet');
  });
  await t('lista: érték magyarul, változás előjellel szövegesen (nem csak színnel), új és hiányzó érték', async () => {
    const sor = (nev) => c('alap').locator('.bc-kerek-lista-elem', { hasText: nev }).innerText();
    ok((await sor('Közös cél')).replace(/\s+/g, ' ').includes('8,5 +1,5'), await sor('Közös cél'));
    ok((await sor('Csapatmunka')).includes('±0'), await sor('Csapatmunka'));
    ok((await sor('Tanulás')).includes('új'), 'az előző nélküli nem „új”');
    ok((await sor('Hatás')).includes('+3'), await sor('Hatás'));
    ok((await c('hianyos').locator('.bc-kerek-lista-elem', { hasText: 'Csapatmunka' }).innerText()).includes('nincs adat'), 'null ≠ nincs adat');
  });
  await t('hiányzó érték nem nulla: a rajzon kimarad (6 tengelyből 4 jel)', async () => {
    const jel = await c('hianyos').locator('svg.bc-kerek-svg .bc-kerek-sor .bc-mark').count();
    ok(jel === 4, `${jel} jel a 4 érték helyett`);
    ok((await c('hianyos').locator('svg [role="button"]').nth(1).getAttribute('aria-label')).includes('nincs adat'), 'a címke nem mondja ki');
  });
  await t('nézetváltó: kerék ↔ táblázat; a táblázatban ugyanazok a számok, változás és jelzés szöveggel', async () => {
    await c('alap').getByRole('radio', { name: 'Táblázat' }).click();
    const tabla = c('alap').locator('table');
    ok(await tabla.isVisible(), 'nincs táblázat');
    const sor = await tabla.locator('tbody tr', { hasText: 'Pénzügyi' }).innerText();
    ok(sor.includes('1') && sor.includes('2,5') && sor.includes('−1,5') && sor.includes('Piros'), sor);
    ok((await tabla.locator('caption').innerText()).includes('0–10'), 'nincs felirat');
    await tabla.getByRole('button', { name: 'Hatás' }).click();
    ok((await out()).includes('hatas'), await out());
    ok((await tabla.locator('tr[aria-current="true"]').innerText()).includes('Hatás'), 'a sor nem jelzi a kijelöltet');
    await c('alap').getByRole('radio', { name: 'Kerék' }).click();
    ok(await c('alap').locator('svg.bc-kerek-svg').isVisible(), 'nem jött vissza a kerék');
  });
  await t('csak megjelenítő kerék: nincs gomb, nincs tabindex', async () => {
    ok((await c('egy').locator('[role="button"], button:not(.bc-seg-item), [tabindex="0"]:not(.bc-seg-item)').count()) === 0, 'interaktív elem van');
    ok((await c('egy').locator('.bc-kerek-lista').count()) === 0, 'van lista, pedig lista={false}');
  });
  await t('jelmagyarázat: minden sorozat neve; a 2. sorozat szaggatott (alak is más)', async () => {
    const j = await c('alap').locator('.bc-kerek-jelmagyarazat li').allInnerTexts();
    ok(j.length === 2 && j[0].includes('október') && j[1].includes('szeptember'), j.join('|'));
    const dash = await c('alap').locator('.bc-kerek-svg .is-osszevet .bc-kerek-terulet').evaluate((e) => getComputedStyle(e).strokeDasharray);
    ok(dash && dash !== 'none', 'az összevetés nem szaggatott');
  });
  await t('3 és 12 tengely kerék; 2 és 14 tengely csak táblázat magyarázattal', async () => {
    ok((await c('harom').locator('svg [role="button"]').count()) === 3, '3');
    ok((await c('tizenketto').locator('svg [role="button"]').count()) === 12, '12');
    for (const id of ['ket', 'tizennegy']) {
      ok((await c(id).locator('svg.bc-kerek-svg').count()) === 0 && (await c(id).locator('table').isVisible()), `${id}: nem táblázat`);
      ok((await c(id).locator('.bc-seg').count()) === 0 && (await c(id).locator('.bc-kerek-megj').isVisible()), `${id}: nincs magyarázat`);
    }
  });
  await t('hosszú címke: legfeljebb 3 sor, „…”, a teljes név az aria-labelben; nem lóg ki a dobozból', async () => {
    const g = c('hosszu').locator('svg [role="button"]').first();
    const sorok = await g.locator('.bc-kerek-cimke-nev').count();
    ok(sorok <= 3, `${sorok} sor`);
    ok((await g.getAttribute('aria-label')).includes('Pszichológiai biztonság a csapaton belül és a rajok között'), 'nincs teljes név');
    const ki = await c('hosszu').evaluate((box) => { const b = box.getBoundingClientRect(); return [...box.querySelectorAll('.bc-kerek-cimke text')].filter((e) => { const r = e.getBoundingClientRect(); return r.left < b.left - 1 || r.right > b.right + 1; }).length; });
    ok(ki === 0, `${ki} címke kilóg`);
  });
  await t('skálán kívüli érték a határra igazítva rajzolódik (nem lóg ki a külső gyűrűn)', async () => {
    const r = await c('szelso-ertek').evaluate((box) => {
      const gy = box.querySelector('.bc-kerek-gyuru.is-kulso').getBoundingClientRect();
      return [...box.querySelectorAll('svg.bc-kerek-svg .bc-kerek-sor .bc-mark')].every((m) => { const k = m.getBoundingClientRect(); const x = k.left + k.width / 2, y = k.top + k.height / 2; return x >= gy.left - 1 && x <= gy.right + 1 && y >= gy.top - 1 && y <= gy.bottom + 1; });
    });
    ok(r, 'egy jel a külső gyűrűn kívül');
  });
  await t('üres (teendővel), tengely nélküli, töltés', async () => {
    ok((await c('ures').locator('.bc-empty').innerText()).includes('Még nincs adat'), 'nincs üres állapot');
    ok(await c('ures').getByRole('button', { name: 'Kitöltöm' }).isVisible(), 'nincs teendő');
    ok(await c('ures-tengely').locator('.bc-empty').isVisible(), 'tengely nélkül nincs üres állapot');
    ok((await c('tolt').locator('[role="status"]').innerText()).includes('Betöltöm'), 'nincs töltés');
    ok((await c('tolt').locator('svg.bc-kerek-svg').count()) === 0, 'töltés közben rajzol');
  });
  await t('angol feliratok (labels)', async () => {
    ok(await c('angol').getByRole('radio', { name: 'Table' }).isVisible(), 'nincs angol nézetváltó');
    ok((await c('angol').locator('.bc-kerek-lista-elem', { hasText: 'Tanulás' }).innerText()).includes('new'), 'nincs „new”');
  });
  await t('telefonon (320): a rajz a dobozban marad, az oldal nem lóg ki; a címke-gombok ≥ 44 px', async () => {
    await page.setViewportSize({ width: 320, height: 640 }); await page.reload(); await page.waitForSelector('[data-case]'); await page.waitForTimeout(150);
    const r = await page.evaluate(() => {
      const box = document.querySelector('[data-case="alap"]').getBoundingClientRect();
      const svg = document.querySelector('[data-case="alap"] svg.bc-kerek-svg').getBoundingClientRect();
      const kicsi = [...document.querySelectorAll('[data-case="alap"] .bc-kerek-cimke-hatter')].map((e) => e.getBoundingClientRect()).filter((b) => b.height < 43.5 || b.width < 43.5).length;
      return { lap: document.documentElement.scrollWidth - innerWidth, svgKi: svg.right > box.right + 1 || svg.left < box.left - 1, kicsi };
    });
    ok(r.lap <= 0, `az oldal ${r.lap} px-szel kilóg`); ok(!r.svgKi, 'a rajz kilóg a dobozból'); ok(r.kicsi === 0, `${r.kicsi} címke kisebb 44 px-nél`);
    await page.setViewportSize({ width: 1280, height: 800 }); await page.reload(); await page.waitForSelector('[data-case]');
  });
}
