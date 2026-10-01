// Forgatókönyv – Statisztika-csempe, sparkline, hőtérkép-jelmagyarázat. Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  const txt = (id) => c(id).innerText();
  await t('magyar számformátum és egység: „1 284 db”', async () => ok((await c('kpi-jo').locator('.bc-stat-value').innerText()).replace(/\s/g, ' ').includes('1 284 db'), await c('kpi-jo').locator('.bc-stat-value').innerText()));
  await t('változás: nyíl + előjel + mihez képest + jelentés szövegben (nem csak szín)', async () => {
    ok((await txt('kpi-jo')).includes('+12% az előző 30 naphoz') && (await txt('kpi-jo')).includes('jó irány'), await txt('kpi-jo'));
    ok((await txt('kpi-rossz')).includes('rossz irány'), 'a több hibajegy nem rossz irány');
    ok(await c('kpi-rossz').locator('.bc-kpi-delta.is-bad').count() === 1, 'nem a rossz szín');
    ok((await txt('kpi-semleges')).includes('−0,5 perc'), 'tizedes vessző / mínusz');
  });
  await t('1–4 érintett: „rejtve”, a szám nem látszik', async () => { ok((await txt('kpi-rejtve')).includes('rejtve') && !(await c('kpi-rejtve').locator('.bc-stat-value').innerText()).includes('3'), await txt('kpi-rejtve')); });
  await t('nincs adat „—”, új időszak „új”, előtte 0 → nincs %', async () => {
    ok((await c('kpi-nincs').locator('.bc-stat-value').innerText()).includes('—'), 'nincs —');
    ok((await txt('kpi-uj')).includes('új'), 'nincs új'); const d = await c('kpi-nulla').locator('.bc-kpi-delta').innerText(); ok(d.includes('+37 (előtte 0)') && !d.includes('%'), d);
  });
  await t('becslés: ~ és „becslés”', async () => ok((await txt('kpi-becsles')).includes('~') && (await txt('kpi-becsles')).includes('becslés'), 'nincs becslés-jel'));
  await t('nagy szám 180 px-en nem lóg ki', async () => {
    const r = await c('kpi-nagy').locator('.bc-stat').evaluate((e) => [e.scrollWidth, e.clientWidth]); ok(r[0] <= r[1] + 1, `kilóg: ${r}`);
  });
  await t('súgó ⓘ megnyílik', async () => { await c('kpi-jo').locator('.bc-help-btn').click(); ok(await page.locator('.bc-pop').isVisible(), 'nem nyílt'); await page.keyboard.press('Escape'); });
  await t('hiba: Újrapróbálás gomb; töltés: role=status', async () => {
    ok(await c('kpi-hiba').getByRole('button', { name: 'Újrapróbálás' }).isVisible(), 'nincs gomb'); ok(await c('kpi-tolt').locator('[role=status]').count() === 1, 'nincs status');
  });
  await t('hőtérkép: 5 fokozat határszámokkal, színtévesztő módban más szín', async () => {
    ok((await c('heat').locator('li').allInnerTexts()).join('|') === '1–20|21–40|41–60|61–80|81+', (await c('heat').locator('li').allInnerTexts()).join('|'));
    const bg = (id) => c(id).locator('.bc-heatkey-sw').last().evaluate((e) => getComputedStyle(e).backgroundColor);
    ok((await bg('heat')) !== (await bg('heat-cb')), 'a cb skála ugyanaz');
  });
}
