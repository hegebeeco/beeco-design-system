const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  await t('minden pillanatnál ott a szóvicc ÉS a sima jelentés', async () => {
    const n = await page.locator('[data-pillanat]').count();
    for (let i = 0; i < n; i++) { const m = page.locator('[data-pillanat]').nth(i); ok(await m.locator('.bc-moment-title').innerText(), 'nincs cím'); ok(await m.locator('.bc-moment-text').innerText(), `nincs sima jelentés: ${await m.getAttribute('data-pillanat')}`); }
  });
  await t('a méhecske díszítő (a mondat beszél): aria-hidden', async () => ok((await page.locator('.bc-bee:not([aria-hidden="true"])').count()) === 0, 'van nem díszítő méh'));
  await t('mérges méh nincs a lapon', async () => ok((await page.locator('[data-szerep="mérges"], [data-szerep="merges"]').count()) === 0, 'van mérges'));
  await t('szerverhiba: role=alert', async () => ok((await page.locator('[data-pillanat="szerverhiba"]').getAttribute('role')) === 'alert', 'nem alert'));
  await t('szám felpörgés: a végén pontos, és értékváltáskor nem pörög újra', async () => {
    await page.waitForTimeout(800); ok((await page.locator('[data-out="szam"]').innerText()) === '128', await page.locator('[data-out="szam"]').innerText());
    await page.locator('[data-case="mozg-szam"] button').click(); ok((await page.locator('[data-out="szam"]').innerText()) === '129', 'újrapörgött');
  });
  await t('pecsét: az állapot vált, és a jelvény szövege is', async () => { await page.locator('[data-case="mozg-pecset"] button').click(); ok((await page.locator('[data-out="pecset"]').innerText()) === 'Jóváhagyva', 'nem váltott'); });
  await t('rázás: hibás beküldésnél hibaüzenet + rázás, ami 300 ms után lekerül', async () => {
    await page.locator('[data-case="mozg-razas"] button[type=submit]').click();
    ok(await page.locator('[data-case="mozg-razas"] .bc-error').isVisible(), 'nincs hiba');
    await page.waitForTimeout(350); ok(!(await page.locator('[data-out="razas"]').getAttribute('class'))?.includes('bc-anim-shake'), 'a rázás rajta maradt');
  });
  await t('haladásjelző: aria-valuenow és szöveges állapot', async () => {
    ok((await page.locator('[role=progressbar]').getAttribute('aria-valuenow')) === '42', 'nem 42');
    await page.locator('[data-case="mozg-halad"] button').click(); ok((await page.locator('[role=progressbar]').getAttribute('aria-valuenow')) === '100', 'nem 100');
  });
  await t('konfetti: megjelenik és 700 ms után eltűnik', async () => {
    await page.locator('[data-case="mozg-unnep"] button').click(); ok((await page.locator('.bc-hexpiece').count()) > 0, 'nincs konfetti');
    await page.waitForTimeout(800); ok((await page.locator('.bc-hexpiece').count()) === 0, 'a konfetti ottmaradt');
  });
  await t('csökkentett mozgásnál nincs konfetti', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.locator('[data-case="mozg-unnep"] button').click();
    ok((await page.locator('.bc-hexpiece').count()) === 0, 'konfetti csökkentett mozgásnál'); await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
  await t('sprite: mind a 6 szereplő képe betölt (2×/3× is), és a mozgás véges', async () => {
    const r = await page.evaluate(() => [...document.querySelectorAll('.bc-sprite')].map((e) => { const s = getComputedStyle(e); return [s.backgroundImage.includes('sprite@'), s.animationIterationCount, e.getBoundingClientRect().width]; }));
    ok(r.length === 12, `sprite-ok száma: ${r.length}`); ok(r.every((x) => x[0]), 'hiányzó sprite-kép'); ok(r.every((x) => x[1] !== 'infinite'), 'végtelen sprite-mozgás');
    const bad = await page.evaluate(async () => { const urls = new Set([...document.querySelectorAll('.bc-sprite')].map((e) => getComputedStyle(e).backgroundImage.match(/url\("?([^")]+)/)[1])); const res = await Promise.all([...urls].map((u) => fetch(u).then((x) => x.ok ? null : u))); return res.filter(Boolean); });
    ok(!bad.length, `nem tölt be: ${bad.join(', ')}`);
  });
  await t('sprite: csökkentett mozgásnál áll', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const d = await page.evaluate(() => getComputedStyle(document.querySelector('.bc-sprite')).animationDuration); ok(parseFloat(d) <= 0.01, d);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
}
