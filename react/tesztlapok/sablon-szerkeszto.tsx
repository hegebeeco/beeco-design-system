// Tesztlap – EditPage (06c): kupon szerkesztése mintaadattal; állapotok: ?allapot=toltes|hiba|tiltott|hosszu
// Kipróbálható: „hiba” szó a névben → szerverhiba; „Foglalt” név → szerveroldali mezőhiba.
import { useState } from 'react';
import { EditPage, FormSection, NumberField, SelectField, Switch, TextArea, TextField, type FormError } from '../src';
import { allapot, mountSablon, wait } from './_sablon-keret';

const ALLAPOTOK: Array<[string, string]> = [['toltes', 'Töltés'], ['hiba', 'Betöltési hiba'], ['tiltott', 'Nincs jogosultság'], ['hosszu', 'Nagyon hosszú űrlap']];
type Kupon = { nev: string; leiras: string; kedvezmeny: number | null; kategoria: string; aktiv: boolean };
const KEZDO: Kupon = { nev: '10% kedvezmény kávéra', leiras: 'Saját pohárral 10% kedvezmény jár minden kávéból.', kedvezmeny: 10, kategoria: 'vendeglatas', aktiv: true };
const KAT = [{ value: 'vendeglatas', label: 'Vendéglátás' }, { value: 'kereskedelem', label: 'Kereskedelem' }, { value: 'szolgaltatas', label: 'Szolgáltatás' }];
const EXTRA = ['Megjelenés az appban', 'Beváltás szabályai', 'Értesítések', 'Belső megjegyzések'];

function ellenoriz(k: Kupon): FormError[] {
  const e: FormError[] = [];
  const n = k.nev.trim().length;
  if (n < 3) e.push({ name: 'nev', label: 'Kupon neve', message: n ? `Legalább 3 karakter kell – most ${n}.` : 'Add meg a kupon nevét (3–60 karakter).' });
  if (k.kedvezmeny === null) e.push({ name: 'kedvezmeny', label: 'Kedvezmény', message: 'Írd be a kedvezményt 1 és 100 % között.' });
  if (!k.kategoria) e.push({ name: 'kategoria', label: 'Kategória', message: 'Válassz kategóriát – ez alapján szűrnek az appban.' });
  return e;
}

function Oldal() {
  const a = allapot();
  const [alap, setAlap] = useState(KEZDO);
  const [k, setK] = useState(KEZDO);
  const [hiba, setHiba] = useState(a === 'hiba');
  const set = <K extends keyof Kupon>(key: K, v: Kupon[K]) => setK((x) => ({ ...x, [key]: v }));
  const dirty = JSON.stringify(k) !== JSON.stringify(alap);
  const status = a === 'toltes' ? 'loading' : a === 'tiltott' ? 'forbidden' : hiba ? 'error' : 'ready';

  const mentes = async (): Promise<void | FormError[]> => {
    await wait(600);
    if (k.nev.toLowerCase().includes('hiba')) throw new Error('A szerver nem válaszolt időben');
    if (k.nev.trim() === 'Foglalt') return [{ name: 'nev', label: 'Kupon neve', message: 'Ilyen nevű kupon már van – adj neki másik nevet.' }];
    setAlap(k);
  };

  return (
    <>
      <EditPage submitLabel={a === 'hosszu' ? 'Kupon módosításainak mentése' : undefined} title={a === 'hosszu' ? 'Kupon szerkesztése: 10% kedvezmény kávéra saját pohárral a Méhesdi Főtér összes partnerkávézójában' : 'Kupon szerkesztése'}
        description="Mintaadat – a mentés nem megy sehova." status={status} what="a kupont" onRetry={() => setHiba(false)}
        breadcrumbs={[{ label: 'Admin', href: 'sablon-lista.html' }, { label: 'Kuponok', href: 'sablon-lista.html' }, { label: 'Szerkesztés' }]}
        dirty={dirty} validate={() => ellenoriz(k)} onSubmit={mentes} successMessage="A kupon mentve."
        onCancel={() => { location.href = 'sablon-lista.html'; }}
        preview={
          <div className="bc-card is-accent" data-out="elonezet">
            <span className="bc-badge is-muted">mintaadat</span>
            <p className="bc-card-title" style={{ marginTop: 'var(--bc-sp-3)', overflowWrap: 'anywhere' }}>{k.nev || 'Kupon neve'}</p>
            <p style={{ margin: 0, overflowWrap: 'anywhere' }}>{k.leiras || 'Leírás'}</p>
            <p style={{ margin: 'var(--bc-sp-3) 0 0' }}><strong>−{k.kedvezmeny ?? '?'} %</strong> · {k.aktiv ? 'aktív' : 'inaktív'}</p>
          </div>
        }>
        {({ errorOf }) => (
          <>
            <FormSection title="Alapadatok" description="Így jelenik meg a kupon az appban.">
              <TextField name="nev" label="Kupon neve" required minLength={3} maxLength={60} value={k.nev} onChange={(e) => set('nev', e.target.value)} error={errorOf('nev')}
                help="A kupon kártyáján ez a cím. Rövid, cselekvésre hívó név jó, pl. »10% kedvezmény kávéra«." />
              <SelectField name="kategoria" label="Kategória" required placeholder="Válassz…" options={KAT} value={k.kategoria} onChange={(e) => set('kategoria', e.target.value)}
                error={errorOf('kategoria')} help="Az appban kategória szerint lehet szűrni a kuponokat." />
              <TextArea name="leiras" className="is-wide" label="Leírás" maxLength={255} value={k.leiras} onChange={(e) => set('leiras', e.target.value)}
                help="Mit kap a felhasználó, és mi a feltétele. Egy-két mondat." />
            </FormSection>
            <FormSection title="Kedvezmény">
              <NumberField name="kedvezmeny" label="Kedvezmény" unit="%" min={1} max={100} required value={k.kedvezmeny} onChange={(v) => set('kedvezmeny', v)}
                error={errorOf('kedvezmeny')} help="Hány százalékot enged a partner. 1 és 100 között." />
              <Switch label="Aktív" checked={k.aktiv} onChange={(v) => set('aktiv', v)} help="Csak az aktív kupon látszik az appban; a beállításai kikapcsolva is megmaradnak." />
            </FormSection>
            {a === 'hosszu' && EXTRA.map((t) => (
              <FormSection key={t} title={t}>
                {[1, 2, 3].map((i) => <TextField key={i} label={`${t} – ${i}. mező`} maxLength={80} defaultValue="" help="Mintamező a hosszú űrlap kipróbálásához." />)}
              </FormSection>
            ))}
          </>
        )}
      </EditPage>
      <p className="tl-out" data-out="mentett">mentett név: {alap.nev}</p>
    </>
  );
}

mountSablon('sablon-szerkeszto', 'Szerkesztő-oldal (EditPage)', ALLAPOTOK, <Oldal />);
