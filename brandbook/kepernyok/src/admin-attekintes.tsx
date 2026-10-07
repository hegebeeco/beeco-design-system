// ADMIN – Áttekintés (/attekintes): a beeco-admin kezdőlapja. Feliratok: beeco-admin/src/pages/Attekintes (2026-10-06). Minden szám MINTA.
import { Dashboard, StatusBadge, Button, type DashboardStat } from '../../../react/src';
import { mount } from './_keret';

const stats: DashboardStat[] = [
  { id: 'hiba', label: 'Nyitott hibajelentések', value: 7, unit: 'db', good: 'down', period: 'most', help: 'A még meg nem oldott, beérkezett hibajelentések száma (mintaadat).' },
  { id: 'esemeny', label: 'Események a héten', value: 12, unit: 'db', period: 'okt. 6. – okt. 12.', help: 'A héten kezdődő események (mintaadat).' },
  { id: 'kupon', label: 'Lejáró kupon-időzítések', value: 4, unit: 'db', period: '7 napon belül', help: 'A 7 napon belül lejáró kupon-időzítések (mintaadat).' },
  { id: 'jatek', label: 'Sorsolásra váró játékok', value: 2, unit: 'db', period: 'az utolsó 30 napban lezárultak', help: 'Lezárult, de még ki nem sorsolt játékok (mintaadat).' },
] as DashboardStat[];
const TEENDOK: Array<[string, 'warning' | 'info' | 'muted', string, string, string]> = [
  ['Ma', 'warning', '2 nyereményjáték sorsolásra vár', 'A nyertesek értesítése után zárul le a játék.', 'Sorsolás'],
  ['Ma', 'warning', '7 nyitott hibajelentés', 'A legrégebbi 9 napja vár – kezdd vele.', 'Hibajelentések'],
  ['A héten', 'info', '4 kupon-időzítés lejár 7 napon belül', 'Hosszabbíts, vagy szólj a partnernek.', 'Futó időzítések'],
  ['Rendszeres', 'muted', 'Figyelmet igénylő partnerek', 'Akiknél nincs aktív kupon, elavult a profil vagy csökken a beváltás – kit érdemes felhívni.', 'Partnerek'],
];
const Blokk = ({ cim, le, sorok }: { cim: string; le: string; sorok: Array<[string, string, string]> }) => (
  <section className="bc-card is-link attekintes-blokk">
    <h2 className="bc-card-title"><a className="bc-card-link" href="#">{cim}</a></h2>
    <p className="bc-muted">{le}</p>
    <ul className="bc-divided kp-lista">{sorok.map(([a, b, c]) => <li key={a}><strong>{a}</strong> <StatusBadge tone="muted">{b}</StatusBadge><br /><span className="bc-muted">{c}</span></li>)}</ul>
  </section>
);

mount('admin', 'Áttekintés', (
  <Dashboard title="Áttekintés" description="Mivel kell ma foglalkozni: nyitott hibajelentések, a hét eseményei, lejáró kupon-időzítések és a következő sorsolások. A kártya címe a teljes listára visz."
    stats={stats}
    charts={<>
      <section className="bc-card is-wide" data-ds="3">
        <h2 className="bc-card-title">Mai teendők (4)</h2>
        <ul className="bc-divided kp-teendok">{TEENDOK.map(([rang, tone, cim, mondat, gomb]) => (
          <li key={cim}><label className="bc-check"><input type="checkbox" aria-label={`Kész: ${cim}`} /></label>
            <StatusBadge tone={tone}>{rang}</StatusBadge>
            <div><strong>{cim}</strong><p className="bc-muted">{mondat}</p></div>
            <Button variant="secondary" size="sm">{gomb}</Button></li>))}</ul>
      </section>
      <div data-ds="4"><Blokk cim="Nyitott hibajelentések" le="A legrégebbi nyitottak – ezekkel érdemes kezdeni." sorok={[['#118 · rossz nyitvatartás', 'Adathiba', 'Beérkezett: szept. 27.'], ['#121 · hiányzó kép', 'Kép', 'Beérkezett: szept. 30.']]} /></div>
      <Blokk cim="A hét eseményei" le="Ezen a héten kezdődő események." sorok={[['Közösségi öntözés (minta)', 'Ma', '17:00 · Kert'], ['Ruhacsere-délután (minta)', 'csüt.', '16:00 · Közösség']]} />
    </>} />
), [['.bc-sidebar', 1], ['.bc-stats', 2]]);
