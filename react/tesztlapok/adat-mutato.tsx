import { HeatLegend, InfoCard, InfoGrid, Sparkline, StatTile } from '../src';
import { trend } from './_adat-minta';
import { Case, Grid, mount } from './_keret';

const S = 'Mintaadat a tesztlaphoz. Élesben: mit számol a csempe, és honnan jön az adat.';
const F = 'beeco admin, mintaadat · 2026. 10. 01. 09:12';

function Oldal() {
  return (
    <>
      <Grid title="Statisztika-csempe (StatTile) – 3A · mintaadat">
        <Case id="kpi-jo" title="Több = jó (good=up), elemszám, forrás, sparkline">
          <StatTile label="Beváltott kuponok" help={S} value={1284} unit="db" period="2026. 07–09." n={311} nLabel="felhasználó" source={F} trend={trend}
            delta={{ value: 12, unit: '%', compare: 'az előző 30 naphoz' }} />
        </Case>
        <Case id="kpi-rossz" title="Több = rossz (good=down): hibajegy">
          <StatTile label="Nyitott hibajegyek" help={S} value={37} unit="db" good="down" delta={{ value: 9, unit: 'db', compare: 'az előző héthez' }} period="2026. 09. 22–28." />
        </Case>
        <Case id="kpi-semleges" title="Semleges irány, csökkenés">
          <StatTile label="Átlagos munkamenet" help={S} value={4.5} decimals={1} unit="perc" good="none" delta={{ value: -0.5, decimals: 1, unit: 'perc', compare: 'az előző hónaphoz' }} />
        </Case>
        <Case id="kpi-rejtve" title="Rejtett érték (1–4 érintett)"><StatTile label="Új rajok" help={S} value={3} n={3} nLabel="érintett" period="2026. 09." /></Case>
        <Case id="kpi-nincs" title="Nincs adat (—)"><StatTile label="Öntözések" help={S} value={null} unit="alkalom" period="2026. 09." /></Case>
        <Case id="kpi-uj" title="Nincs előző időszak – „új”"><StatTile label="Nyereményjáték-résztvevők" help={S} value={58} unit="fő" delta="new" /></Case>
        <Case id="kpi-nulla" title="Előző érték 0 – a % nem értelmezhető"><StatTile label="Edukatív anyagok" help={S} value={37} unit="db" delta={{ value: 37, unit: '%', compare: 'az előző hónaphoz', fromZero: true }} /></Case>
        <Case id="kpi-becsles" title="Becsült érték (~ + becslés)"><StatTile label="Megtakarított CO₂e" help={S} value={1250.5} decimals={1} unit="kg" estimate source={F} /></Case>
        <Case id="kpi-negativ" title="0 és negatív érték, változás nélkül">
          <div className="tl-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))' }}>
            <StatTile label="Lemondások" help={S} value={0} unit="db" delta={{ value: 0, unit: 'db', compare: 'az előző héthez' }} />
            <StatTile label="Egyenleg" help={S} value={-12} unit="fő" />
          </div>
        </Case>
        <Case id="kpi-nagy" title="Nagyon nagy szám 180 px széles csempén">
          <div style={{ width: 180, maxWidth: '100%' }}><StatTile label="Összes megjelenés" help={S} value={1234567} unit="db" /></div>
        </Case>
        <Case id="kpi-hosszu" title="Hosszú címke két sorban">
          <StatTile label="A partnerek által a nyári kampányban kiosztott és be is váltott kuponok" help={S} value={402} unit="db" />
        </Case>
        <Case id="kpi-tolt" title="Töltés (csontváz a szám helyén)"><StatTile label="Beváltott kuponok" help={S} value={null} loading /></Case>
        <Case id="kpi-hiba" title="Hiba – Újrapróbálás"><StatTile label="Beváltott kuponok" help={S} value={null} error="Nem sikerült betölteni." onRetry={() => undefined} /></Case>
      </Grid>
      <Grid title="Adatlap (InfoCard, InfoGrid) – részletoldalak">
        <Case id="info" title="Címke–érték, üres érték, hosszú szöveg, link" wide>
          <InfoGrid>
            <InfoCard title="Alapadatok" rows={[['Név', 'Föld napja'], ['Dátum', 'április 22.'], ['Leírás', 'Hosszú, többsoros leírás.\nMásodik sor – a sortörés megmarad, és a nagyon-nagyon-hosszú-szó-is-tördelődik-a-kartya-szelen-belul-ahelyett-hogy-kilogna.'], ['Link', null]]} />
            <InfoCard title="Elérhetőség" rows={[{ label: 'Weboldal', value: <a href="https://beeco.hu">beeco.hu</a> }, { label: 'Telefon', value: '' }]} emptyText="nincs megadva" footer={<p className="bc-help">Szerkeszteni a Szerkesztés oldalon tudsz.</p>} />
          </InfoGrid>
        </Case>
      </Grid>
      <Grid title="Sparkline és hőtérkép-jelmagyarázat">
        <Case id="spark" title="Sparkline önállóan (névvel), hiánnyal"><Sparkline values={trend} label="Beváltások 12 hét alatt, emelkedő (mintaadat)" /></Case>
        <Case id="heat" title="Hőtérkép-jelmagyarázat (egyirányú skála)"><HeatLegend label="Aktív felhasználók" unit="fő / km²" thresholds={[20, 40, 60, 80]} /></Case>
        <Case id="heat-cb" title="Hőtérkép-jelmagyarázat – színtévesztő-barát">
          <div data-cb="true"><HeatLegend label="Aktív felhasználók" unit="fő / km²" thresholds={[20, 40, 60, 80]} /></div>
        </Case>
      </Grid>
    </>
  );
}
mount('Mutatók', 'StatTile (KPI), Sparkline, HeatLegend, InfoCard – minden állapot és szélső eset. Minden szám mintaadat.', <Oldal />);
