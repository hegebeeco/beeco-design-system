import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, useState } from 'react';
import { AppShell, Button, PageHeader, ShellAccount, Toaster, type NavGroup } from '../src';

// Saját keret (nem a _keret.mount): az AppShell maga az oldal – benne van a <main>
const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>;
const LINKS: Array<[string, string, string, string]> = [
  ['Tartalom', 'partnerek', 'Partnerek', 'M4 20V8l8-4 8 4v12H4zM9 20v-6h6v6'],
  ['Tartalom', 'poi', 'POI-k', 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z'],
  ['Tartalom', 'kuponok', 'Kuponok', 'M3 8h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4V8z'],
  ['Naptár', 'naptar', 'Naptár nézet', 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4'],
  ['Naptár', 'esemenyek', 'Események és különleges napok – nagyon hosszú menüpont', 'M5 5h14v14H5z'],
  ['Elemzés', 'analitika', 'Analitika', 'M4 20V10M10 20V4M16 20v-8M22 20H2'],
];

function useHash() {
  const [h, setH] = useState(() => location.hash.slice(1) || 'partnerek');
  useEffect(() => { const f = () => setH(location.hash.slice(1) || 'partnerek'); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  return h;
}

function Oldal() {
  const cur = useHash();
  const nav: NavGroup[] = ['Tartalom', 'Naptár', 'Elemzés'].map((g) => ({ label: g, items: LINKS.filter((l) => l[0] === g).map(([, href, label, d]) => ({ href: `#${href}`, label, icon: ic(d), current: href === cur })) }));
  const cim = LINKS.find((l) => l[1] === cur)?.[2] ?? 'Partnerek';
  return (
    <AppShell brand={<a href="#partnerek" className="bc-brand">beeco <span className="bc-brand-text">admin</span></a>} brandCompact={<a href="#partnerek" className="bc-brand" aria-label="beeco admin – kezdőlap">b</a>}
      nav={nav} collapsible collapseKey="tesztlap"
      account={<ShellAccount name="Kovács Katalin Erzsébet (nagyon hosszú név)" detail="admin" items={[{ label: 'Profilom' }, 'separator', { label: 'Kijelentkezés', onSelect: () => { document.title = 'kijelentkezve'; } }]} />}>
      <Toaster />
      <div data-case="vaz">
        <PageHeader title={cim} description="Az oldal címe a tartalom tetején; asztalon nincs fejléc, a sáv becsukható (Javaslat 08)." breadcrumbs={[{ label: 'Admin', href: '#partnerek' }, { label: cim }]} actions={<Button>Új elem</Button>} />
        <p data-out="oldal">oldal: {cur}</p>
        {Array.from({ length: 12 }, (_, i) => <p key={i}>Tartalom {i + 1}. sora (mintaadat) – görgess, a sáv a helyén marad.</p>)}
      </div>
    </AppShell>
  );
}

document.title = 'Tesztlap – Alkalmazás-váz';
createRoot(document.getElementById('root')!).render(<StrictMode><Oldal /></StrictMode>);
