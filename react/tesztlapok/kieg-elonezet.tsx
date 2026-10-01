import { useState } from 'react';
import { PreviewCard, TextArea, TextField } from '../src';
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
      <Grid title="Értesítés">
        <Case id="pv-ertesites" title="Kép nélkül, gomb nélkül"><PreviewCard variant="ertesites" title="Új kupon a közeledben" body="Nézd meg az appban!" /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – app-előnézet', 'Így látszik az appban: partner, kupon és értesítés telefonkeretben. Ami az appban levágódna, azt a keret méri és kiírja. Minden szöveg mintaadat.', <Oldal />);
