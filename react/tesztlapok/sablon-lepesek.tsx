// Tesztlap – EditPage lépés-módban (Javaslat 20): új kupon három lépésben; ⌘S / Ctrl+S mentés. Állapotok: ?allapot=masolat|hosszu
// Kipróbálható: „Foglalt” név → szerveroldali mezőhiba az 1. lépésben (mentéskor oda ugrik); „hiba” a névben → szerverhiba.
import { useState } from 'react';
import { EditPage, FormSection, IcNew, NumberField, SelectField, TextArea, TextField, type EditStep, type FormError } from '../src';
import { allapot, mountSablon, wait } from './_sablon-keret';

const ALLAPOTOK: Array<[string, string]> = [['masolat', 'Másolat (minden lépés elérhető, a nem látott „hátravan”)'], ['hosszu', 'Hosszú lépésnevek']];
type Kupon = { nev: string; kategoria: string; cim: string; varos: string; leiras: string; kedvezmeny: number | null };
const URES: Kupon = { nev: '', kategoria: '', cim: '', varos: '', leiras: '', kedvezmeny: null };
const MASOLAT: Kupon = { nev: '10% kedvezmény kávéra (másolat)', kategoria: 'vendeglatas', cim: 'Ráday u. 12.', varos: 'Budapest', leiras: 'Saját pohárral.', kedvezmeny: 10 };
const KAT = [{ value: 'vendeglatas', label: 'Vendéglátás' }, { value: 'kereskedelem', label: 'Kereskedelem' }];

function ellenoriz(k: Kupon): FormError[] {
  const e: FormError[] = [];
  const n = k.nev.trim().length;
  if (n < 3) e.push({ name: 'nev', label: 'Kupon neve', message: n ? `Legalább 3 karakter kell – most ${n}.` : 'Add meg a kupon nevét (3–60 karakter).' });
  if (!k.kategoria) e.push({ name: 'kategoria', label: 'Kategória', message: 'Válassz kategóriát – ez alapján szűrnek az appban.' });
  if (!k.cim.trim()) e.push({ name: 'cim', label: 'Utca, házszám', message: 'Add meg, hol váltható be a kupon.' });
  if (k.kedvezmeny === null) e.push({ name: 'kedvezmeny', label: 'Kedvezmény', message: 'Írd be a kedvezményt 1 és 100 % között.' });
  return e;
}

function Oldal() {
  const a = allapot();
  const masolat = a === 'masolat';
  const hosszu = a === 'hosszu';
  const [k, setK] = useState(masolat ? MASOLAT : URES);
  const [mentett, setMentett] = useState('–');
  const [lepes, setLepes] = useState('alap');
  const set = <K extends keyof Kupon>(key: K, v: Kupon[K]) => setK((x) => ({ ...x, [key]: v }));
  const dirty = JSON.stringify(k) !== JSON.stringify(masolat ? MASOLAT : URES);
  const LEPESEK: EditStep[] = [
    { id: 'alap', title: hosszu ? 'Alapadatok: a kupon neve és kategóriája, ahogy az appban megjelenik' : 'Alapadatok', description: 'Így találják meg az appban.', fields: ['nev', 'kategoria'] },
    { id: 'hely', title: hosszu ? 'Beváltás helye – utca, házszám és település' : 'Hely', fields: ['cim', 'varos'] },
    { id: 'kedv', title: hosszu ? 'Kedvezmény és a kupon részletes leírása' : 'Kedvezmény', description: 'Az utolsó lépés után mentesz.', fields: ['kedvezmeny', 'leiras'] },
  ];

  const mentes = async (): Promise<void | FormError[]> => {
    await wait(400);
    if (k.nev.toLowerCase().includes('hiba')) throw new Error('A szerver nem válaszolt időben');
    if (k.nev.trim() === 'Foglalt') return [{ name: 'nev', label: 'Kupon neve', message: 'Ilyen nevű kupon már van – adj neki másik nevet.' }];
    setMentett(k.nev);
  };

  return (
    <>
      <EditPage key={a} title="Új kupon" description="Mintaadat – a mentés nem megy sehova." dirty={dirty} validate={() => ellenoriz(k)} onSubmit={mentes}
        successMessage="A kupon létrejött." submitLabel="Kupon létrehozása" submitIcon={<IcNew />} saveShortcut
        onCancel={() => { location.href = 'sablon-lista.html'; }}
        steps={{ items: LEPESEK, label: 'Az új kupon felvételének lépései', allReachable: masolat, onStepChange: setLepes }}>
        {({ errorOf, step }) => (
          <>
            {step === 'alap' && (
              <FormSection title="Név és kategória">
                <TextField name="nev" label="Kupon neve" required minLength={3} maxLength={60} value={k.nev} onChange={(e) => set('nev', e.target.value)} error={errorOf('nev')}
                  help="A kupon kártyáján ez a cím. Rövid, cselekvésre hívó név jó, pl. »10% kedvezmény kávéra«." />
                <SelectField name="kategoria" label="Kategória" required placeholder="Válassz…" options={KAT} value={k.kategoria} onChange={(e) => set('kategoria', e.target.value)}
                  error={errorOf('kategoria')} help="Az appban kategória szerint lehet szűrni a kuponokat." />
              </FormSection>
            )}
            {step === 'hely' && (
              <FormSection title="Beváltás helye">
                <TextField name="cim" label="Utca, házszám" required maxLength={120} value={k.cim} onChange={(e) => set('cim', e.target.value)} error={errorOf('cim')}
                  help="Ahol a vásárló beválthatja a kupont, pl. »Ráday u. 12.«." />
                <TextField name="varos" label="Település" maxLength={60} value={k.varos} onChange={(e) => set('varos', e.target.value)}
                  help="Ha üresen hagyod, a partner címének települése látszik." />
              </FormSection>
            )}
            {step === 'kedv' && (
              <FormSection title="Kedvezmény">
                <NumberField name="kedvezmeny" label="Kedvezmény" unit="%" min={1} max={100} required value={k.kedvezmeny} onChange={(v) => set('kedvezmeny', v)}
                  error={errorOf('kedvezmeny')} help="Hány százalékot enged a partner. 1 és 100 között." />
                <TextArea name="leiras" className="is-wide" label="Leírás" maxLength={255} value={k.leiras} onChange={(e) => set('leiras', e.target.value)}
                  help="Mit kap a felhasználó, és mi a feltétele. Egy-két mondat." />
              </FormSection>
            )}
          </>
        )}
      </EditPage>
      <p className="tl-out" data-out="mentett">mentett név: {mentett} · lépés: {lepes}</p>
    </>
  );
}

mountSablon('sablon-lepesek', 'Szerkesztő-oldal lépésenként (EditPage steps)', ALLAPOTOK, <Oldal />);
