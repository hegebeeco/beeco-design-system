const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  await t('folyamatban lévő gomb nem kattintható (dupla beküldés ellen)', async () => { await page.locator('[data-case="gomb-allapot"] [aria-busy="true"]').click({ force: true }); ok((await page.locator('[data-out="busy"]').innerText()).includes('0'), 'kattintott'); });
  await t('szegmentált kapcsoló: nyíllal lép és vált, a tiltottat átugorja', async () => {
    const first = page.locator('[data-case="seg-harom"] .bc-seg-item').first(); await first.focus(); await page.keyboard.press('ArrowRight');
    ok((await page.locator('[data-out="seg"]').innerText()).includes('csempe'), await page.locator('[data-out="seg"]').innerText());
    await page.keyboard.press('ArrowRight'); ok((await page.locator('[data-out="seg"]').innerText()).includes('lista'), 'nem ugrotta át a tiltottat');
  });
  await t('a gombfeliratban a „…” három pontként rajzolódik, nem egyként (HIBA, Javaslat 15)', async () => {
    const r = await page.evaluate(async () => {
      const b = document.querySelector('[data-case="gomb-kipontozas"] .bc-btn');
      await document.fonts.load(`${getComputedStyle(b).fontSize} ${getComputedStyle(b).fontFamily}`, '…. '); await document.fonts.ready;
      const m = (t) => { const s = document.createElement('span'); s.textContent = t; b.appendChild(s); const w = s.getBoundingClientRect().width; s.remove(); return w; };
      return { e: m('…'), p: m('.') };
    });
    ok(r.e >= 2.2 * r.p, `a „…” szélessége ${r.e.toFixed(1)} px, egy ponté ${r.p.toFixed(1)} px – egy pontnak látszik`);
  });
  await t('ikongombnak van neve', async () => ok((await page.locator('.bc-icon-btn:not([aria-label])').count()) === 0, 'név nélküli ikongomb'));
}
