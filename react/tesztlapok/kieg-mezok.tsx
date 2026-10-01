import { useState } from 'react';
import { Button, CopyButton, DownloadButton, formatHuPhone, PhoneField, RangeSlider, Slider, type PhoneFieldProps, type PhoneInfo } from '../src';
import { Case, Grid, mount } from './_keret';

// 06a – mezők és gombok: telefonszám, csúszka, másolás, letöltés – minden állapot és szélső eset (mintaadat)
const H_TEL = 'Ezen a számon éri el a partnert az ügyfélszolgálat; az appban nem látszik. Mobil vagy vezetékes is lehet, pl. 30 123 4567.';

function Tel({ id, init = '', ...p }: { id: string; init?: string } & Partial<PhoneFieldProps>) {
  const [v, setV] = useState(init);
  const [info, setInfo] = useState<PhoneInfo>();
  return (
    <>
      <PhoneField label="Telefonszám" help={H_TEL} {...p} value={v} onChange={(x, i) => { setV(x); setInfo(i); }} />
      <p className="tl-out" data-out={id}>érték: „{v}”{info ? ` · ${info.kind} · ${info.valid ? 'érvényes' : 'nem teljes'}` : ''}</p>
    </>
  );
}

function Csuszka() {
  const [km, setKm] = useState(10);
  return <><Slider label="Távolság" help="Ilyen messze keresünk partnert a felhasználó helyétől. Kisebb érték = kevesebb, de közelebbi találat." min={0} max={50} unit="km" value={km} onChange={setKm} name="tav" /><p className="tl-out" data-out="km">km: {km}</p></>;
}
function Tized() {
  const [v, setV] = useState(3.5);
  return <><Slider label="Legalább ennyi csillag" help="Csak az ennél jobbra értékelt helyek látszanak. Fél csillagos lépésekben állítható." min={1} max={5} step={0.5} format={(x) => `${String(x).replace('.', ',')} ★`} value={v} onChange={setV} /><p className="tl-out" data-out="csillag">csillag: {v}</p></>;
}
function Szazalek() {
  const [v, setV] = useState(0);
  return <Slider label="Kedvezmény" help="A kupon kedvezménye. A 0 % azt jelenti: nincs kedvezmény, csak ajándék." min={0} max={100} step={5} bigStep={25} unit="%" value={v} onChange={setV} />;
}
function Tartomany() {
  const [v, setV] = useState<[number, number]>([18, 65]);
  return <><RangeSlider label="Életkor" help="Ebből a korosztályból kapják meg az értesítést. A két fogantyú nem kerülhet egymás mellé: legalább 1 év a különbség." min={14} max={99} unit="év" minGap={1} value={v} onChange={setV} /><p className="tl-out" data-out="kor">kor: {v[0]}–{v[1]}</p></>;
}
function Egyenlo() {
  const [v, setV] = useState<[number, number]>([20, 20]);
  return <RangeSlider label="Nyitás (óra)" help="Ebben az idősávban nyitva lévő helyek. Lehet egyetlen óra is (a két fogantyú egy helyen)." min={0} max={24} unit="h" value={v} onChange={setV} />;
}

const csv = 'nev;varos\nZöld Sarok Bolt;Budapest\nJavító Kávézó;Szeged\n'; // mintaadat
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function sikeres({ progress }: { progress: (v: number) => void }) {
  for (let i = 1; i <= 5; i++) { await wait(150); progress(i / 5); }
  return new Blob([csv.repeat(40)], { type: 'text/csv' });
}

function VagolapTiltas() {
  const [off, setOff] = useState(false);
  const block = () => {
    // Szimulált tiltás: a böngésző nem enged másolni (pl. nem biztonságos oldal, régi WebView)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('tiltva')) }, configurable: true });
    document.execCommand = () => false;
    setOff(true);
  };
  return <>{!off ? <Button variant="secondary" size="sm" onClick={block}>Vágólap letiltása (szimuláció)</Button> : <p className="tl-out">A vágólap le van tiltva – a másolás a tartalék mezőt mutatja.</p>}
    <CopyButton value="BEECO-OSZ-10" what="kuponkód" showValue /></>;
}

function Oldal() {
  return (
    <>
      <Grid title="Telefonszám (PhoneField)">
        <Case id="tel-ures" title="Üres – gépelj, illessz be"><Tel id="tel-ures" /></Case>
        <Case id="tel-mobil" title="Mobil, kitöltve"><Tel id="tel-mobil" init="+36301234567" /></Case>
        <Case id="tel-budapest" title="Budapest (8 jegy)"><Tel id="tel-budapest" init="+3612345678" /></Case>
        <Case id="tel-videk" title="Vidéki vezetékes (8 jegy)"><Tel id="tel-videk" init="+3652123456" /></Case>
        <Case id="tel-csakmobil" title="Csak mobil – vezetékest kap"><Tel id="tel-csakmobil" kind="mobil" init="+3612345678" /></Case>
        <Case id="tel-kotelezo" title="Kötelező + hiba"><Tel id="tel-kotelezo" required error="Add meg a kapcsolattartó számát – enélkül nem aktiválható a partner." /></Case>
        <Case id="tel-tiltott" title="Tiltott telefonmező"><Tel id="tel-tiltott" init="+36705551234" disabled /></Case>
        <Case id="tel-olvas" title="Csak olvasható"><Tel id="tel-olvas" init="+3612345678" readOnly /></Case>
        <Case id="tel-kijelzes" title="Kijelzés táblázatban (formatHuPhone)">
          <ul className="tl-out" data-out="kijelzes">{['06301234567', '+36 1 234 5678', '0036 52 123 456', '+44 20 7946 0958', ''].map((x) => <li key={x}>„{x}” → „{formatHuPhone(x) || '–'}”</li>)}</ul>
        </Case>
      </Grid>
      <Grid title="Csúszka (Slider, RangeSlider)">
        <Case id="slider-alap" title="Egy érték, km"><Csuszka /></Case>
        <Case id="slider-tized" title="Tizedes lépés (0,5)"><Tized /></Case>
        <Case id="slider-szazalek" title="0 % (határon), nagy lépés 25"><Szazalek /></Case>
        <Case id="range" title="Tartomány, legalább 1 év köz"><Tartomany /></Case>
        <Case id="range-egyenlo" title="Tartomány, egy helyen"><Egyenlo /></Case>
        <Case id="slider-tiltott" title="Tiltott csúszka"><Slider label="Távolság" help="Előbb kapcsold be a helyalapú szűrést." min={0} max={50} unit="km" value={25} onChange={() => undefined} disabled /></Case>
        <Case id="slider-hiba" title="Csúszka hibával"><Slider label="Keresési sugár" help="Legalább 1 km kell, különben nincs találat." min={0} max={50} unit="km" value={0} onChange={() => undefined} error="Legalább 1 km legyen – húzd jobbra a fogantyút." /></Case>
      </Grid>
      <Grid title="Másolás (CopyButton)">
        <Case id="copy-gomb" title="Kuponkód felirattal"><CopyButton value="BEECO-OSZ-10" what="kuponkód" showValue /></Case>
        <Case id="copy-ikon" title="Ikongomb (táblázatsorban)"><div className="bc-row"><code>PRT-00042</code><CopyButton value="PRT-00042" what="partner-azonosító" variant="icon" /></div></Case>
        <Case id="copy-hosszu" title="Hosszú link"><CopyButton value="https://beeco.hu/app/kupon/zold-sarok-bolt-oszi-csomagolasmentes-kedvezmeny-2026-10-01?utm=admin" what="link" showValue /></Case>
        <Case id="copy-tiltott" title="Tiltott másolás"><CopyButton value="—" what="kuponkód" disabled /></Case>
        <Case id="copy-hiba" title="Ha a böngésző nem enged másolni"><VagolapTiltas /></Case>
      </Grid>
      <Grid title="Letöltés (DownloadButton)">
        <Case id="dl-siker" title="Haladással (mintaadat)"><DownloadButton label="Excel-export" fileName="partnerek-2026-10-01.csv" sizeHint="kb. 2 KB" onDownload={sikeres} /></Case>
        <Case id="dl-nincs" title="Haladás nélkül"><DownloadButton label="Lista letöltése" fileName="kuponok.csv" onDownload={async () => { await wait(600); return new Blob([csv], { type: 'text/csv' }); }} /></Case>
        <Case id="dl-hiba" title="Hiba → újra"><DownloadButton label="Excel-export" fileName="poi-lista.xlsx" onDownload={async () => { await wait(400); throw new Error('500'); }} /></Case>
        <Case id="dl-fo" title="Fő gomb, hosszú fájlnév"><DownloadButton variant="primary" label="Beváltások letöltése" fileName="kupon-bevaltasok-zold-sarok-bolt-2026-07-01--2026-09-30.xlsx" sizeHint="kb. 1,2 MB" onDownload={sikeres} /></Case>
        <Case id="dl-tiltott" title="Tiltott letöltés"><DownloadButton label="Excel-export" fileName="ures.xlsx" disabled onDownload={sikeres} /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – mezők és gombok', 'Telefonszám, csúszka, másolás és letöltés – minden állapot és szélső eset. A számok és nevek mintaadatok.', <Oldal />);
