import { useState } from 'react';
import { Checkbox, RadioGroup, SearchBox, SelectField, Switch, TextArea, TextField } from '../src';
import { Case, Grid, mount } from './_keret';

// Szöveges mezők, legördülő, jelölők, kapcsoló, kereső – minden állapot és szélső eset (docs/komponensek.md 3.4)
const H = 'Így jelenik meg az appban a partner kártyáján. Rövid, felismerhető név jó, pl. „Zöld Sarok Bolt”.';
const long = 'Csomagolásmentesélelmiszerboltésjavítókávézóegyhelyenszóköznélkülihosszúszó';
const many = Array.from({ length: 12 }, (_, i) => ({ value: `k${i}`, label: `Kategória ${i + 1}` }));

function Oldal() {
  const [radio, setRadio] = useState('bolt');
  const [sw, setSw] = useState(true);
  const [q, setQ] = useState('');
  return (
    <>
      <Grid title="Szöveges mező (TextField)">
        <Case id="text-ures" title="Üres, számlálóval"><TextField label="Partner neve" help={H} maxLength={60} minLength={3} placeholder="pl. Zöld Sarok Bolt" /></Case>
        <Case id="text-max" title="Határon (60/60)"><TextField label="Partner neve" help={H} maxLength={60} defaultValue={'x'.repeat(60)} /></Case>
        <Case id="text-kotelezo" title="Kötelező + hiba"><TextField label="E-mail cím" help="Ide küldjük a kupon-beváltási értesítőt. Céges cím legyen, amit rendszeresen olvasnak." type="email" required error="Ez nem e-mail cím – így néz ki: nev@ceg.hu" defaultValue="zoldsarok" /></Case>
        <Case id="text-tiltott" title="Tiltott"><TextField label="Partner-azonosító" help="A rendszer adja, nem módosítható." disabled defaultValue="PRT-00042" /></Case>
        <Case id="text-olvas" title="Csak olvasható"><TextField label="Létrehozva" help="Mikor került a rendszerbe a partner." readOnly defaultValue="2026. 09. 12." /></Case>
        <Case id="text-hosszu" title="Hosszú szó szóköz nélkül"><TextField label="Partner neve" help={H} maxLength={80} defaultValue={long} /></Case>
        <Case id="text-ekezet" title="Ékezet, emoji, HTML-szerű szöveg"><TextField label="Szlogen" help="Egy mondat a partnerről." maxLength={80} defaultValue="Őszi ünnep 🐝 <b>nem félkövér</b> – ű, ő" /></Case>
        <Case id="text-beilleszt" title="Beillesztés-levágás (max. 20)"><TextField label="Rövid név" help="Legfeljebb 20 karakter, a térképen ez látszik." maxLength={20} /></Case>
      </Grid>
      <Grid title="Többsoros mező (TextArea)">
        <Case id="area-213" title="213/255 állapot"><TextArea label="Leírás" help="Két-három mondat: mit kínál a partner, és miért fenntarthatóbb. Az app részletek oldalán jelenik meg." maxLength={255} defaultValue={'Csomagolásmentes bolt a belvárosban, ahol saját edénybe vásárolhatsz tésztát, olajat, mosószert. Hétvégente javítókávézó: kis háztartási gépek és ruhák javítása önkéntesekkel. Kártyás fizetés, bérletes kedvezmény, ingyenes víz. '.padEnd(213, '.').slice(0, 213)} /></Case>
        <Case id="area-hiba" title="Túl rövid (hiba)"><TextArea label="Leírás" help="Két-három mondat a partnerről." minLength={40} maxLength={255} defaultValue="Bolt." error="Legalább 40 karakter kell – most 5. Írd le, mit kínál a partner." /></Case>
      </Grid>
      <Grid title="Legördülő (SelectField) – rövid listához">
        <Case id="select-alap" title="Alap"><SelectField label="Típus" help="Ez alapján szűrhetnek a felhasználók a térképen." placeholder="Válassz…" options={[{ value: 'bolt', label: 'Bolt' }, { value: 'kavezo', label: 'Kávézó' }, { value: 'javito', label: 'Javító' }]} /></Case>
        <Case id="select-ures" title="Nincs opció"><SelectField label="Alkategória" help="Előbb válassz kategóriát." placeholder="Válassz…" options={[]} /></Case>
        <Case id="select-sok" title="12 opció + hiba"><SelectField label="Kategória" help="A fő kategória." placeholder="Válassz…" options={many} error="Válassz kategóriát – enélkül nem jelenik meg a térképen." /></Case>
        <Case id="select-hosszu" title="Nagyon hosszú opciónév"><SelectField label="Program" help="Melyik programban vesz részt a partner." options={[{ value: 'a', label: 'Fenntartható Belváros Kezdeményezés 2026 – őszi kupon- és javítóhét partnerprogram' }]} /></Case>
      </Grid>
      <Grid title="Jelölők, kapcsoló, kereső">
        <Case id="check" title="Jelölőnégyzet"><Checkbox label="Megjelenik a térképen" help="Ha kiveszed, a partner nem látszik az app térképén, de a kuponjai megmaradnak." defaultChecked /></Case>
        <Case id="check-hiba" title="Jelölő hibával"><Checkbox label="Elfogadom a partneri feltételeket" help="Enélkül nem aktiválható a partner." error="A feltételek elfogadása kötelező." /></Case>
        <Case id="radio" title="Rádiócsoport"><RadioGroup label="Partner típusa" help="A típus határozza meg, milyen kuponokat adhat ki." name="tipus" value={radio} onChange={setRadio} options={[{ value: 'bolt', label: 'Bolt' }, { value: 'kavezo', label: 'Kávézó' }, { value: 'on', label: 'Önkormányzat', disabled: true }]} /></Case>
        <Case id="switch" title="Kapcsoló"><Switch label="Aktív" help="Kikapcsolva a partner rejtve van az appban; semmi nem törlődik." checked={sw} onChange={setSw} /></Case>
        <Case id="search" title="Kereső (Esc törli)"><SearchBox label="Partner keresése" value={q} onChange={setQ} /><p className="tl-out" data-out="search">Keresés: „{q}”</p></Case>
      </Grid>
    </>
  );
}

mount('Mezők', 'Szöveges mező, többsoros mező, legördülő, jelölők, kapcsoló és kereső – minden állapot és szélső eset. Minden mezőnek van súgója (ⓘ), tartománya és számlálója.', <Oldal />);
