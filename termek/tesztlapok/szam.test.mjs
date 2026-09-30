const ok = (c, m) => { if (!c) throw new Error(m); };
export default async function ({ page, t }) {
  const i = (id) => page.locator(`[data-case="${id}"] input`);
  const out = (id) => page.locator(`[data-out="${id}"]`).innerText();
  await t('betű nem írható be', async () => { await i('szam-szazalek').fill(''); await i('szam-szazalek').pressSequentially('1a2b'); ok((await i('szam-szazalek').inputValue()) === '12', await i('szam-szazalek').inputValue()); });
  await t('150 a 0–100-ban: kilépéskor 100 + jelzés', async () => {
    await i('szam-szazalek').fill(''); await i('szam-szazalek').pressSequentially('150'); ok((await i('szam-szazalek').inputValue()) === '150', 'gépelés közben vágott');
    await i('szam-szazalek').blur(); ok((await i('szam-szazalek').inputValue()) === '100', await i('szam-szazalek').inputValue());
    ok((await page.locator('[data-case="szam-szazalek"] .bc-notice').innerText()).includes('100'), 'nincs jelzés'); ok((await out('szazalek')).includes('100'), 'érték nem 100');
  });
  await t('ezres tagolás kilépéskor (1 234 567)', async () => ok((await i('szam-ft').inputValue()) === '1 234 567', await i('szam-ft').inputValue()));
  await t('tizedesvessző és pont is; második tizedesjel tiltva; 1 jegy', async () => {
    await i('szam-tized').fill(''); await i('szam-tized').pressSequentially('3.25,7'); ok((await i('szam-tized').inputValue()) === '3,2', await i('szam-tized').inputValue());
    await i('szam-tized').blur(); ok((await out('tized')).includes('3.2'), await out('tized'));
  });
  await t('mínusz csak ahol megengedett', async () => {
    await i('szam-szazalek').fill(''); await i('szam-szazalek').pressSequentially('-5'); ok((await i('szam-szazalek').inputValue()) === '5', 'mínusz beírható');
    await i('szam-negativ').fill(''); await i('szam-negativ').pressSequentially('-5'); ok((await i('szam-negativ').inputValue()) === '-5', 'mínusz tiltva');
  });
  await t('üres ≠ 0', async () => { await i('szam-ures').fill(''); await i('szam-ures').blur(); ok((await out('ures')).includes('üres'), await out('ures')); });
  await t('clamp=input: gépelés közben a határra áll', async () => { await i('szam-input').fill(''); await i('szam-input').pressSequentially('25'); ok((await i('szam-input').inputValue()) === '10', await i('szam-input').inputValue()); });
}
