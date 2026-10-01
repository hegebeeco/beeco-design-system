// Forgatókönyv – 06b/15 VideoPlayer / beágyazás: billentyűk, hiba, töltés, kattintás előtt nincs külső kérés, hibás link. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const kulso = [];
  page.on('request', (r) => { const u = r.url(); if (!/^(https?:\/\/127\.0\.0\.1|data:|blob:)/.test(u)) kulso.push(u); });
  // A kattintás utáni betöltést helyben szolgáljuk ki (a teszt nem megy ki a hálózatra)
  await page.route(/youtube-nocookie\.com|player\.vimeo\.com/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>minta</title><p>minta lejátszó</p>' }));

  await t('a mintavideó betölt (poszter, felirat-sáv)', async () => {
    const v = c('video').locator('video'); await v.waitFor({ timeout: 8000 });
    await page.waitForFunction(() => document.querySelector('[data-case="video"] .bc-video')?.dataset.state === 'ready', null, { timeout: 8000 });
    ok((await v.locator('track').count()) === 1, 'nincs felirat'); ok(Boolean(await v.getAttribute('poster')), 'nincs poszter');
  });
  await t('billentyűzet: Szóköz indít (natív), K megállít, → léptet, M némít', async () => {
    const v = c('video').locator('video'); await v.focus();
    await page.keyboard.press('Space'); await page.waitForFunction(() => !document.querySelector('[data-case="video"] video').paused, null, { timeout: 3000 });
    await page.keyboard.press('k'); ok(await v.evaluate((e) => e.paused), 'K nem állította meg');
    await v.evaluate((e) => { e.currentTime = 0; }); await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100); const ct = await v.evaluate((e) => e.currentTime); ok(ct > 1, `a nyíl nem léptetett (${ct})`);
    await page.keyboard.press('m'); ok(await v.evaluate((e) => e.muted), 'M nem némított');
    ok((await c('video').locator('[role="status"].bc-sr').innerText()).includes('Némítva'), 'nincs bejelentés');
  });
  await t('felirat nélkül: figyelmeztetés teendővel', async () => { ok((await c('video-nincs-felirat').locator('.bc-video-nocc').innerText()).includes('.vtt'), 'nincs'); });
  await t('töltés: jelzés szöveggel', async () => { ok((await c('video-tolt').locator('.bc-video-loading').innerText()).includes('Töltöm'), 'nincs töltés'); });
  await t('hibás fájl: ok + teendő + Újrapróbálás', async () => {
    const e = c('video-hiba').locator('.bc-moment'); await e.waitFor({ timeout: 5000 });
    ok((await e.innerText()).includes('MP4'), await e.innerText()); ok(await c('video-hiba').getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs gomb');
  });
  await t('beágyazás: kattintás előtt NINCS kérés a YouTube/Vimeo felé, kép sem', async () => {
    const betolteskor = await page.evaluate(() => performance.getEntriesByType('resource').map((e) => e.name).filter((u) => !/^(https?:\/\/127\.0\.0\.1|data:|blob:)/.test(u)));
    ok(kulso.length === 0 && betolteskor.length === 0, `külső kérés: ${[...kulso, ...betolteskor].join(', ')}`);
    ok((await page.locator('iframe').count()) === 0, 'van iframe kattintás előtt');
    ok((await c('embed-yt').locator('.bc-vembed-note').innerText()).includes('sütit'), 'nincs adatvédelmi jelzés');
  });
  await t('beágyazás: kattintás (billentyűvel) után tölt a lejátszó, nocookie címmel, kezdőidővel', async () => {
    await c('embed-yt').getByRole('button', { name: 'Videó betöltése' }).focus(); await page.keyboard.press('Enter');
    const f = c('embed-yt').locator('iframe'); await f.waitFor({ timeout: 3000 });
    const src = await f.getAttribute('src'); ok(src.startsWith('https://www.youtube-nocookie.com/embed/M7lc1UVf-VE') && src.includes('start=65'), src);
    ok((await f.getAttribute('title')).includes('YouTube'), 'az iframe-nek nincs neve');
    await page.waitForFunction(() => document.querySelector('[data-case="embed-yt"] .bc-video')?.dataset.state === 'ready', null, { timeout: 5000 });
    ok(kulso.some((u) => u.includes('youtube-nocookie')), 'nem ment kérés kattintás után');
    ok(!kulso.some((u) => u.includes('vimeo')), 'a Vimeo is kérést indított');
  });
  await t('link beillesztése: hibás → teendő; jó YouTube-link → kattintásra betöltő előnézet', async () => {
    const f = c('link').getByRole('textbox', { name: 'Videó linkje', exact: true });
    await f.fill('ez nem link'); ok((await c('link').locator('[data-reason="not-url"]').innerText()).includes('https://'), 'nincs teendő');
    await f.fill('https://example.com/oldal'); ok(await c('link').locator('[data-reason="unsupported"]').isVisible(), 'nincs nem támogatott jelzés');
    await f.fill('https://youtu.be/M7lc1UVf-VE'); ok(await c('link').getByRole('button', { name: 'Videó betöltése' }).isVisible(), 'nincs előnézet');
    await f.fill(''); ok((await c('link').locator('.bc-video-empty').innerText()).includes('illeszd be'), 'nincs üres állapot');
  });
  await t('hibás linkek: mind a 4 ok külön üzenettel', async () => {
    const r = await c('link-hibak').locator('[data-reason]').evaluateAll((e) => e.map((x) => x.dataset.reason));
    ok(r.join() === 'not-url,unsupported,bad-id,insecure', r.join());
  });
}
