import { Logo, ThemeProvider, ThemeToggle, useTheme, themeInitScript } from '../src';
import { Case, Grid, mount } from './_keret';

function Allapot() {
  const { mode, resolved } = useTheme();
  return <p className="tl-out" data-out="tema">mód: {mode} · látszik: {resolved}</p>;
}

function Oldal() {
  return (
    <ThemeProvider>
      <Grid title="Téma (ThemeProvider, ThemeToggle) – Javaslat 09">
        <Case id="tema-kapcsolo" title="Beállítás-oldalra: Világos · Sötét · Rendszer szerint">
          <ThemeToggle variant="segmented" />
          <Allapot />
        </Case>
        <Case id="tema-ikon" title="Kompakt helyre: csak piktogram (a hold sötétre, a nap világosra vált)">
          <ThemeToggle />
        </Case>
        <Case id="tema-angol" title="Kétnyelvű appban: feliratok i18n-ből (labels)">
          <ThemeToggle variant="segmented" labels={{ group: 'Appearance', light: 'Light', dark: 'Dark', auto: 'System', toDark: 'Switch to dark mode', toLight: 'Switch to light mode' }} />
          <ThemeToggle labels={{ toDark: 'Switch to dark mode', toLight: 'Switch to light mode' }} />
        </Case>
        <Case id="tema-minta" title="Minta: a szerepek maguktól váltanak">
          <div className="bc-card"><strong className="bc-card-title">Kártya</strong><p>Fő szöveg, <span className="bc-muted">másodlagos szöveg</span>.</p><button type="button" className="bc-btn">Fő gomb</button></div>
        </Case>
        <Case id="tema-logo" title="Logó (Javaslat 10): sötét módban a fekete részek krémszínűek">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--bc-sp-4)' }}><Logo size="s" /><Logo /><Logo size="l" /></div>
        </Case>
        <Case id="tema-logo-oszlop" title="Logó oszlopos flex-tárolóban (pl. belépő kártya): nem nyúlik ki, balra áll">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bc-sp-2)', maxWidth: 360 }}><Logo size="l" /><p>admin</p></div>
        </Case>
        <Case id="tema-mehsejt" title="Méhsejt-háttér (.bc-honeycomb): a méz színéből, a tartalom alatt">
          <div className="bc-honeycomb" style={{ minHeight: 160, padding: 'var(--bc-sp-4)', border: 'var(--bc-bw-hair) solid var(--bc-line-soft)', borderRadius: 'var(--bc-r-m)' }}>
            <p>A minta díszítő: a szöveg fölötte olvasható marad, kattintani rajta keresztül is lehet.</p>
            <button type="button" className="bc-btn is-secondary">Gomb a minta fölött</button>
          </div>
        </Case>
        <Case id="tema-init" title="Villanásmentes indítás: a <head>-be tett szkript (themeInitScript)">
          <pre className="tl-out" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{`<script>${themeInitScript()}</script>`}</pre>
        </Case>
      </Grid>
    </ThemeProvider>
  );
}
mount('Téma', 'Világos, sötét vagy a rendszer szerint; az eszköz megjegyzi, más fülön is követi. Csak a szerepek váltanak – ami szerepet használ, az magától jó sötétben is.', <Oldal />);
