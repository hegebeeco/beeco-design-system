// PARTNER – Főoldal (/): a partner-irányítópult. Feliratok: beeco-partner/src/dashboard (2026-10-06). Minden szám és név MINTA.
import { Bee, BeeMoment, Button, StatTile } from '../../../react/src';
import { mount, ic, I } from './_keret';

const LEPESEK: Array<[string, boolean]> = [['Töltsd ki a cégnevet', true], ['Válassz főkategóriát', true], ['Tölts fel logót', true], ['Adj hozzá egy helyszínt a térképen', true], ['Hozd létre az első kupont', false], ['Hozd létre az első eseményt', false]];
const kesz = LEPESEK.filter(([, k]) => k).length;
const Hex = ({ on }: { on: boolean }) => <svg viewBox="0 0 28 32" className={`kp-hex${on ? ' is-kesz' : ''}`} aria-hidden="true"><polygon points="14,1 27,8.5 27,23.5 14,31 1,23.5 1,8.5" />{on && <path d="M8 16l4 4 8-8" />}</svg>;

function Oldal() {
  return (
    <div className="kp-partner">
      <div className="kp-koszonto" data-ds="2">
        <Bee szerep="hazigazda" size="s" />
        <div><h1 className="kp-h1">Szép napot, Példa Kávézó!</h1><p className="bc-muted">Legutóbb itt jártál: okt. 2. (4 napja)</p></div>
        <Button variant="ghost" size="sm">{ic('M4 5h16v11H8l-4 4z')} Kérdésed van?</Button>
      </div>
      <section className="bc-card" data-ds="3">
        <div className="kp-fej"><h2 className="bc-card-title">Az elmúlt 30 nap</h2><a className="bc-link" href="#">Részletek az analitikában</a></div>
        <div className="kp-csempek">
          <StatTile label="Beváltások" value={34} period="elmúlt 30 nap" delta={{ value: 12, unit: '%', compare: 'az előző két hónap havi átlagához' }} help="Hány kuponodat váltották be (mintaadat)." />
          <StatTile label="Egyedi beváltók" value={21} period="elmúlt 30 nap" help="Hány különböző felhasználó váltott be (mintaadat)." />
          <StatTile label="Kedvencek" value={57} period="összesen" help="Hányan tettek kedvencnek (mintaadat)." />
          <StatTile label="Megoldatlan hibajelzés" value={1} period="most" good="down" help="Felhasználói hibajelzések a profilodra (mintaadat)." />
        </div>
      </section>
      <section className="bc-card is-accent" data-ds="4"><BeeMoment inline szerep="bajnok" poen="Ez igazi méhtett!" sima="Már 30 beváltásnál jársz – a vásárlóid szeretik a kuponjaidat." /></section>
      <section className="kp-lepesek" data-ds="5">
        <div className="kp-fej"><h2 className="bc-card-title">Következő lépések</h2>
          <div className="kp-meter" role="progressbar" aria-valuemin={0} aria-valuemax={LEPESEK.length} aria-valuenow={kesz} aria-label={`Haladás: ${kesz} / ${LEPESEK.length} lépés kész`}>
            {LEPESEK.map(([, k], i) => <Hex key={i} on={k} />)}<span>{kesz}/{LEPESEK.length} kész</span></div></div>
        <ul className="kp-teendok-lista">{LEPESEK.filter(([, k]) => !k).map(([t]) => <li key={t}><span className="kp-kor" aria-hidden="true" />{t}<Button variant="secondary" size="sm">Mutasd</Button></li>)}</ul>
      </section>
      <nav aria-label="Gyorsműveletek" className="kp-gyors" data-ds="6">
        <Button variant="secondary" size="lg">{ic(I.ticket)} Új kupon</Button>
        <Button variant="secondary" size="lg">{ic(I.cal)} Új esemény</Button>
        <Button variant="secondary" size="lg">{ic(I.qr)} Beváltás</Button>
      </nav>
    </div>
  );
}
mount('partner', 'Főoldal', <Oldal />, [['.bc-sidebar', 1]]);
