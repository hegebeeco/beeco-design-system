// Ikonikus képernyők közös kerete (brand book, Javaslat 22): a valódi DS AppShell a termék saját menüjével.
// A feliratok a termékek forrásából valók (2026-10-06); minden adat MINTA.
import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, type ReactNode } from 'react';
import { AppShell, Toaster, type NavGroup } from '../../../react/src';

export const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
export const I = {
  home: 'M3 11l9-7 9 7v9H5v-9', search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4', chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  pin: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z', ticket: 'M3 8h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4V8z', qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z',
  cal: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5', heart: 'M12 20s-7-4.5-7-10a4 4 0 017-2 4 4 0 017 2c0 5.5-7 10-7 10z', book: 'M4 5h7v14H4zM13 5h7v14h-7z',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0', info: 'M12 8h.01M11 12h1v5h1M12 3a9 9 0 100 18 9 9 0 000-18z', help: 'M9 9a3 3 0 115 2c-1 1-2 1-2 3M12 17h.01',
  shop: 'M4 20V8l8-4 8 4v12H4zM9 20v-6h6v6', bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 20h4', gift: 'M4 10h16v10H4zM12 10v10M3 7h18v3H3zM12 7c-2-4-6-3-4 0M12 7c2-4 6-3 4 0',
  users: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21a7 7 0 0114 0M17 11a3 3 0 100-6M22 21a6 6 0 00-5-6', bug: 'M8 8h8v10H8zM5 12h3M16 12h3M9 4l2 3M15 4l-2 3',
  leaf: 'M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l7-7', tag: 'M3 12l9-9h8v8l-9 9zM15 8h.01', sheet: 'M5 3h10l4 4v14H5zM9 12h6M9 16h6', video: 'M3 6h12v12H3zM15 10l6-3v10l-6-3',
  heal: 'M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7z',
};

type Termek = 'admin' | 'partner';
const MENU: Record<Termek, NavGroup[]> = {
  admin: [
    { items: [{ href: '#', label: 'Áttekintés', icon: ic(I.home) }] },
    { label: 'Tartalom', items: [['Partnerek', I.shop], ['POI-k', I.pin], ['Kuponok', I.ticket], ['Naptár', I.cal], ['Edukáció', I.book], ['Videók', I.video], ['Tartalom-egészség', I.heal]].map(([label, d]) => ({ href: '#', label, icon: ic(d) })) },
    { label: 'Közösség', items: [['Értesítések', I.bell], ['Nyereményjátékok', I.gift], ['Rajok', I.users]].map(([label, d]) => ({ href: '#', label, icon: ic(d) })) },
    { label: 'Eszközök', items: [['Hibajelentések (3)', I.bug], ['Analitika', I.chart], ['Hatás-riport', I.leaf], ['Címkék', I.tag], ['Excel import/export', I.sheet]].map(([label, d]) => ({ href: '#', label, icon: ic(d) })) },
  ] as NavGroup[],
  partner: [
    { items: [['Főoldal', I.home], ['Keresés', I.search], ['Analitika', I.chart]].map(([label, d]) => ({ href: '#', label, icon: ic(d) })) },
    { label: 'Kínálatod', items: [['Térkép pontok', I.pin], ['Kuponok', I.ticket], ['Beváltás', I.qr], ['Események', I.cal]].map(([label, d]) => ({ href: '#', label, icon: ic(d) })) },
    { label: 'Tudás és közösség', items: [['Közösség', I.heart], ['Edukáció', I.book]].map(([label, d]) => ({ href: '#', label, icon: ic(d) })) },
    { label: 'Fiók és segítség', items: [['Profil & Fiók', I.user], ['Első lépések', I.info], ['GYIK', I.help]].map(([label, d]) => ({ href: '#', label, icon: ic(d) })) },
  ] as NavGroup[],
};

/** A brand book DS-jelölései: a DS-elemekre utólag kerül data-ds (a jelölés-gomb mutatja) */
function Jelolo({ jelek }: { jelek: Array<[string, number]> }) {
  useEffect(() => { const t = setTimeout(() => jelek.forEach(([sel, n]) => { const el = document.querySelector(sel); if (el) { el.setAttribute('data-ds', String(n)); if (/sidebar|topbar/.test(sel)) el.classList.add('bb-poz'); } }), 300); return () => clearTimeout(t); }, [jelek]);
  return null;
}

export function mount(termek: Termek, aktiv: string, oldal: ReactNode, jelek: Array<[string, number]> = []) {
  const nav = MENU[termek].map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, current: it.label === aktiv })) }));
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppShell brand={<a href="#" className="bc-brand"><img src="../ds/web/assets/brand/logo.webp" alt="beeco" width="60" height="37" /><span className="bc-brand-text">{termek}</span></a>}
        nav={nav} density="compact" pattern="honeycomb" season="auto" collapsible={false}>
        <Toaster />
        {oldal}
        <Jelolo jelek={jelek} />
      </AppShell>
    </StrictMode>,
  );
}
