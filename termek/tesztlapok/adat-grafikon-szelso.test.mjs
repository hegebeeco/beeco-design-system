// Forgatókönyv – Grafikonok – szélső esetek (3.4). Futtatja: tests/check-komponensek.js
const ok = (c, m) => { if (!c) throw new Error(m); };
const until = async (fn, m) => { for (let i = 0; i < 40; i++) { if (await fn()) return; await new Promise((r) => setTimeout(r, 50)); } throw new Error(m); };
export default async function ({ page, t }) {
  const c = (id) => page.locator(`[data-case="${id}"]`);
  await t('nincs adat: „Ebben az időszakban nincs adat” + teendő', async () => {
    ok((await c('graf-ures').innerText()).includes('Ebben az időszakban nincs adat'), 'nincs üres szöveg');
    await c('graf-ures').getByRole('button', { name: 'Válassz hosszabb időszakot' }).click();
    ok((await page.locator('[data-out="ures"]').innerText()).includes('1'), 'a teendő nem futott');
    ok((await c('graf-csaknull').innerText()).includes('nincs adat'), 'a csak-null nem üres');
  });
  await t('egy pont is látszik; minden 0: vonal-jel az alapvonalon; negatív: kiemelt 0-vonal', async () => {
    ok((await c('graf-egy').locator('.bc-chart .bc-mark').count()) === 1, 'nincs pont');
    ok((await c('graf-nulla').locator('.bc-mark-zero').count()) === 5, 'a 0 nem látszik');
    ok((await c('graf-negativ').locator('.bc-zero.is-strong').count()) === 1, 'nincs kiemelt 0-vonal');
  });
  await t('kiugró érték: levágva, jelezve, a pontos szám kiírva', async () => {
    ok((await c('graf-kiugro').locator('.bc-chart-note').innerText()).includes('240'), 'nincs megjegyzés');
    ok((await c('graf-kiugro').locator('.bc-val', { hasText: '↑ 240' }).count()) === 1, 'nincs ↑ 240');
  });
  await t('90 nap: a feliratok ritkítva (≤ 20 x-felirat)', async () => {
    const n = await c('graf-90').locator('text.bc-ax-t[text-anchor=middle]').count(); ok(n > 3 && n <= 20, `x-feliratok: ${n}`);
  });
  await t('hiba → Újrapróbálás → a grafikon megjelenik', async () => {
    ok(await c('graf-hiba').locator('[role=alert]').isVisible(), 'nincs hiba');
    await c('graf-hiba').getByRole('button', { name: 'Újrapróbálás' }).click();
    await until(async () => (await c('graf-hiba').locator('svg[role=img]').count()) === 1, 'nem töltött be');
  });
  await t('töltés: role=status, a cím már látszik', async () => {
    ok(await c('graf-tolt').locator('[role=status]').count() === 1 && await c('graf-tolt').locator('.bc-chart-title').isVisible(), 'nincs');
  });
}
