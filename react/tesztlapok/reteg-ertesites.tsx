import { useState } from 'react';
import { Button, Modal, ModalCancel, Toaster, notify } from '../src';
import { Case, Grid, mount } from './_keret';

const HOSSZU = 'Nem sikerült menteni a kupont, mert a szerver időtúllépéssel válaszolt. A módosításaid megvannak ebben az ablakban – ellenőrizd a hálózatot, aztán nyomd meg újra a Mentést. Ha többször nem megy, másold ki a hibajelentést a Rólunk oldalon, és küldd el nekünk.';

function Oldal() {
  const [rejtett, setRejtett] = useState(false);
  const [modal, setModal] = useState(false);
  const elrejt = () => {
    setRejtett(true);
    // Visszafordítható művelet: nincs megerősítés, az értesítésben „Visszavonás” van
    notify.success('A partner elrejtve.', { action: { label: 'Visszavonás', onClick: () => setRejtett(false) } });
  };
  return (
    <>
      <Toaster />
      <p className="tl-out" data-out="rejtett">partner: {rejtett ? 'rejtett' : 'látható'}</p>
      <Grid title="Értesítés (Toast) – 8A: asztalon jobb fent, telefonon lent középen">
        <Case id="t-fajtak" title="Fajták: siker, info, figyelmeztetés (5 mp), hiba (marad)">
          <div className="bc-row">
            <Button variant="secondary" size="sm" onClick={() => notify.success('Kupon mentve.')}>Siker</Button>
            <Button variant="secondary" size="sm" onClick={() => notify.info('Az export elkészült, a letöltés elindult.')}>Info</Button>
            <Button variant="secondary" size="sm" onClick={() => notify.warning('A kép kicsi – az appban homályos lehet.')}>Figyelmeztetés</Button>
            <Button variant="secondary" size="sm" onClick={() => notify.error('Nem sikerült menteni. Próbáld újra.')}>Hiba</Button>
          </div>
        </Case>
        <Case id="t-vissza" title="Visszavonás (visszafordítható művelet megerősítés helyett)">
          <Button variant="secondary" onClick={elrejt} disabled={rejtett}>Partner elrejtése</Button>
        </Case>
        <Case id="t-hosszu" title="Nagyon hosszú szöveg: 3 sor után „Részletek”">
          <Button variant="secondary" onClick={() => notify.error(HOSSZU)}>Hosszú hiba</Button>
        </Case>
        <Case id="t-husz" title="20 értesítés egyszerre: 3 látszik, „+N további”, azonos nem halmozódik">
          <div className="bc-row">
            <Button variant="secondary" onClick={() => { for (let i = 1; i <= 20; i++) notify.info(`${i}. elem archiválva (mintaadat).`); }}>20 különböző</Button>
            <Button variant="secondary" onClick={() => { for (let i = 0; i < 5; i++) notify.success('Kupon mentve.'); }}>5× ugyanaz</Button>
            <Button variant="ghost" onClick={() => notify.dismiss()}>Mind bezárása</Button>
          </div>
        </Case>
        <Case id="t-ablak" title="Ablak fölött (réteg-sorrend)">
          <Button variant="secondary" onClick={() => setModal(true)}>Ablak nyitása</Button>
          <Modal open={modal} onOpenChange={setModal} title="Kupon szerkesztése" footer={<><ModalCancel /><Button onClick={() => notify.success('Kupon mentve.', { action: { label: 'Visszavonás', onClick: () => undefined } })}>Mentés (nyitva marad)</Button></>}>
            <p>Az értesítés az ablak fölött jelenik meg; a „Visszavonás” nem zárja be az ablakot.</p>
          </Modal>
        </Case>
      </Grid>
    </>
  );
}

mount('Rétegek – értesítések', 'notify.success / error / info / warning: időzítés, hiba marad, rámutatásra megáll, Visszavonás, legfeljebb 3 látszik, ablak fölött.', <Oldal />);
