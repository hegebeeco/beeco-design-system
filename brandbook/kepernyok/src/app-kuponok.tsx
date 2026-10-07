// MOBIL APP – Kuponfüzet + nyereményjáték. Forrás: mobile-app/lib/presentation/features/coupons/ (coupon_card.dart, coupon_button.dart),
// prize_draw/components/prize_draw_list_card.dart; szövegek: assets/translations/hu.json (coupon_*, landing_prizeDraw_*, 2026-10-07).
// A partnerek, a kedvezmények, a dátumok és a nyereményjáték MINTA.
import { Button, IconButton, ProgressBar, SearchBox, StatusBadge, Tag } from '../../../react/src';
import { telefon, Fejlec, ik, P } from './_telefon';

type Jegy = { partner: string; kedv: string; ervenyes: string; allapot?: 'bevaltva'; premium?: boolean; uj?: boolean };
const JEGYEK: Jegy[] = [
  { partner: 'Minta Kávézó', kedv: '−10%', ervenyes: 'Érvényes: okt. 31-ig', uj: true },
  { partner: 'Minta Szerviz', kedv: '−5%', ervenyes: 'Érvényes: okt. 20-ig', allapot: 'bevaltva' },
  { partner: 'Minta Bolt', kedv: '−15%', ervenyes: 'Érvényes: nov. 15-ig', premium: true },
];

/** Kuponjegy – az app saját mintája (Javaslat 23): a DS színe, kerete és árnyéka, az alakja az appé */
const KuponJegy = ({ j, ds }: { j: Jegy; ds?: number }) => (
  <article className={`kpm-jegy${j.allapot ? ' is-bevaltva' : ''}`} aria-label={`${j.partner}: ${j.kedv}`} data-ds={ds}>
    <div className="kpm-jegy-kep"><span className="kpm-jegy-kedv">{j.kedv}</span>{j.uj && <Tag className="kpm-jegy-cimke">új</Tag>}{j.premium && <Tag className="kpm-jegy-cimke">Prémium</Tag>}</div>
    <div className="kpm-jegy-test">
      <p className="kpm-jegy-partner">{j.partner}</p>
      <p className="kpm-minta">{j.ervenyes}</p>
      {j.allapot === 'bevaltva' && <StatusBadge tone="muted">Beváltva!</StatusBadge>}
      <Button variant="secondary" size="sm" block className="kpm-jegy-gomb">Megnézem</Button>
    </div>
  </article>
);

function Kuponok() {
  return (
    <>
      <div className="kpm-kereso-sor is-tartalom" data-ds="2"><SearchBox label="Milyen kupont keresel, Kaptárs?" /><IconButton aria-label="Szűrők" className="kpm-lebego">{ik(P.szuro)}</IconButton></div>
      <section aria-labelledby="kpm-kiemelt" className="kpm-szakasz-blokk">
        <div className="kpm-szakasz"><h2 id="kpm-kiemelt">Kiemelt kuponok (3)</h2><a href="#" className="kpm-link">Mutasd mind</a></div>
        <div className="kpm-gorgo-sor" tabIndex={0} role="region" aria-label="Kiemelt kuponok">{JEGYEK.map((j, i) => <KuponJegy key={j.partner} j={j} ds={i === 0 ? 3 : i === 1 ? 4 : undefined} />)}</div>
      </section>
      <section aria-labelledby="kpm-nyj" className="bc-card kpm-nyj" data-ds="5">
        <div className="kpm-nyj-kep"><StatusBadge tone="info" className="kpm-nyj-allapot">2/3 teljesítve</StatusBadge></div>
        <div className="kpm-nyj-test">
          <p className="kpm-minta">Nyereményjáték</p>
          <h2 id="kpm-nyj" className="kpm-h2">Minta havi nyereményjáték</h2>
          <p className="kpm-kicsi">Öntözz meg legalább 3 fát!</p>
          <ProgressBar value={2 / 3} label="Haladás: 2/3" />
          <Button block data-ds="6">Csatlakozom</Button>
        </div>
      </section>
      <p className="kpm-minta">Minta: a partnerek, a kedvezmények és a dátumok nem valós adatok.</p>
    </>
  );
}

telefon({
  cim: 'Kuponfüzet', aktiv: 'Kupon', navDs: 7, tartalom: <Kuponok />,
  fej: <Fejlec ds={1} cim="Kuponfüzet" bal={<IconButton aria-label="Nyereményjáték – Hogyan működik?">{ik(P.info)}</IconButton>} jobb={<IconButton aria-label="Kedvencek">{ik(P.szivek)}</IconButton>} />,
});
