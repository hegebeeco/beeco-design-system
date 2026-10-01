import { useState } from 'react';
import { Timeline, type ActivityItem } from '../src';
import { Case, Grid, mount } from './_keret';

// 06a – előzmények: ki · mit · mikor, napok szerint, mezőszintű különbség (mintaadat; a „ma” rögzítve: 2026. 10. 01.)
const NOW = new Date('2026-10-01T12:00:00');
const at = (d: string) => new Date(d).toISOString();
const nevek = ['Kovács Anna', 'Szabó Péter', 'Rendszer', 'Nagy Eszter'];

const alap: ActivityItem[] = [
  { id: 'a1', at: at('2026-10-01T10:42:00'), who: 'Kovács Anna', action: 'módosította', target: 'a Zöld Sarok Bolt adatlapját', tone: 'info',
    changes: [{ field: 'Telefonszám', before: '+36 30 123 4567', after: '+36 70 555 1234' }, { field: 'Leírás', before: '', after: 'Csomagolásmentes bolt a belvárosban.' }, { field: 'Weboldal', before: 'http://zoldsarok.hu', after: null }] },
  { id: 'a2', at: at('2026-10-01T09:05:00'), who: 'Rendszer', action: 'jóváhagyta', target: 'az „Őszi 10%” kupont', tone: 'success' },
  { id: 'a3', at: at('2026-09-30T16:20:00'), who: 'Szabó Péter', action: 'elutasította', target: 'a Méhes Piac POI-t – indok: hibás koordináta', tone: 'danger' },
  { id: 'a4', at: at('2026-09-30T16:20:00'), who: 'Szabó Péter', action: 'megnyitotta', target: 'a Méhes Piac POI-t' },
  { id: 'a5', at: at('2026-09-28T08:00:00'), who: 'Nagy Eszter', action: 'létrehozta', target: 'a Javító Kávézó partnert', tone: 'success',
    changes: [{ field: 'Név', before: null, after: 'Javító Kávézó' }] },
];
const hosszu: ActivityItem[] = [{ id: 'h1', at: at('2026-10-01T11:00:00'), who: 'Kovács Anna Mária Erzsébet', action: 'módosította', target: 'a Csomagolásmentesélelmiszerboltésjavítókávézóegyhelyenszóköznélkülihosszúszó adatlapját',
  changes: [{ field: 'Leírás', before: 'Rövid.', after: 'Nagyon hosszú leírás '.repeat(12) + '<b>nem félkövér</b> 🐝' }] }];
const sok: ActivityItem[] = Array.from({ length: 23 }, (_, i) => ({ id: `s${i}`, at: new Date(NOW.getTime() - i * 5 * 3600_000).toISOString(),
  who: nevek[i % 4], action: i % 3 ? 'módosította' : 'jóváhagyta', target: `a(z) ${i + 1}. kupont`, tone: i % 3 ? undefined : 'success' as const }));

function Szerver() {
  const [items, setItems] = useState(sok.slice(0, 5));
  const [busy, setBusy] = useState(false);
  const more = async () => { setBusy(true); await new Promise((r) => setTimeout(r, 400)); setItems((x) => sok.slice(0, x.length + 5)); setBusy(false); };
  return <Timeline items={items} now={NOW} onLoadMore={more} hasMore={items.length < sok.length} loadingMore={busy} label="Kupon-előzmények (szerverről)" />;
}

function Oldal() {
  return (
    <>
      <Grid title="Előzmények (Timeline / ActivityLog)">
        <Case id="tl-alap" title="Ma, tegnap, régebbi – különbséggel" wide><Timeline items={alap} now={NOW} label="Partner-aktivitás" /></Case>
        <Case id="tl-sok" title="Sok bejegyzés – „Még …” (helyi)"><Timeline items={sok} now={NOW} pageSize={10} label="Kupon-előzmények" /></Case>
        <Case id="tl-szerver" title="Szerveroldali folytatás"><Szerver /></Case>
        <Case id="tl-hosszu" title="Hosszú szöveg, HTML-szerű szöveg, emoji"><Timeline items={hosszu} now={NOW} label="Hosszú bejegyzés" /></Case>
        <Case id="tl-ures" title="Üres"><Timeline items={[]} now={NOW} /></Case>
        <Case id="tl-toltes" title="Töltés"><Timeline items={[]} status="loading" /></Case>
        <Case id="tl-hiba" title="Hiba – újrapróbálás"><Timeline items={[]} status="error" onRetry={() => undefined} /></Case>
        <Case id="tl-jog" title="Nincs jogosultság"><Timeline items={[]} status="forbidden" /></Case>
        <Case id="tl-ismeretlen" title="Ismeretlen időpont"><Timeline items={[{ id: 'x', at: 'nem dátum', who: 'Rendszer', action: 'importálta', target: 'a régi adatokat' }]} now={NOW} label="Régi import" /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – előzmények', 'Ki, mit, mikor – napok szerint („Ma”, „Tegnap”, dátum), mezőszintű különbséggel (előtte → utána). Minden név és adat mintaadat.', <Oldal />);
