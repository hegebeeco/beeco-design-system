import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { AppShell, HelpButton, PageHeader, ShellAccount, ThemeProvider, ThemeToggle, type NavGroup } from '../src';

// Kétnyelvű app (pl. a partner-app angolul): a váz, a fiókmenü és a súgó feliratai kívülről jönnek (labels / menuLabel / srLabel).
// Saját keret, mint a reteg-vaz: az AppShell maga az oldal.
const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>;
const nav: NavGroup[] = [{ items: [
  { href: '#home', label: 'Home', icon: ic('M4 20V9l8-5 8 5v11H4z'), current: true },
  { href: '#places', label: 'Map places', icon: ic('M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z') },
] }];
const EN = { openMenu: 'Open menu', closeMenu: 'Close menu', menuTitle: 'Menu', expand: 'Expand menu', collapse: 'Collapse menu' };
const TEMA = { toDark: 'Switch to dark mode', toLight: 'Switch to light mode' };

function Oldal() {
  return (
    <ThemeProvider>
      <AppShell collapsible collapseKey="tesztlap-felirat" navLabel="Main navigation" skipLabel="Skip to content" labels={EN}
        brand={<a href="#home" className="bc-brand">beeco <span className="bc-brand-text">partner</span></a>}
        brandCompact={<a href="#home" className="bc-brand" aria-label="beeco partner – home">b</a>} nav={nav}
        account={<div className="bc-row" style={{ alignItems: 'center', gap: 'var(--bc-sp-1)' }}>
          <ShellAccount name="Sample Partner Ltd." detail="partner" menuLabel={(n) => `User menu: ${n}`} loadingLabel="Loading…" items={[{ label: 'Sign out' }]} />
          <ThemeToggle labels={TEMA} />
        </div>}>
        <div data-case="felirat">
          <PageHeader title="Home" description="Labels from i18n (English sample)." />
          <p style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Company name <HelpButton label="Company name" srLabel="Help: Company name">Shown to users in the app.</HelpButton></p>
        </div>
      </AppShell>
    </ThemeProvider>
  );
}

document.title = 'Tesztlap – Alkalmazás-váz (feliratok)';
createRoot(document.getElementById('root')!).render(<StrictMode><Oldal /></StrictMode>);
