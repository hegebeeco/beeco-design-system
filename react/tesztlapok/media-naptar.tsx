import { useState } from 'react';
import { MonthCalendar, OpeningHoursEditor, type CalEvent, type CalKind, type OpeningHours } from '../src/media';
import { Case, Grid, mount } from './_keret';

// Mintaadat: 2026. október tartalmai (címek kitaláltak, csak a megjelenítés próbájára)
const EV: CalEvent[] = [
  { id: 'e1', date: '2026-10-01', title: 'Zene világnapja', kind: 'special', yearly: true },
  { id: 'e2', date: '2026-10-01', title: 'Mi az a lábnyom?', kind: 'education' },
  { id: 'e3', date: '2026-10-02', title: 'Kertnyitó', kind: 'event' },
  { id: 'e4', date: '2026-10-04', title: 'Állatok világnapja', kind: 'special', yearly: true },
  ...['Méhész-nap', 'Komposztálás alapjai', 'Piaci séta', 'Mézkóstoló', 'Városi biciklitúra'].map((t, i) => ({ id: `e5${i}`, date: '2026-10-04', title: t, kind: (['event', 'education', 'event', 'event', 'education'] as CalKind[])[i] })),
  { id: 'e6', date: '2026-09-28', end: '2026-10-03', title: 'Fenntarthatósági hét (több napos, hónaphatáron át)', kind: 'event' },
  { id: 'e7', date: '2026-10-16', title: 'Élelmezési világnap – nagyon hosszú cím, amely biztosan nem fér el a cellában', kind: 'special', yearly: true },
  { id: 'e8', date: '2026-10-22', title: 'Iskolai kerti óra', kind: 'education' },
];

function Naptar({ id, events = EV, ...p }: { id: string; events?: CalEvent[] } & Partial<Parameters<typeof MonthCalendar>[0]>) {
  const [hidden, setHidden] = useState<CalKind[]>([]);
  const [nap, setNap] = useState('–');
  const [honap, setHonap] = useState('2026-10-01');
  return <><MonthCalendar events={events} initialDate="2026-10-01" hidden={hidden} onHiddenChange={setHidden}
    onSelectDay={(iso, list) => setNap(`${iso} (${list.length})`)} onMonthChange={setHonap} {...p} />
    <p className="tl-out" data-out={id}>nap: {nap} · hónap: {honap} · rejtve: {hidden.join(',') || 'semmi'}</p></>;
}

const WEEK: OpeningHours = {
  Mon: { open: true, from: '08:00', to: '18:00' }, Tue: { open: true, from: '08:00', to: '18:00' }, Wed: { open: true, from: '10:00', to: '18:00' },
  Thu: { open: true, from: '08:00', to: '18:00' }, Fri: { open: true, from: '08:00', to: '16:00' }, Sat: { open: true, from: '09:00', to: '13:00' }, Sun: { open: false, from: null, to: null },
};
const BAD: OpeningHours = { ...WEEK, Tue: { open: true, from: '08:00', to: '07:00' }, Wed: { open: true, from: '10:00', to: '10:00' }, Thu: { open: true, from: '08:00', to: null } };
const HHELP = 'Az appban a hely oldalán és a térképes kártyán látszik („Most nyitva”). Naponta egy sávot adhatsz meg; ünnepnapokat most még nem.';

function Hours({ id, start, ...p }: { id: string; start: OpeningHours; disabled?: boolean; readOnly?: boolean }) {
  const [v, setV] = useState(start);
  return <><OpeningHoursEditor help={HHELP} value={v} onChange={setV} {...p} />
    <p className="tl-out" data-out={id}>{Object.entries(v).map(([k, d]) => `${k} ${d.open ? `${d.from}-${d.to}` : 'zárva'}`).join(' · ')}</p></>;
}

function Oldal() {
  return (
    <>
      <Grid title="Havi naptár (7A)">
        <Case id="naptar" title="2026. október – sok tartalom egy napon, több napos, ismétlődő, hosszú cím, szűrő" wide><Naptar id="naptar" /></Case>
        <Case id="naptar-keskeny" title="Keskeny hely (telefon): pöttyös hónap + a nap listája"><div style={{ maxWidth: 360 }}><Naptar id="keskeny" /></div></Case>
        <Case id="naptar-ketfajta" title="Csak két fajta (kinds), saját feliratokkal – pl. partner: esemény + kupon-időzítés">
          <Naptar id="ketfajta" kinds={['event', 'education']} labels={{ event: 'Esemény', education: 'Kupon-időzítés' }} events={EV.filter((e) => e.kind !== 'special')} />
        </Case>
        <Case id="naptar-ures" title="Üres hónap"><Naptar id="ures" events={[]} /></Case>
        <Case id="naptar-tolt" title="Töltés"><Naptar id="tolt" loading /></Case>
        <Case id="naptar-hiba" title="Hiba, újrapróbálással"><Naptar id="hiba" error="Nem sikerült betölteni a hónap tartalmát – ellenőrizd a kapcsolatot." onRetry={() => undefined} /></Case>
      </Grid>
      <Grid title="Nyitvatartás (8A) – napi egy sáv">
        <Case id="nyitva" title="Szokásos hét"><Hours id="nyitva" start={WEEK} /></Case>
        <Case id="nyitva-hiba" title="Hibák: zárás a nyitás előtt, ugyanaz, hiányzó idő"><Hours id="hiba" start={BAD} /></Case>
        <Case id="nyitva-tiltott" title="Tiltott"><Hours id="tiltott" start={WEEK} disabled /></Case>
        <Case id="nyitva-olvas" title="Csak olvasható"><Hours id="olvas" start={WEEK} readOnly /></Case>
      </Grid>
    </>
  );
}
mount('Média – naptár és nyitvatartás', 'Havi naptár hétfővel (szerepszín + csík + jelmagyarázat, billentyűzet, telefonon pöttyös hónap) és nyitvatartás-szerkesztő. Minden tartalom mintaadat.', <Oldal />);
