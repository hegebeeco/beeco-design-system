import { ThemeProvider, ThemeToggle, useTheme, themeInitScript } from '../src';
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
        <Case id="tema-init" title="Villanásmentes indítás: a <head>-be tett szkript (themeInitScript)">
          <pre className="tl-out" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{`<script>${themeInitScript()}</script>`}</pre>
        </Case>
      </Grid>
    </ThemeProvider>
  );
}
mount('Téma', 'Világos, sötét vagy a rendszer szerint; az eszköz megjegyzi, más fülön is követi. Csak a szerepek váltanak – ami szerepet használ, az magától jó sötétben is.', <Oldal />);
