// Forgatókönyv – tömör vezérlők (Javaslat 20): kattintható lépésjelző, sorbeli kapcsoló, nyíl-piktogramok. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m, ms = 3000) => { for (let i = 0; i < ms / 50; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();

  await t('lépésjelző: a bejárt lépések gombok, a mostani nem (aria-current="step"), a hátralévő nem', async () => {
    const ol = c('lepes').locator('ol.bc-steps');
    ok((await ol.getByRole('button').count()) === 2, `${await ol.getByRole('button').count()} gomb`);
    ok((await ol.locator('li').nth(2).getAttribute('aria-current')) === 'step', 'nincs aria-current');
    ok((await ol.locator('li').nth(3).locator('button').count()) === 0, 'a hátralévő is gomb');
  });
  await t('lépésjelző: 44 px érintési felület, a pirula ~30 px marad; kattintás és billentyűzet (Enter) vált', async () => {
    const ol = c('lepes').locator('ol.bc-steps');
    const b = await ol.getByRole('button', { name: /Alapadatok/ }).boundingBox(); const li = await ol.locator('li').first().boundingBox();
    ok(b.height >= 44, `gomb ${b.height}`); ok(li.height <= 34, `pirula ${li.height}`);
    await ol.getByRole('button', { name: /Alapadatok/ }).click();
    ok((await out('lepes')).includes('Alapadatok (1.)'), await out('lepes'));
    ok((await ol.locator('li').first().getAttribute('aria-current')) === 'step', 'nem vált');
    await ol.getByRole('button', { name: /Képek/ }).focus(); await page.keyboard.press('Enter');
    ok((await out('lepes')).includes('Képek (3.)'), await out('lepes'));
    ok((await ol.getByRole('button', { name: /Hely/ }).innerText()).includes('Hely'), 'nincs felirat');
    ok((await ol.getByRole('button', { name: /Hely/ }).textContent()).includes('kész'), 'a képernyőolvasó-állapot hiányzik');
  });
  await t('hibás lépés is választható; onSelect nélkül nincs gomb', async () => {
    const ol = c('lepes-hiba').locator('ol.bc-steps');
    ok((await ol.locator('li.is-error button').count()) === 1, 'a hibás lépés nem gomb');
    ok((await c('lepes-mutato').locator('button').count()) === 0, 'onSelect nélkül is gomb');
  });
  await t('sorbeli kapcsoló: role="switch", névvel; 44 px érintés, de a sort nem nyújtja (a sor < 60 px)', async () => {
    const sw = c('sor').getByRole('switch', { name: 'Látható az appban: Méhes Kávézó' });
    ok((await sw.getAttribute('aria-checked')) === 'true', 'rossz kezdőállapot');
    const b = await sw.boundingBox(); ok(b.height >= 44 && b.width >= 44, `${b.width}×${b.height}`);
    const tr = await c('sor').locator('tr[data-sor="p1"]').boundingBox(); ok(tr.height < 60, `a sor ${tr.height} px`);
    ok((await c('sor').locator('tr[data-sor="p1"] .bc-switch-state').innerText()) === 'Látható', 'nincs állapot-szöveg');
  });
  await t('sorbeli kapcsoló: kattintásra mentés közben tiltott (aria-busy), utána vált; Szóköz is kapcsol', async () => {
    const sw = c('sor').getByRole('switch', { name: 'Látható az appban: Méhes Kávézó' });
    await sw.click();
    ok((await sw.getAttribute('aria-busy')) === 'true' && (await sw.isDisabled()), 'mentés közben nem tiltott');
    await until(async () => (await out('tabla')).includes('p1:R'), await out('tabla'));
    ok((await c('sor').locator('tr[data-sor="p1"] .bc-switch-state').innerText()) === 'Rejtett', 'a szöveg nem vált');
    const k = c('sor').getByRole('switch', { name: /^Kiemelt: Javító/ });
    await k.focus(); await page.keyboard.press('Space');
    await until(async () => (await out('tabla')).includes('p3:LK'), await out('tabla'));
  });
  await t('önálló kapcsoló: alap és tömör méret, tiltott nem kapcsol', async () => {
    await c('kapcs-md').getByRole('switch').click(); ok((await out('kapcs-md')) === 'be', 'nem kapcsolt');
    const md = await c('kapcs-md').getByRole('switch').boundingBox(); const sm = await c('kapcs-sm').getByRole('switch').boundingBox();
    ok(md.width === 56 && sm.width === 44, `szélesség ${md.width} / ${sm.width}`);
    await c('kapcs-sm').getByRole('switch').click(); ok((await c('kapcs-sm').locator('.bc-switch-state').innerText()) === 'Be', 'nincs szöveg');
    await c('kapcs-tiltott').getByRole('switch').click({ force: true }); ok((await out('kapcs-tiltott')) === 'ki', 'tiltva is kapcsolt');
  });
  await t('nyíl-piktogram: szöveges gombban és csak-piktogramos gombban (súgó-buborékkal)', async () => {
    ok((await c('nyil').locator('.bc-btn svg').count()) >= 2, 'nincs piktogram');
    await page.mouse.move(0, 0); await c('nyil').getByRole('button', { name: 'Következő', exact: true }).focus(); await page.keyboard.press('Tab');
    await page.locator('.bc-tooltip').filter({ hasText: 'Előző hónap' }).first().waitFor({ timeout: 3000 });
    await page.keyboard.press('Escape');
  });
}
