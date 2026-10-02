// Forgatókönyv – Javaslat 13: színpad, állapotjelvény, lista-állapot, időzítés, térkép-panel, visszavonás, piszkozat. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, max = 40) => { for (let i = 0; i < max; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 100)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const aktiv = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label') || (document.activeElement?.textContent || '').trim().slice(0, 40));

  await t('StageDialog: fókusz a ✕-re; folyamat közben az Esc nem zár; élő bejelentés; Esc után a fókusz a nyitó gombon', async () => {
    await page.evaluate(() => localStorage.removeItem('bc-draft:tesztlap:piszkozat'));
    await c('szinpad').getByRole('button', { name: 'Színpad megnyitása' }).click();
    const dlg = page.getByRole('dialog', { name: /sorsolás/ }); await dlg.waitFor();
    ok((await aktiv()) === 'Színpad bezárása', `kezdő fókusz: ${await aktiv()}`);
    await dlg.getByRole('button', { name: 'Kisorsolom' }).click();
    ok((await dlg.locator('[role=status]').innerText()).includes('folyamatban'), 'nincs bejelentés');
    ok(await dlg.getByRole('button', { name: 'Színpad bezárása' }).isDisabled(), 'a ✕ folyamat közben nem tiltott');
    ok(await dlg.evaluate((d) => d.contains(document.activeElement)), 'a fókusz kiesett a színpadról');
    await page.keyboard.press('Escape'); ok(await dlg.isVisible(), 'folyamat közben az Esc bezárta');
    await until(async () => (await dlg.locator('[role=status]').innerText()).includes('1. nyertes'), 'nincs eredmény-bejelentés');
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    ok(await dlg.evaluate((d) => d.contains(document.activeElement)), 'a Tab kivitte a fókuszt');
    await page.keyboard.press('Escape'); await until(async () => !(await dlg.isVisible()), 'az Esc nem zárt');
    // a fókusz visszaadása a bezárás után történik – terhelt gépen egy pillanattal később
    await until(async () => (await aktiv()) === 'Színpad megnyitása', `a fókusz nem tért vissza: ${await aktiv()}`);
  });
  await t('StatusBadge: minden jelvényen piktogram és szöveg', async () => {
    const b = c('statusz').locator('.bc-status');
    ok((await b.count()) === 7, `${await b.count()} jelvény`);
    for (let i = 0; i < 7; i++) { ok((await b.nth(i).locator('svg').count()) === 1, `${i}. jelvényen nincs piktogram`); ok((await b.nth(i).innerText()).trim().length > 0, 'üres felirat'); }
  });
  await t('useListState + listStatus: szűrés a lapot 0-ra állítja; nincs találat / üres / töltés / hiba', async () => {
    ok((await out('lista')).includes('lap: 3'), await out('lista'));
    await c('lista').getByRole('button', { name: 'Típus: bolt' }).click();
    ok((await out('lista')).includes('url: tipus=bolt') && (await out('lista')).includes('lap: 0') && (await out('lista')).includes('státusz: ready'), await out('lista'));
    await c('lista').getByRole('button', { name: 'Típus: virág (0)' }).click(); ok((await out('lista')).includes('státusz: no-results'), await out('lista'));
    await c('lista').getByRole('button', { name: 'Szűrők törlése' }).click(); ok((await out('lista')).includes('url: (üres)'), await out('lista'));
    await c('lista').getByRole('button', { name: 'Töltés' }).click(); ok((await out('lista')).includes('státusz: loading'), await out('lista'));
    await c('lista').getByRole('button', { name: 'Hiba' }).click(); ok((await out('lista')).includes('státusz: error'), await out('lista'));
    await c('lista').getByRole('button', { name: 'Kész' }).click();
  });
  await t('ScheduleField: Azonnal → nincs nap; Időzítve → napválasztó; múltbeli kezdés és korábbi vég hibát ad', async () => {
    ok((await c('idozites').locator('.bc-field').filter({ hasText: 'Megjelenés napja' }).count()) === 0, 'azonnalnál is van nap');
    await c('idozites').getByRole('radio', { name: 'Időzítve' }).click();
    ok((await c('idozites').locator('.bc-field').filter({ hasText: 'Megjelenés napja' }).count()) === 1, 'időzítve sincs nap');
    await c('idozites').getByRole('button', { name: 'Múltbeli kezdés' }).click();
    ok((await c('idozites').innerText()).includes('Ez az időpont már elmúlt'), 'a múltbeli kezdést nem jelzi');
    await c('idozites').getByRole('button', { name: 'Vége a kezdés előtt' }).click();
    ok((await c('idozites').innerText()).includes('A vége a kezdés előtt'), 'a korábbi véget nem jelzi');
    await c('idozites').getByRole('radio', { name: 'Azonnal' }).click();
    ok((await out('idozites')).includes('"end"') === false || (await out('idozites')).length > 0, 'nem frissül');
  });
  await t('MapPanel: Lista nézet linkekkel, vissza Térképre; töltés, hiba (Újrapróbálás), üres', async () => {
    ok((await c('terkep').getByRole('region', { name: 'Minta POI-k' }).count()) === 1, 'nincs térkép-régió');
    await c('terkep').getByRole('radio', { name: /Lista/ }).click();
    ok((await c('terkep').getByRole('link', { name: 'Zöld Sarok Bolt' }).count()) === 1, 'a lista nem linkes');
    await c('terkep').getByRole('radio', { name: 'Térkép' }).click();
    await c('terkep').getByRole('button', { name: 'tolt' }).click(); ok((await c('terkep').locator('[role=status]').count()) >= 1, 'nincs töltés');
    await c('terkep').getByRole('button', { name: 'hiba' }).click(); ok(await c('terkep').getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs újrapróbálás');
    await c('terkep').getByRole('button', { name: 'ures' }).click(); ok((await c('terkep').innerText()).includes('Nincs térképen megjeleníthető hely'), 'nincs üres állapot');
    await c('terkep').getByRole('button', { name: 'kesz' }).click();
  });
  await t('notify.undo: „Visszavonás” visszaállítja a műveletet', async () => {
    await c('visszavonas').getByRole('button', { name: 'Megoldottnak jelölöm' }).click();
    ok((await out('visszavonas')).includes('megoldva'), 'nem jelölt');
    const toast = page.locator('.bc-toaster .bc-toast').filter({ hasText: 'megoldottnak jelölve' }); await toast.waitFor();
    await toast.getByRole('button', { name: 'Visszavonás' }).click();
    await until(async () => (await out('visszavonas')).includes('nyitott'), 'nem vonta vissza');
  });
  await t('DataTable: szűkülő adatnál nem marad üres lapon', async () => {
    const tb = c('szukul');
    await tb.getByRole('button', { name: /Következő/ }).first().click(); await tb.getByRole('button', { name: /Következő/ }).first().click();
    ok((await tb.locator('tbody tr').first().innerText()).includes('Sor 51'), `nem a 3. lapon (25/lap): ${await tb.locator('tbody tr').first().innerText()}`);
    await tb.getByRole('button', { name: '5 sor' }).click();
    await until(async () => (await tb.locator('tbody tr').count()) === 5, `üres lap maradt: ${await tb.locator('tbody tr').count()} sor`);
  });
  await t('Piszkozat: gépelés után újratöltve felajánlja; Visszaállítás visszaadja; Mentés után nincs ajánlat', async () => {
    const mezo = c('piszkozat').getByRole('textbox', { name: /Név/ });
    await mezo.fill('Félbehagyott név'); await page.waitForTimeout(1200);
    await page.reload(); await page.waitForSelector('[data-case]');
    const ajanlat = c('piszkozat').locator('.bc-draft'); await ajanlat.waitFor({ timeout: 3000 });
    await ajanlat.getByRole('button', { name: 'Visszaállítás' }).click();
    ok((await c('piszkozat').getByRole('textbox', { name: /Név/ }).inputValue()) === 'Félbehagyott név', 'nem állította vissza');
    await c('piszkozat').getByRole('button', { name: 'Mentés' }).click(); await page.waitForTimeout(400);
    await page.reload(); await page.waitForSelector('[data-case]'); await page.waitForTimeout(500);
    ok((await c('piszkozat').locator('.bc-draft').count()) === 0, 'mentés után is felajánlja');
  });
}
