import { createRoot } from 'react-dom/client';
import { StrictMode, useEffect, useMemo, useState } from 'react';
import { AppShell, Button, CommandPalette, commandHotkeyLabel, PageHeader, useShellNav, type CommandGroup, type CommandItem, type NavGroup } from '../src';

// Javaslat 20: ⌘K / Ctrl+K kereső-paletta + useShellNav (a telefonos fiókban álló kereső-gomb előbb bezárja a fiókot).
// MINTAADAT – a nevek kitaláltak. Kipróbálható: „lassu” → töltés; „hiba” → hibasáv; „sok” → 1200 találat; „xyz” → nincs találat.
const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>;
const HAZ = 'M4 20V9l8-5 8 5v11H4z', PONT = 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z', JEGY = 'M3 8h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4V8z';
const nav: NavGroup[] = [{ items: [{ href: '#attekintes', label: 'Áttekintés', icon: ic(HAZ), current: true }, { href: '#partnerek', label: 'Partnerek', icon: ic(HAZ) }, { href: '#poi', label: 'POI-k', icon: ic(PONT) }] }];

const PARTNEREK = ['Méhes Kávézó', 'Méhész Bolt', 'Zöld Sarok Csomagolásmentes Bolt és Javítókávézó a belvárosban, nagyon hosszú névvel', 'Javító Kávézó'];
const POIK = ['Méhecske-kert', 'Komposztáló pont', 'Ivókút – Ráday u.'];
const LEGUTOBBI: CommandGroup = { id: 'legutobbi', label: 'Legutóbb megnyitott', items: [{ id: 'l1', label: 'Méhes Kávézó', description: 'Partner', icon: ic(HAZ) }, { id: 'l2', label: 'Ivókút – Ráday u.', description: 'POI', icon: ic(PONT) }] };
const MIN = 2;

function keres(q: string): CommandGroup[] {
  const n = q.toLocaleLowerCase('hu');
  if (n.includes('sok')) return [{ id: 'sok', label: 'Kuponsablonok', items: Array.from({ length: 1200 }, (_, i) => ({ id: `k${i}`, label: `Sok kupon ${i + 1}.`, description: 'Kuponsablon', icon: ic(JEGY) })) }];
  return [
    { id: 'partner', label: 'Partnerek', items: PARTNEREK.filter((x) => x.toLocaleLowerCase('hu').includes(n)).map((x, i) => ({ id: `p${i}`, label: x, description: 'Partner', icon: ic(HAZ), disabled: x === 'Méhész Bolt' })) },
    { id: 'poi', label: 'POI-k', items: POIK.filter((x) => x.toLocaleLowerCase('hu').includes(n)).map((x, i) => ({ id: `poi${i}`, label: x, description: 'POI', icon: ic(PONT) })) },
  ];
}

function KeresoGomb({ onOpen }: { onOpen: () => void }) {
  const { closeNav, narrow, navOpen, collapsed, inShell } = useShellNav();
  return (
    <div className="bc-stack" style={{ gap: 'var(--bc-sp-1)' }}>
      <Button variant="secondary" block aria-keyshortcuts="Meta+K Control+K" onClick={() => { closeNav(); onOpen(); }}
        icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>}>
        Keresés <kbd className="bc-kbd" aria-hidden="true">{commandHotkeyLabel()}</kbd>
      </Button>
      <span className="tl-out" data-out="shell">{inShell ? 'keretben' : 'keret nélkül'} · {narrow ? 'keskeny' : 'széles'} · fiók {navOpen ? 'nyitva' : 'zárva'} · {collapsed ? 'becsukva' : 'kinyitva'}</span>
    </div>
  );
}

function Oldal() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [valasztott, setValasztott] = useState('–');
  const [lassu, setLassu] = useState(false);
  const [ujra, setUjra] = useState(0);
  const short = q.trim().length < MIN;
  const hibas = !short && q.toLocaleLowerCase('hu').includes('hiba');
  useEffect(() => { if (!q.includes('lassu')) { setLassu(false); return; } setLassu(true); const t = setTimeout(() => setLassu(false), 1500); return () => clearTimeout(t); }, [q, ujra]);
  useEffect(() => { if (!open) setQ(''); }, [open]);
  const groups = useMemo(() => (short ? [LEGUTOBBI] : hibas || lassu ? [] : keres(q.trim())), [short, hibas, lassu, q]);
  const pick = (it: CommandItem, o: { newTab: boolean }) => setValasztott(`${it.label}${o.newTab ? ' (új lapon)' : ''}`);
  return (
    <AppShell collapsible collapseKey="tesztlap-paletta" brand={<a href="#attekintes" className="bc-brand">beeco <span className="bc-brand-text">admin</span></a>}
      nav={nav} account={<KeresoGomb onOpen={() => setOpen(true)} />}>
      <div data-case="paletta">
        <PageHeader title="Kereső-paletta" description={`Nyisd meg: ${commandHotkeyLabel()}, vagy a menü alján a Keresés gomb. Mintaadat.`}
          actions={<Button onClick={() => setOpen(true)} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>}>Keresés megnyitása</Button>} />
        <p className="tl-out" data-out="valasztott">választott: {valasztott}</p>
        <CommandPalette open={open} onOpenChange={setOpen} query={q} onQueryChange={setQ} groups={groups} onSelect={pick} minChars={MIN}
          description="Partner és POI egy helyen. Nyilakkal léptetsz, Enterrel nyitod meg."
          status={hibas ? 'error' : lassu ? 'loading' : 'ready'} error="Nem sikerült keresni a partnerek között – várj pár másodpercet, és próbáld újra."
          onRetry={() => setUjra((n) => n + 1)}
          hint={short && q.trim() ? `Írj még legalább ${MIN - q.trim().length} betűt a kereséshez.` : `Írj legalább ${MIN} betűt.`} />
      </div>
    </AppShell>
  );
}

document.title = 'Tesztlap – Kereső-paletta';
createRoot(document.getElementById('root')!).render(<StrictMode><Oldal /></StrictMode>);
