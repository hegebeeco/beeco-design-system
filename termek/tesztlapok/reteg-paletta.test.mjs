// Forgatókönyv – kereső-paletta (Javaslat 20): Ctrl+K nyit/zár, combobox + csoportosított listbox, billentyűzet, új lap, tiltott sor,
// töltés / hiba / nincs találat / 1200 találat, hosszú név; useShellNav: a telefonos fiókban a kereső-gomb előbb bezárja a fiókot.
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const dlg = page.getByRole('dialog', { name: 'Keresés' });
  const input = () => dlg.getByRole('combobox');
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  const active = () => page.evaluate(() => { const i = document.querySelector('.bc-cmdk [role=combobox]'); const id = i?.getAttribute('aria-activedescendant'); return id ? document.getElementById(id)?.querySelector('.bc-cmdk-label')?.textContent : null; });
  const nyit = async () => { if (!(await dlg.isVisible())) await page.keyboard.press('Control+k'); await dlg.waitFor(); };

  await t('Ctrl+K nyit: a fókusz a mezőben, üresen a legutóbbiak csoportja + tipp; Ctrl+K újra zár, a fókusz visszaáll', async () => {
    await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
    await nyit();
    await until(async () => page.evaluate(() => document.activeElement?.getAttribute('role') === 'combobox'), 'a fókusz nem a mezőben');
    ok((await dlg.getByRole('group', { name: 'Legutóbb megnyitott' }).count()) === 1, 'nincs legutóbbi csoport');
    ok((await dlg.innerText()).includes('Írj legalább 2 betűt'), 'nincs tipp');
    await page.keyboard.press('Control+k'); await dlg.waitFor({ state: 'detached' });
  });
  await t('keresés: csoportok címmel, kiemelt szó (<mark>), ↑/↓ léptet (körbe, a tiltott sort kihagyja), Enter választ és zár', async () => {
    await nyit(); await input().fill('mé');
    await dlg.getByRole('group', { name: 'Partnerek' }).waitFor();
    ok((await dlg.getByRole('group', { name: 'POI-k' }).count()) === 1, 'nincs POI csoport');
    ok((await dlg.locator('mark').first().innerText()).toLowerCase() === 'mé', 'nincs kiemelés');
    ok((await active()) === 'Méhes Kávézó', `kiemelt: ${await active()}`);
    await page.keyboard.press('ArrowDown'); ok((await active()) !== 'Méhész Bolt', 'a tiltott sorra lépett');
    ok((await active()) === 'Méhecske-kert', `kiemelt: ${await active()}`);
    await page.keyboard.press('ArrowDown'); ok((await active()) === 'Méhes Kávézó', `nem körbe: ${await active()}`);
    await page.keyboard.press('ArrowUp'); ok((await active()) === 'Méhecske-kert', `fel: ${await active()}`);
    ok((await dlg.getByRole('option', { name: /Méhész Bolt/ }).getAttribute('aria-disabled')) === 'true', 'nincs tiltva');
    await page.keyboard.press('Enter'); await dlg.waitFor({ state: 'detached' });
    ok((await out('valasztott')).includes('Méhecske-kert') && !(await out('valasztott')).includes('új lapon'), await out('valasztott'));
  });
  await t('Ctrl+Enter: új lapon – a paletta nyitva marad; egérrel rámutatás kiemel, kattintás választ', async () => {
    await nyit(); await input().fill('kávé'); await dlg.getByRole('option').first().waitFor();
    await page.keyboard.press('Control+Enter'); ok((await out('valasztott')).includes('(új lapon)'), await out('valasztott'));
    ok(await dlg.isVisible(), 'bezárt');
    const o = dlg.getByRole('option', { name: /Javító Kávézó/ }); await o.hover(); ok((await active()) === 'Javító Kávézó', `kiemelt: ${await active()}`);
    await o.click(); await dlg.waitFor({ state: 'detached' }); ok((await out('valasztott')).includes('Javító Kávézó'), await out('valasztott'));
  });
  await t('túl rövid: tipp a hiányzó betűkkel; nincs találat; hiba → Újrapróbálás; töltés → „Keresem…”', async () => {
    await nyit(); await input().fill('m');
    ok((await dlg.innerText()).includes('Írj még legalább 1 betűt'), 'nincs tipp');
    await input().fill('xyz'); await dlg.getByText('Nincs találat erre: „xyz”').waitFor();
    await input().fill('hiba'); await dlg.getByRole('alert').filter({ hasText: 'Nem sikerült keresni' }).waitFor();
    ok(await dlg.getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs Újrapróbálás');
    await input().fill('lassu'); await dlg.getByText('Keresem…').first().waitFor();
    ok((await dlg.locator('[role=listbox]').getAttribute('aria-busy')) === 'true', 'nincs aria-busy');
    await dlg.getByText('Nincs találat erre').waitFor({ timeout: 3000 });
    await page.keyboard.press('Escape'); await dlg.waitFor({ state: 'detached' });
  });
  await t('1200 találat: gyors, Ctrl+End az utolsóra, a kiemelt sor látszik (görget)', async () => {
    await nyit(); const t0 = Date.now(); await input().fill('sok'); await dlg.getByRole('option').nth(1199).waitFor({ state: 'attached' });
    ok(Date.now() - t0 < 3000, `lassú: ${Date.now() - t0} ms`);
    await page.keyboard.press('Control+End'); ok((await active()) === 'Sok kupon 1200.', `kiemelt: ${await active()}`);
    await until(async () => dlg.getByRole('option', { name: 'Sok kupon 1200.' }).evaluate((el) => { const r = el.getBoundingClientRect(); const b = el.closest('.bc-modal-body').getBoundingClientRect(); return r.bottom <= b.bottom + 1 && r.top >= b.top - 1; }), 'nem görgetett oda');
    await page.keyboard.press('Control+Home'); ok((await active()) === 'Sok kupon 1.', `kiemelt: ${await active()}`);
    await page.keyboard.press('Escape'); await dlg.waitFor({ state: 'detached' });
  });
  await t('hosszú név nem lóg ki (telefon 320 px)', async () => {
    await page.setViewportSize({ width: 320, height: 640 });
    try {
      await page.getByRole('button', { name: 'Keresés megnyitása' }).click(); await dlg.waitFor(); await input().fill('zöld');
      await dlg.getByRole('option').first().waitFor();
      ok(await dlg.evaluate((el) => el.scrollWidth <= el.clientWidth + 1), 'a paletta vízszintesen görget');
      ok(await page.evaluate(() => document.documentElement.scrollWidth <= 321), 'kilógás');
      await page.keyboard.press('Escape'); await dlg.waitFor({ state: 'detached' });
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
  await t('useShellNav: széles nézetben keretben, kinyitva; becsukáskor „becsukva”', async () => {
    ok((await out('shell')).includes('keretben · széles · fiók zárva · kinyitva'), await out('shell'));
    await page.getByRole('button', { name: 'Menü becsukása' }).click();
    await until(async () => (await out('shell')).includes('becsukva'), await out('shell'));
    await page.getByRole('button', { name: 'Menü kinyitása' }).click();
  });
  await t('useShellNav telefonon: a fiókban a Keresés gomb előbb bezárja a fiókot, a palettába lehet írni', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    try {
      await page.getByRole('button', { name: 'Menü megnyitása' }).click();
      const fiok = page.getByRole('dialog', { name: 'Menü' }); await fiok.waitFor();
      await fiok.getByRole('button', { name: /Keresés/ }).click();
      await dlg.waitFor(); await fiok.waitFor({ state: 'detached' });
      await until(async () => page.evaluate(() => document.activeElement?.getAttribute('role') === 'combobox'), 'a fókusz nem a paletta mezőjében', 5000);
      await page.keyboard.type('poi');
      ok((await input().inputValue()) === 'poi', 'a palettába nem lehet írni');
      await page.keyboard.press('Escape'); await dlg.waitFor({ state: 'detached' });
    } finally { await page.setViewportSize({ width: 1280, height: 800 }); }
  });
}
