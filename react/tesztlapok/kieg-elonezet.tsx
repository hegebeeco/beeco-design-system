import { useState } from 'react';
import { Clamp, PreviewCard, SegmentedControl, TextArea, TextField, type PreviewView } from '../src';
import { Case, Grid, mount } from './_keret';

// 06a – app-előnézet telefonkeretben: partner, kupon, értesítés; levágás mérése (mintaadat)
const KEP = '../../web/assets/brand/logo.webp';
const hosszu = 'Csomagolásmentes bolt a belvárosban, ahol saját edénybe vásárolhatsz tésztát, olajat, mosószert. Hétvégente javítókávézó önkéntesekkel, kártyás fizetés, ingyenes csapvíz.';

function Elo() {
  const [title, setTitle] = useState('Őszi kupon a Zöld Sarokban');
  const [body, setBody] = useState('Hozd a saját dobozod, és 10% kedvezményt kapsz minden ömlesztett termékre.');
  const [btn, setBtn] = useState('Megnézem');
  return (
    <div className="tl-grid">
      <div className="bc-stack">
        <TextField label="Cím" help="Az értesítés címe: egy rövid, cselekvésre hívó mondat. Az appban 2 sor fér el." maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextArea label="Üzenet" help="A teljes üzenet; az appban 4 sor látszik, a többit a megnyitás után olvassa." maxLength={300} value={body} onChange={(e) => setBody(e.target.value)} />
        <TextField label="Gomb felirata" help="Ige, 1–2 szó (pl. „Megnézem”). Egy sorban kell elférnie." maxLength={30} value={btn} onChange={(e) => setBtn(e.target.value)} />
      </div>
      <PreviewCard variant="ertesites" title={title} body={body} buttonText={btn} imageUrl="" />
    </div>
  );
}

// Javaslat 20: kártya ↔ részletek váltó (ugyanaz az adat két nézetben)
function Nezetvalto() {
  const [view, setView] = useState<PreviewView>('card');
  return (
    <div className="bc-stack">
      <SegmentedControl label="Nézet" value={view} onChange={setView} items={[{ value: 'card', label: 'Kártya' }, { value: 'detail', label: 'Részletek' }]} />
      <PreviewCard variant="esemeny" view={view} name="Őszi kertnyitó a Zöld Sarokban" start="2026. 10. 10. 10:00" end="2026. 10. 10. 16:00" location="Budapest, Ráday u. 12."
        fee="Ingyenes" category="Közösségi kert" organizers="Zöld Sarok, Méhes Egyesület" featured imageUrl={KEP}
        description={'Gyere el, ültessünk együtt!\nHozz kesztyűt és kulacsot.\n\n' + hosszu + ' ' + hosszu} />
    </div>
  );
}

function Vagas() {
  const [cut, setCut] = useState<boolean | null>(null);
  return (
    <div className="bc-stack" style={{ maxWidth: 220 }}>
      <Clamp k="cim" label="A cím" lines={1} placeholder="Cím helye" onCut={setCut}>Hosszú cím, ami egy sorban biztosan nem fér el ezen a keskeny helyen</Clamp>
      <p className="tl-out" data-out="vagas">levágva: {cut === null ? '?' : cut ? 'igen' : 'nem'}</p>
    </div>
  );
}

function Oldal() {
  return (
    <>
      <Grid title="Élő előnézet szerkesztés közben">
        <Case id="pv-elo" title="Értesítés – gépelj, és nézd a levágást" wide><Elo /></Case>
      </Grid>
      <Grid title="Partner">
        <Case id="pv-partner" title="Rövid szövegek"><PreviewCard variant="partner" name="Zöld Sarok Bolt" category="Csomagolásmentes" address="Budapest, Ráday u. 12." description="Saját edénybe vásárolhatsz." imageUrl={KEP} /></Case>
        <Case id="pv-partner-hosszu" title="Hosszú név és leírás – levágva"><PreviewCard variant="partner" name="Fenntartható Belváros Csomagolásmentes Élelmiszerbolt és Javítókávézó" category="Bolt" address="Budapest, Nagyon Hosszú Nevű Utca 123. II. emelet 4. ajtó" description={hosszu + ' ' + hosszu} /></Case>
        <Case id="pv-partner-ures" title="Üres mezők – helykitöltő"><PreviewCard variant="partner" /></Case>
      </Grid>
      <Grid title="Kupon">
        <Case id="pv-kupon" title="Kupon kedvezménnyel"><PreviewCard variant="kupon" partnerName="Javító Kávézó" title="Ingyen kávé a javításhoz" discount="-100%" validUntil="2026. 10. 31-ig" description="Ha javíttatsz nálunk, a kávé ajándék." imageUrl={KEP} /></Case>
        <Case id="pv-kupon-hosszu" title="Szóköz nélküli hosszú szó"><PreviewCard variant="kupon" partnerName="Csomagolásmentesélelmiszerboltésjavítókávézó" title="Csomagolásmentesélelmiszerboltésjavítókávézóegyhelyenszóköznélkülihosszúszó" discount="-10%" validUntil="2026. 12. 31-ig" description="<b>nem félkövér</b> 🐝 – ű, ő" /></Case>
      </Grid>
      <Grid title="Edukáció (Javaslat 20)">
        <Case id="pv-edu" title="Kártya – kártyaszöveggel, témakör és partner"><PreviewCard variant="edukacio" title="Mi az a lábnyom?" cardText="Három perc, és érted, mitől nő vagy csökken." description="Hosszabb leírás a részletekhez." contentType="Cikk" topic="Klíma" partnerName="Zöld Sarok" imageUrl={KEP} /></Case>
        <Case id="pv-edu-leiras" title="Kártya – kártyaszöveg nélkül a leírás eleje látszik"><PreviewCard variant="edukacio" title="Komposztálás alapjai" description={hosszu} contentType="Videó" /></Case>
        <Case id="pv-edu-reszlet" title="Részletek – teljes szöveg, sortörésekkel, adatsor"><PreviewCard variant="edukacio" view="detail" title="Mi az a lábnyom? – nagyon hosszú cím, ami a részleteken teljes hosszában látszik" description={'Első bekezdés.\nMásodik sor.\n\n' + [hosszu, hosszu, hosszu].join('\n\n')} contentType="Cikk" topic="Klíma" partnerName="Zöld Sarok" source="beeco szerkesztőség" day="április 22." aspect={4 / 3} imageUrl={KEP} /></Case>
        <Case id="pv-edu-ures" title="Részletek – üres mezők helykitöltővel"><PreviewCard variant="edukacio" view="detail" emptyImageText="Nincs kép – alapkép" /></Case>
      </Grid>
      <Grid title="Esemény (Javaslat 20)">
        <Case id="pv-esemeny" title="Kártya – kiemelt, díjjal"><PreviewCard variant="esemeny" name="Őszi kertnyitó" start="2026. 10. 10. 10:00" location="Budapest, Ráday u. 12." fee="Ingyenes" featured imageUrl={KEP} /></Case>
        <Case id="pv-esemeny-ures" title="Kártya – még nincs kezdés, helyszín"><PreviewCard variant="esemeny" name="Piaci séta" aspect="1 / 1" /></Case>
        <Case id="pv-nezet" title="Kártya ↔ részletek váltó, hosszú leírás – a telefon képernyője görget" wide><Nezetvalto /></Case>
      </Grid>
      <Grid title="Kupon részletek, képarány, szövegvágás (Javaslat 20)">
        <Case id="pv-kupon-reszlet" title="Kupon – részletek: tudnivalók, kód, ár, gomb, kiemelt"><PreviewCard variant="kupon" view="detail" partnerName="Javító Kávézó" title="Ingyen kávé a javításhoz" subtitle="Csak hétköznap" discount="-100%" validUntil="2026. 10. 31-ig" description="Ha javíttatsz nálunk, a kávé ajándék." terms="Egy kupon / fő / nap." code="KAVE-2026" price="300 Nektár" buttonText="Beváltom" featured imageUrl={KEP} /></Case>
        <Case id="pv-kupon-arany" title="Kupon – kártya 4:3 képpel, alcímmel, árral"><PreviewCard variant="kupon" partnerName="Javító Kávézó" title="Ingyen kávé" subtitle="Csak hétköznap, saját pohárral" price="300 Nektár" aspect={4 / 3} imageUrl={KEP} /></Case>
        <Case id="pv-clamp" title="Clamp önállóan (onCut jelzi a levágást)"><Vagas /></Case>
      </Grid>
      <Grid title="Értesítés">
        <Case id="pv-ertesites" title="Kép nélkül, gomb nélkül"><PreviewCard variant="ertesites" title="Új kupon a közeledben" body="Nézd meg az appban!" /></Case>
        <Case id="pv-ertesites-reszlet" title="Részletek – kiküldés ideje (Javaslat 20)"><PreviewCard variant="ertesites" view="detail" title="Új kupon a közeledben" body={'Nézd meg az appban!\nCsak ma.'} buttonText="Megnézem" sendAt="2026. 10. 06. 09:00" /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – app-előnézet', 'Így látszik az appban: partner, kupon, értesítés, edukáció és esemény telefonkeretben, kártya és részletek nézetben. Ami a kártyán levágódna, azt a keret méri és kiírja. Minden szöveg mintaadat.', <Oldal />);
