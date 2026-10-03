import { useState } from 'react';
import { Button, FormActions, FormSection, IconButton, SegmentedControl, TextField, IcOpen, IcSave, IcTrash } from '../src';
import { Case, Grid, mount } from './_keret';

const Toll = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>;

function Oldal() {
  const [nezet, setNezet] = useState<'lista' | 'csempe' | 'terkep'>('lista');
  const [n2, setN2] = useState<'lista' | 'terkep'>('terkep');
  const [tema, setTema] = useState('osszes');
  const [kattint, setKattint] = useState(0);
  return (
    <>
      <Grid title="Gombok">
        <Case id="gomb-valtozat" title="Változatok"><div className="bc-row"><Button icon={<IcSave />}>Mentés</Button><Button variant="secondary">Mégse</Button><Button variant="ghost" icon={<IcOpen />}>Részletek</Button><Button variant="danger" icon={<IcTrash />}>Törlés</Button></div></Case>
        <Case id="gomb-meret" title="Méretek"><div className="bc-row"><Button size="sm">Kicsi</Button><Button>Közepes</Button><Button size="lg">Nagy</Button></div></Case>
        <Case id="gomb-allapot" title="Tiltott, folyamatban (dupla kattintás ellen)"><div className="bc-row"><Button disabled>Tiltott</Button><Button icon={<IcSave />} busy onClick={() => setKattint((k) => k + 1)}>Mentés</Button></div><p className="tl-out" data-out="busy">kattintás: {kattint}</p></Case>
        <Case id="gomb-ikon" title="Ikongomb"><div className="bc-row"><IconButton aria-label="Partner szerkesztése"><Toll /></IconButton><IconButton aria-label="Partner törlése" danger>×</IconButton></div></Case>
        <Case id="gomb-kipontozas" title="Ablakot nyitó gomb: a „…” három pont (Lalezar-tartalék)"><div className="bc-row"><Button variant="secondary">Importálás…</Button><Button size="sm" variant="secondary">Exportálás…</Button></div></Case>
        <Case id="gomb-hosszu" title="Hosszú felirat"><Button block>Az összes kijelölt partner kuponjainak meghosszabbítása egy hónappal</Button></Case>
      </Grid>
      <Grid title="Szegmentált kapcsoló – 3A">
        <Case id="seg-ketto" title="Két elem"><SegmentedControl label="Nézet" value={n2} onChange={setN2} items={[{ value: 'lista', label: 'Lista' }, { value: 'terkep', label: 'Térkép' }]} /></Case>
        <Case id="seg-harom" title="Három elem, egy tiltott"><SegmentedControl label="Nézet" value={nezet} onChange={setNezet} items={[{ value: 'lista', label: 'Lista' }, { value: 'csempe', label: 'Csempék' }, { value: 'terkep', label: 'Térkép', disabled: true }]} /><p className="tl-out" data-out="seg">nézet: {nezet}</p></Case>
        <Case id="seg-tordelodo" title="Sok elem, tördelődő (wrap)" wide><SegmentedControl wrap label="Téma" value={tema} onChange={setTema} items={['Összes', 'Kuponok', 'Térkép', 'Események', 'Beváltás', 'Profil & fiók', 'A partner app használata', 'Szolgáltatások', 'Közösség'].map((l) => ({ value: l === 'Összes' ? 'osszes' : l, label: l }))} /></Case>
      </Grid>
      <Grid title="Űrlapszakasz">
        <Case id="form" title="FormSection + FormActions" wide>
          <form onSubmit={(e) => e.preventDefault()}>
            <FormSection title="Alapadatok" description="Ami az appban a partner kártyáján látszik.">
              <TextField label="Partner neve" help="Így jelenik meg az appban." maxLength={60} minLength={3} required />
              <TextField label="Weboldal" help="Teljes cím https://-sel; az app innen nyitja meg." type="url" maxLength={200} placeholder="https://" />
            </FormSection>
            <FormActions><Button variant="secondary">Mégse</Button><Button type="submit" icon={<IcSave />}>Mentés</Button></FormActions>
          </form>
        </Case>
      </Grid>
    </>
  );
}
mount('Vezérlők', 'Gombok (változat, méret, tiltott, folyamatban), ikongomb, szegmentált kapcsoló, űrlapszakasz.', <Oldal />);
