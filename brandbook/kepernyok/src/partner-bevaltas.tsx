// PARTNER – Kupon beváltás (/redeem): a beváltás sikere az ikonikus pillanat. Feliratok: beeco-partner/src/features/redeem (2026-10-06). A kód MINTA.
import { useState } from 'react';
import { Bee, Button, PageHeader, Switch, TextField } from '../../../react/src';
import { mount } from './_keret';

function Oldal() {
  const [hang, setHang] = useState(false);
  const [kod, setKod] = useState('BEECO-7F2K');
  const [kesz, setKesz] = useState(true);
  return (
    <div className="kp-partner">
      <div data-ds="2"><PageHeader title="Kupon beváltás" breadcrumbs={[{ label: 'Kupon beváltás' }]}
        actions={<Switch label="Zümmögő hang sikeres beváltáskor" checked={hang} onChange={setHang} />} /></div>
      {kesz ? (
        <section className="bc-card is-accent bc-anim-stamp kp-siker" role="status" data-ds="3">
          <Bee szerep="szurkolo" size="m" /><p className="kp-siker-cim">A kupon sikeresen beváltva!</p>
          <Button variant="secondary" size="sm" onClick={() => setKesz(false)}>Újra próbálkozás</Button>
        </section>
      ) : (
        <form className="bc-card kp-kezi" data-ds="4" onSubmit={(e) => { e.preventDefault(); setKesz(true); }}>
          <h2 className="kp-h2">Kézi bevitel</h2>
          <div className="kp-sor"><TextField label="Kupon ID" value={kod} onChange={(e) => setKod(e.target.value)} />
            <Button type="submit" size="sm" disabled={!kod.trim()}>Beváltás</Button></div>
        </form>
      )}
      <p className="bc-muted kp-kicsi">A „Kupon beváltása” gomb mintaadattal működik: próbáld ki a sikeres és az újra próbálkozó állapotot.</p>
    </div>
  );
}
mount('partner', 'Beváltás', <Oldal />, [['.bc-sidebar', 1]]);
