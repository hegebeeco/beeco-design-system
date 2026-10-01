// Az oldalsablon-tesztlapok közös kerete: valódi admin-váz (AppShell) + „Mintaállapotok” menücsoport (?allapot=…).
// MINTAADAT – nem valódi beeco-adat; a nevek, számok kitaláltak, csak a sablonok kipróbálására.
import { createRoot } from 'react-dom/client';
import { StrictMode, type ReactNode } from 'react';
import { AppShell, Toaster, type NavGroup } from '../src';

const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>;
const LAPOK: Array<[string, string, string]> = [
  ['sablon-lista', 'Partnerek', 'M4 20V8l8-4 8 4v12H4zM9 20v-6h6v6'],
  ['sablon-reszletek', 'POI részletei', 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z'],
  ['sablon-szerkeszto', 'Kupon szerkesztése', 'M3 8h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4V8z'],
  ['sablon-iranyitopult', 'Analitika', 'M4 20V10M10 20V4M16 20v-8M22 20H2'],
];

/** A mostani mintaállapot az URL-ből (?allapot=ures) – alap: 'kesz' */
export const allapot = () => new URLSearchParams(location.search).get('allapot') ?? 'kesz';

export function mountSablon(lap: string, title: string, states: Array<[string, string]>, page: ReactNode) {
  document.title = `Tesztlap – ${title}`;
  const cur = allapot();
  const nav: NavGroup[] = [
    { label: 'Sablonok', items: LAPOK.map(([href, label, d]) => ({ href: `${href}.html`, label, icon: ic(d), current: href === lap && cur === 'kesz' })) },
    { label: 'Mintaállapotok', items: states.map(([id, label]) => ({ href: `${lap}.html?allapot=${id}`, label, current: id === cur })) },
  ];
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppShell brand={<a href="sablon-lista.html" className="bc-brand">beeco admin</a>} nav={nav}
        topbar={<span className="bc-badge is-muted">mintaadat</span>}>
        <Toaster />
        <div data-case={`${lap}-${cur}`}>{page}</div>
      </AppShell>
    </StrictMode>,
  );
}

/** Kitalált késleltetés a „szerver” válaszához */
export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
