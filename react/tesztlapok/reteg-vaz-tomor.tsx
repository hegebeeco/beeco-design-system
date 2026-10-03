import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { AppShell, PageHeader, ShellAccount, ThemeProvider, ThemeToggle, type NavGroup } from '../src';

// Javaslat 17: tömör oldalsáv (density="compact") csoportokkal – a partner app menüjének mintája.
const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>;
const HAZ = 'M4 20V9l8-5 8 5v11H4z', PONT = 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z', KOR = 'M12 3a9 9 0 100 18 9 9 0 000-18z';
const nav: NavGroup[] = [
  { items: [
    { href: '#fooldal', label: 'Főoldal', icon: ic(HAZ), current: true },
    { href: '#kereses', label: 'Keresés', icon: ic(KOR) },
    { href: '#analitika', label: 'Analitika', icon: ic(KOR) },
  ] },
  { label: 'Kínálatod', items: [
    { href: '#pontok', label: 'Térkép pontok', icon: ic(PONT) },
    { href: '#kuponok', label: 'Kuponok', icon: ic(KOR) },
    { href: '#bevaltas', label: 'Beváltás', icon: ic(KOR) },
    { href: '#esemenyek', label: 'Események', icon: ic(KOR) },
  ] },
  { label: 'Tudás és közösség', items: [
    { href: '#kozosseg', label: 'Közösség', icon: ic(KOR) },
    { href: '#edukacio', label: 'Edukáció', icon: ic(KOR) },
  ] },
  { label: 'Fiók és segítség', items: [
    { href: '#fiok', label: 'Profil & Fiók', icon: ic(KOR) },
    { href: '#elso', label: 'Első lépések', icon: ic(KOR) },
    { href: '#gyik', label: 'GYIK', icon: ic(KOR) },
  ] },
];

function Oldal() {
  return (
    <ThemeProvider>
      <AppShell collapsible collapseKey="tesztlap-tomor" density="compact"
        brand={<a href="#fooldal" className="bc-brand">beeco <span className="bc-brand-text">partner</span></a>}
        brandCompact={<a href="#fooldal" className="bc-brand" aria-label="beeco partner – főoldal">b</a>} nav={nav}
        account={<div className="bc-row" style={{ alignItems: 'center', gap: 'var(--bc-sp-1)' }}>
          <ShellAccount name="Minta Partner Kft." detail="partner" items={[{ label: 'Kijelentkezés' }]} />
          <ThemeToggle />
        </div>}>
        <div data-case="tomor">
          <PageHeader title="Főoldal" description="Tömör oldalsáv (density=&quot;compact&quot;), menücsoportokkal." />
        </div>
      </AppShell>
    </ThemeProvider>
  );
}

document.title = 'Tesztlap – Alkalmazás-váz (tömör, csoportos)';
createRoot(document.getElementById('root')!).render(<StrictMode><Oldal /></StrictMode>);
