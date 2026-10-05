// Forgatókönyv – Adattáblázat (valódi kattintás, billentyűzet). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const th = (id, nev) => c(id).locator('th', { hasText: nev });
  await t('rendezés billentyűvel: Enter → növekvő, újra Enter → csökkenő (aria-sort)', async () => {
    const b = th('tabla-teljes', 'Név').locator('button'); await b.focus(); await page.keyboard.press('Enter');
    ok((await th('tabla-teljes', 'Név').getAttribute('aria-sort')) === 'ascending', 'nem növekvő');
    await page.keyboard.press('Enter'); ok((await th('tabla-teljes', 'Név').getAttribute('aria-sort')) === 'descending', 'nem csökkenő');
    await page.keyboard.press('Enter'); ok((await th('tabla-teljes', 'Név').getAttribute('aria-sort')) === 'none', 'nem kapcsolt ki');
  });
  await t('az oldal összes sorának kijelölése → tömeges sáv „25 kijelölt”, Kijelölés törlése eltünteti', async () => {
    await c('tabla-teljes').locator('thead input[type=checkbox]').check();
    const bar = c('tabla-teljes').locator('.bc-dt-bulk'); await bar.waitFor();
    ok((await bar.innerText()).includes('25 kijelölt'), await bar.innerText());
    await bar.getByRole('button', { name: 'Végleges törlés' }).click();
    ok((await page.locator('[data-out="teljes"]').innerText()).includes('törlés kérve: 25'), 'a tömeges művelet nem kapta meg a sorokat');
    await bar.getByRole('button', { name: 'Kijelölés törlése' }).click();
    ok((await c('tabla-teljes').locator('.bc-dt-bulk').count()) === 0, 'a sáv maradt');
  });
  await t('a kijelölés lapváltáskor megmarad', async () => {
    await c('tabla-teljes').locator('tbody input[type=checkbox]').first().check();
    await c('tabla-teljes').getByRole('button', { name: 'Következő lap' }).click();
    await c('tabla-teljes').locator('tbody input[type=checkbox]').first().check();
    ok((await c('tabla-teljes').locator('.bc-dt-bulk').innerText()).includes('2 kijelölt'), 'elveszett a kijelölés');
    await c('tabla-teljes').getByRole('button', { name: 'Kijelölés törlése' }).click();
  });
  await t('lapozás: Következő → „26–50 / 1 200”, oldalméret 100 → első lap', async () => {
    const info = c('tabla-teljes').locator('.bc-pager-info');
    ok((await info.innerText()).startsWith('26–50'), await info.innerText());
    await c('tabla-teljes').locator('.bc-pager-size select').selectOption('100');
    ok((await info.innerText()).startsWith('1–100'), await info.innerText());
    ok((await c('tabla-teljes').locator('tbody tr').count()) === 100, 'nem 100 sor');
    await c('tabla-teljes').locator('.bc-pager-size select').selectOption('25');
  });
  await t('sor lenyitása: aria-expanded + a részletek sora, a teljes hosszú név', async () => {
    const b = c('tabla-teljes').locator('tbody .bc-dt-expand').nth(2); await b.click();
    ok((await b.getAttribute('aria-expanded')) === 'true', 'nincs aria-expanded');
    const det = page.locator(`[id="${await b.getAttribute('aria-controls')}"]`); ok(await det.isVisible(), 'nincs részletek-sor');
    ok((await det.innerText()).includes('udvari bejárattal'), 'nincs teljes név'); await b.click();
  });
  await t('oszlophúzás billentyűvel: → szélesebb', async () => {
    const r = th('tabla-teljes', 'Kategória').locator('[role=separator]'); const w0 = Number(await r.getAttribute('aria-valuenow'));
    await r.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    ok(Number(await r.getAttribute('aria-valuenow')) === w0 + 32, `${w0} → ${await r.getAttribute('aria-valuenow')}`);
  });
  await t('sűrűség: Sűrű → is-dense', async () => {
    await c('tabla-teljes').getByRole('radio', { name: 'Sűrű' }).click(); ok(await c('tabla-teljes').locator('table.is-dense').count() === 1, 'nem sűrű');
  });
  await t('hiányzó érték rendezéskor a végén marad (növekvő és csökkenő)', async () => {
    const b = th('tabla-hianyzo', 'Képek').locator('button'); await b.click();
    const last = () => c('tabla-hianyzo').locator('tbody tr').last().locator('td.is-num').innerText();
    ok((await last()).includes('–'), `növekvő vége: ${await last()}`); await b.click(); ok((await last()).includes('–'), `csökkenő vége: ${await last()}`);
  });
  await t('szerveroldali lapozás: 2. lap → „11–20 / 312 partner”', async () => {
    await c('tabla-szerver').getByRole('button', { name: '2. lap', exact: true }).click();
    ok((await c('tabla-szerver').locator('.bc-pager-info').innerText()).startsWith('11–20 / 312'), await c('tabla-szerver').locator('.bc-pager-info').innerText());
  });
  await t('üres állapot: van teendő, és működik', async () => {
    await c('tabla-ures').getByRole('button', { name: 'Új POI felvétele' }).click(); ok((await page.locator('[data-out="ures"]').innerText()).includes('1'), 'nem futott');
    ok(await c('tabla-szurt').getByRole('button', { name: 'Szűrők törlése' }).isVisible(), 'nincs Szűrők törlése');
  });
  await t('hiba: role=alert, Újrapróbálás után betöltenek a sorok', async () => {
    ok(await c('tabla-hiba').locator('[role=alert]').isVisible(), 'nincs alert');
    await c('tabla-hiba').getByRole('button', { name: 'Újrapróbálás' }).click();
    await until(async () => (await c('tabla-hiba').locator('tbody tr').count()) === 6, 'nem töltött be');
  });
  await t('töltés: csontváz-sorok, a fejléc marad', async () => {
    ok((await c('tabla-tolt').locator('.bc-skel-row').count()) === 5, 'nincs 5 csontváz-sor'); ok(await c('tabla-tolt').locator('thead th').first().isVisible(), 'nincs fejléc');
  });
  await t('kártyanézet keskeny tárolóban: címke a cella előtt, rendezés-választó', async () => {
    ok(await c('tabla-kartya').locator('.bc-dt-sortsel select').isVisible(), 'nincs rendezés-választó');
    await c('tabla-kartya').locator('.bc-dt-sortsel select').selectOption({ label: 'Név – csökkenő' });
    const before = await c('tabla-kartya').locator('tbody td[data-label="Név"]').first().evaluate((e) => getComputedStyle(e, '::before').content);
    ok(before.includes('Név'), `nincs címke: ${before}`);
  });
  await t('rendezhető oszlop nélkül nincs „Rendezés” választó, és üres eszközsáv sem marad (HIBA, Javaslat 15)', async () => {
    ok((await c('tabla-nincs-rendezes').locator('.bc-dt-sortsel').count()) === 0, 'van rendezés-választó');
    ok((await c('tabla-nincs-rendezes').getByText('Nincs rendezés').count()) === 0, 'van „Nincs rendezés” opció');
    ok(!(await c('tabla-nincs-rendezes').locator('.bc-dt-bar').isVisible().catch(() => false)), 'üres eszközsáv látszik');
  });
  await t('lapozó önállóan: utolsó lap és vissza', async () => {
    await c('lapozo').getByRole('button', { name: '13. lap', exact: true }).click(); ok((await page.locator('[data-out="lapozo"]').innerText()).includes('lap: 13'), 'nem lapozott');
    ok(await c('lapozo').getByRole('button', { name: 'Következő lap' }).isDisabled(), 'az utolsó lapon a Következő nem tiltott');
  });
  await t('Javaslat 15: szűk helyen a kevésbé fontos oszlopok a Részletekbe kerülnek, a műveletoszlop jobbra rögzített', async () => {
    const tab = c('tabla-prioritas');
    const fej = (await tab.locator('thead th').allInnerTexts()).join('|');
    ok(fej.includes('Név') && !fej.includes('Módosítva'), `a 3-as oszlop látszik szűk helyen: ${fej}`);
    ok((await tab.locator('th.is-pin-end').count()) === 1, 'nincs jobbra rögzített műveletoszlop');
    const b = tab.locator('tbody .bc-dt-expand').first(); await b.click();
    const det = page.locator(`[id="${await b.getAttribute('aria-controls')}"]`);
    const txt = await det.innerText();
    ok(txt.includes('Módosítva') && txt.includes('Címkék'), `a rejtett oszlopok nincsenek a Részletekben: ${txt}`);
    const szeles = (await c('tabla-prioritas-szeles').locator('thead th').allInnerTexts()).join('|');
    if ((await page.viewportSize()).width >= 1100) ok(szeles.includes('Módosítva') && (await c('tabla-prioritas-szeles').locator('.bc-dt-expand').count()) === 0, `széles helyen is rejt: ${szeles}`);
  });
  await t('kártya-szerepek: a „detail” oszlopok a lenyitóban, a cím címke nélkül', async () => {
    const k = c('tabla-kartya-szerep');
    ok((await k.locator('td.is-card-title').first().isVisible()), 'nincs cím-cella');
    ok((await k.locator('tbody td[data-label="Módosítva"]').count()) === 0, 'a detail oszlop a kártyán maradt');
    await k.locator('tbody .bc-dt-expand').first().click();
    ok((await k.locator('.bc-dt-hidden').first().innerText()).includes('Módosítva'), 'a detail oszlop nincs a Részletekben');
  });
  await t('telefonos tömeges sáv: kijelöléskor alul, rögzítve; a műveletek működnek', async () => {
    const k = c('tabla-telefonos-bulk');
    await k.locator('tbody input[type=checkbox]').nth(0).check();
    await k.locator('tbody input[type=checkbox]').nth(1).check();
    const bar = k.locator('.bc-dt-bulk'); await bar.waitFor();
    ok((await bar.evaluate((e) => getComputedStyle(e).position)) === 'fixed', 'nem rögzített (fixed) a sáv a keskeny tárolóban');
    await bar.getByRole('button', { name: 'Törlés', exact: true }).click();
    ok((await page.locator('[data-out="telefonos-bulk"]').innerText()).includes('törlés: 2'), 'a művelet nem kapta meg a sorokat');
    await bar.getByRole('button', { name: 'Kijelölés törlése' }).click();
  });
  await t('kártyanézet sűrűség-kapcsoló nélkül: széles nézetben az eszközsáv nem foglal helyet (Javaslat 18)', async () => {
    const box = c('tabla-kartya-sav');
    const w = await box.locator('.bc-dt').evaluate((e) => e.clientWidth);
    const bar = box.locator('.bc-dt-bar');
    if (!(await bar.count())) return;
    const h = await bar.evaluate((e) => e.getBoundingClientRect().height);
    if (w > 640) ok(h === 0, `széles nézetben a sáv ${h}px magas`);
    else ok(h > 0, 'keskeny nézetben a Rendezés-sáv eltűnt');
  });
  await t('bare + defaultDensity (Javaslat 19): a tábla burkán nincs keret és árnyék; alapból sűrű, a kapcsolóval váltható', async () => {
    const box = c('tabla-bare');
    const w = await box.locator('.bc-dt-wrap').evaluate((e) => { const s = getComputedStyle(e); return [s.boxShadow, s.borderTopWidth]; });
    ok(w[0] === 'none' && w[1] === '0px', `keret/árnyék: ${w}`);
    ok((await box.locator('.bc-dt.is-dense').count()) === 1, 'nem sűrű alapból');
    await box.locator('.bc-seg-item', { hasText: 'Kényelmes' }).click();
    await until(async () => (await box.locator('.bc-dt.is-dense').count()) === 0, 'nem váltott kényelmesre');
  });
}
