// Tesztlap – DetailPage (06c): egy POI részletei mintaadattal; állapotok: ?allapot=toltes|hiba|tiltott|hosszu
import { useState } from 'react';
import { StatTile, Tag, DetailPage, notify, type DetailAction, type TabItem } from '../src';
import { allapot, mountSablon, wait } from './_sablon-keret';

const ALLAPOTOK: Array<[string, string]> = [['toltes', 'Töltés'], ['hiba', 'Hiba'], ['tiltott', 'Nincs jogosultság'], ['hosszu', 'Hosszú cím, sok fül és gomb']];
const ic = (d: string) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d} /></svg>;
const log = (t: string) => { const o = document.querySelector('[data-out="log"]'); if (o) o.textContent = t; };

const TEVEKENYSEG = [
  ['2026. 09. 28. 14:05', 'Kovács Kata', 'módosította a nyitvatartást'],
  ['2026. 09. 21. 09:40', 'Szabó Bence', 'feltöltött 2 képet'],
  ['2026. 09. 02. 16:12', 'Kovács Kata', 'létrehozta a POI-t'],
];

function Oldal() {
  const a = allapot();
  const hosszu = a === 'hosszu';
  const [hiba, setHiba] = useState(a === 'hiba');
  const [torolve, setTorolve] = useState(false);
  const nev = hosszu ? 'Csomagolásmentes Kamra és Közösségi Tér a Méhesdi Főtér Sarkán, udvari bejárattal (régi nevén: Zöld Sarok Kávézó)' : 'Zöld Sarok Kávézó';

  const actions: DetailAction[] = [
    { label: 'Szerkesztés', icon: ic('M4 20h4L19 9l-4-4L4 16v4z'), onSelect: () => { location.href = 'sablon-szerkeszto.html'; } },
    { label: 'Duplikálás', icon: ic('M8 8h12v12H8zM4 16V4h12'), onSelect: () => { notify.success('Mintaadat: a másolat elkészült.'); log('duplikálva'); } },
    { label: 'Link másolása', icon: ic('M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1'), onSelect: () => { notify.info('Mintaadat: a link a vágólapon.'); log('link'); } },
    ...(hosszu ? [
      { label: 'Áthelyezés másik városba', icon: ic('M5 12h14M13 6l6 6-6 6'), onSelect: () => log('áthelyezés') },
      { label: 'Exportálás táblázatba', icon: ic('M12 4v12M6 10l6 6 6-6M4 20h16'), onSelect: () => log('export') },
      { label: 'Közzététel az appban', icon: ic('M5 12l5 5L20 7'), onSelect: () => log('közzététel'), disabled: true, disabledReason: 'Előbb tölts fel legalább egy képet.' },
    ] : []),
    { label: 'Archiválás', icon: ic('M4 7h16v13H4zM2 3h20v4H2zM10 12h4'), onSelect: () => { notify.success('Mintaadat: archiválva.', { action: { label: 'Visszavonás', onClick: () => log('archiválás visszavonva') } }); log('archiválva'); } },
    {
      label: 'Törlés', icon: ic('M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13'), danger: true,
      confirm: { title: `Törlöd: ${nev}?`, body: 'A POI eltűnik az appból, a képei és a 3 kuponja is törlődik. Ezt nem lehet visszavonni.', confirmLabel: 'Törlés' },
      onSelect: async () => { await wait(500); setTorolve(true); log('törölve'); notify.success('A POI törölve.'); },
    },
  ];

  const tabs: TabItem[] = [
    { value: 'attekintes', label: 'Áttekintés', content: <p>A kávézó a Méhesdi főtéren van; saját pohárral 10% kedvezmény jár (mintaadat).</p> },
    { value: 'kepek', label: 'Képek', count: 4, content: <p>4 kép (mintaadat) – itt a Gallery komponens állna.</p> },
    { value: 'nyitvatartas', label: 'Nyitvatartás', content: <p>H–P 7:00–18:00, Szo 8:00–13:00 (mintaadat).</p> },
    { value: 'kuponok', label: 'Kuponok', count: 3, content: <p>3 aktív kupon (mintaadat).</p> },
    ...(hosszu ? ['Események', 'Edukatív anyagok', 'Értékelések', 'Adathibák', 'Jogosultságok', 'Nagyon hosszú nevű fül a változások teljes előzményével']
      .map((l, i) => ({ value: `x${i}`, label: l, content: <p>{l} (mintaadat).</p> })) : []),
  ];

  const status = a === 'toltes' ? 'loading' : a === 'tiltott' ? 'forbidden' : hiba ? 'error' : 'ready';
  return (
    <>
      <DetailPage title={nev} subject={nev} status={status} what="a POI adatait" onRetry={() => setHiba(false)}
        description={torolve ? 'Ez a POI törölve (mintaadat).' : 'Vendéglátás · Méhesd, Fő utca 3.'}
        breadcrumbs={[{ label: 'Admin', href: 'sablon-lista.html' }, { label: 'POI-k', href: 'sablon-lista.html' }, { label: nev }]}
        actions={torolve ? [] : actions}
        summary={
          <>
          <div className="bc-row" style={{ alignItems: 'flex-start' }}>
            <span className={torolve ? 'bc-badge is-danger' : 'bc-badge is-success'}>{torolve ? 'törölve' : 'aktív'}</span>
            <Tag>mintaadat</Tag>
            <p style={{ margin: 0, flex: '1 1 240px' }}>Kategória: Vendéglátás · Címkék: bio, helyi termék · 4 kép · 3 kupon</p>
          </div>
          <div className="bc-stats" data-osszegzes-csempek>
            <StatTile label="Beváltások" help="Mintaadat: a POI kuponjainak beváltásai." value={128} unit="db" />
            <StatTile label="Frissesség" help="Mintaadat: szöveges érték." value={null} text="Frissítésre vár" />
          </div>
          </>
        }
        tabs={tabs} tabsLabel="A POI adatai"
        side={<>
          <section className="bc-card">
            <h2 className="bc-card-title">Adatok</h2>
            <dl className="bc-stack" style={{ margin: 0 }}>
              <div><dt className="bc-muted">Azonosító</dt><dd style={{ margin: 0 }}>poi-1042</dd></div>
              <div><dt className="bc-muted">Létrehozva</dt><dd style={{ margin: 0 }}>2026. 09. 02.</dd></div>
              <div><dt className="bc-muted">Utoljára módosította</dt><dd style={{ margin: 0 }}>Kovács Kata, 2026. 09. 28.</dd></div>
            </dl>
          </section>
          <section className="bc-card">
            <h2 className="bc-card-title">Tevékenység</h2>
            <ul className="bc-stack" style={{ margin: 0, paddingLeft: '1.1em' }}>
              {TEVEKENYSEG.map(([mikor, ki, mit]) => <li key={mikor}><strong>{ki}</strong> {mit}<br /><span className="bc-muted">{mikor}</span></li>)}
            </ul>
          </section>
        </>} />
      <p className="tl-out" data-out="log" aria-live="polite" />
    </>
  );
}

mountSablon('sablon-reszletek', 'Részletek-oldal (DetailPage)', ALLAPOTOK, <Oldal />);
