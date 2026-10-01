import { useState } from 'react';
import { CompareMerge, type MergeFieldDef, type MergeRecord } from '../src';
import { Case, Grid, mount } from './_keret';

// 06a – POI-duplikátumok összefésülése (mintaadat)
const FIELDS: MergeFieldDef[] = [
  { key: 'name', label: 'Név', required: true }, { key: 'address', label: 'Cím' }, { key: 'category', label: 'Alkategória' },
  { key: 'lat', label: 'Szélesség' }, { key: 'lng', label: 'Hosszúság' }, { key: 'tags', label: 'Címkék' },
  { key: 'phone', label: 'Telefonszám' }, { key: 'website', label: 'Weboldal' }, { key: 'enabled', label: 'Aktív' },
];
const A: MergeRecord = { id: 'poi-1204', label: 'A · #1204', values: { name: 'Zöld Sarok Bolt', address: 'Budapest, Ráday u. 12.', category: 'Csomagolásmentes bolt', lat: 47.4871, lng: 19.0634, tags: ['bolt', 'zero waste'], phone: '', website: 'https://zoldsarok.hu', enabled: true } };
const B: MergeRecord = { id: 'poi-2210', label: 'B · #2210', values: { name: 'Zöld Sarok', address: 'Budapest, Ráday utca 12', category: 'Csomagolásmentes bolt', lat: 47.4871, lng: 19.0634, tags: ['zero waste', 'bolt'], phone: '+36 30 123 4567', website: null, enabled: true } };
const C: MergeRecord = { id: 'poi-3001', label: 'C · #3001', values: { name: '', address: 'Budapest, Ráday u. 12. (udvarban)', category: 'Bolt', lat: 47.48712, lng: 19.06341, tags: [], phone: '', website: 'https://www.zoldsarok.hu/nagyon-hosszu-aloldal-cim-ami-nem-fer-ki-egy-sorban-sehogy-sem', enabled: false } };

function Fesul({ records, survivor: withSurvivor, fail }: { records: MergeRecord[]; survivor?: boolean; fail?: boolean }) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [survivor, setSurvivor] = useState<string>();
  const [kesz, setKesz] = useState('');
  const [proba, setProba] = useState(0);
  const merge = async (res: Record<string, unknown>) => {
    await new Promise((r) => setTimeout(r, 400));
    if (fail && proba === 0) { setProba(1); throw new Error('a szerver nem válaszolt'); }
    setKesz(`összefésülve: ${String(res.name)} · ${String(res.phone)}`);
  };
  return <><CompareMerge records={records} fields={FIELDS} choices={choices} onChoicesChange={setChoices} onMerge={merge}
    {...(withSurvivor ? { survivor, onSurvivorChange: setSurvivor } : {})} /><p className="tl-out" data-out="kesz">{kesz || 'még nincs összefésülve'}</p></>;
}

function Oldal() {
  return (
    <>
      <Grid title="Összefésülés (CompareMerge)">
        <Case id="merge-ketto" title="Két rekord – a megmaradó is választandó" wide><Fesul records={[A, B]} survivor /></Case>
        <Case id="merge-harom" title="Három rekord, üres kötelező név, hosszú érték; első próbára szerverhiba" wide><Fesul records={[A, B, C]} fail /></Case>
        <Case id="merge-egyezik" title="Minden mező egyezik"><Fesul records={[A, { ...A, id: 'poi-9', label: 'B · #9' }]} /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – összefésülés', 'Duplikált rekordok egymás mellett: mezőnként rádióval választasz, az eltérés szöveggel is jelölve, élő eredmény-előnézet, megerősítés. Minden adat mintaadat.', <Oldal />);
