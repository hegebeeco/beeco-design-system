import { useState, type ReactNode } from 'react';
import { Button, ConfirmDialog, Drawer, Modal, ModalCancel, TextField, Toaster, TypeToConfirm, notify, useQueryParam, IcSave, IcEdit, IcOpen } from '../src';
import { Case, Grid, mount } from './_keret';

// Mintaadatok (nem valós nevek, nem valós számok)
const HOSSZU_CIM = 'Fenntartható Belváros Kezdeményezés 2026 – őszi kupon- és javítóhét partnerprogramjának kiemelt sablonja (mintaadat)';
const bekezdes = (i: number) => <p key={i}>{i + 1}. bekezdés – a hosszú tartalom a törzsben görög, a fej és a gombsor áll. Mintaszöveg, hogy legyen mit görgetni.</p>;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Nyito({ id, label, children }: { id: string; label: string; children: (open: boolean, set: (o: boolean) => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  return <><Button variant="secondary" data-open={id} icon={label === 'Szerkesztés' ? <IcEdit /> : undefined} onClick={() => setOpen(true)}>{label}</Button>{children(open, setOpen)}</>;
}

function Oldal() {
  const [log, setLog] = useState('még semmi');
  const [nev, setNev] = useState('');
  const [reszlet, setReszlet] = useQueryParam('reszlet');
  const [impact, setImpact] = useState<'tolt' | 'hiba' | 'kesz'>('hiba');
  return (
    <>
      <Toaster />
      <p className="tl-out" data-out="log">utolsó művelet: {log}</p>
      <Grid title="Felugró ablak (Modal) – 1A">
        <Case id="modal-alap" title="Alap, rövid űrlap (fókusz az első mezőn)">
          <Nyito id="alap" label="Címke létrehozása">{(o, s) => (
            <Modal open={o} onOpenChange={s} title="Új címke" description="A partnerek és POI-k szűréséhez."
              footer={<><ModalCancel /><Button icon={<IcSave />} onClick={() => { setLog(`mentve: ${nev || '(üres)'}`); s(false); notify.success('Címke mentve.'); }}>Mentés</Button></>}>
              <TextField label="Címke neve" help="Így jelenik meg a szűrőben. Rövid, egyértelmű név jó, pl. „javító”." maxLength={40} value={nev} onChange={(e) => setNev(e.target.value)} />
            </Modal>)}
          </Nyito>
        </Case>
        <Case id="modal-hosszu" title="Nagyon hosszú cím és tartalom, széles">
          <Nyito id="hosszu" label="Hosszú ablak">{(o, s) => (
            <Modal open={o} onOpenChange={s} size="wide" title={HOSSZU_CIM} footer={<><ModalCancel /><Button onClick={() => s(false)}>Rendben</Button></>}>
              {Array.from({ length: 30 }, (_, i) => bekezdes(i))}
            </Modal>)}
          </Nyito>
        </Case>
        <Case id="modal-mentetlen" title="El nem mentett változás → kérdez">
          <Nyito id="mentetlen" label="Szerkesztés">{(o, s) => <Mentetlen open={o} setOpen={s} />}</Nyito>
        </Case>
        <Case id="modal-folyamat" title="Mentés folyamatban, majd hiba az ablakon belül">
          <Nyito id="folyamat" label="Lassú mentés">{(o, s) => <Folyamat open={o} setOpen={s} />}</Nyito>
        </Case>
        <Case id="modal-beagyazott" title="Ablak az ablakban (legfeljebb 2 szint)">
          <Nyito id="beagyazott" label="Kép szerkesztése">{(o, s) => <Beagyazott open={o} setOpen={s} />}</Nyito>
        </Case>
      </Grid>
      <Grid title="Megerősítés (ConfirmDialog) – csak visszafordíthatatlan műveletnél">
        <Case id="confirm-torles" title="Törlés, következménnyel (fókusz a Mégse-n)">
          <Nyito id="torles" label="Kupon-sablon törlése">{(o, s) => (
            <ConfirmDialog open={o} onOpenChange={s} danger title="Törlöd a kupon-sablont?" confirmLabel="Törlés"
              onConfirm={() => { setLog('sablon törölve'); notify.success('A sablon törölve.'); }}>
              „Nyári kávé 10%” (mintaadat) – a hozzá tartozó 3 időzítés is törlődik. Nem vonható vissza.
            </ConfirmDialog>)}
          </Nyito>
        </Case>
        <Case id="confirm-hiba" title="Szerverhiba: az ablak nyitva marad, újrapróbálható">
          <Nyito id="hiba" label="Közzététel">{(o, s) => (
            <ConfirmDialog open={o} onOpenChange={s} title="Közzéteszed a kampányt?" confirmLabel="Közzététel"
              onConfirm={async () => { await wait(300); throw new Error('a szerver nem válaszolt'); }}>
              Minden felhasználó látni fogja az appban. Közzététel után csak archiválni lehet.
            </ConfirmDialog>)}
          </Nyito>
        </Case>
      </Grid>
      <Grid title="Veszélyes tömeges művelet (TypeToConfirm) – 2A">
        <Case id="type-szam" title="42 elem: a darabszámot kell begépelni">
          <Nyito id="szam" label="42 POI végleges törlése">{(o, s) => (
            <TypeToConfirm open={o} onOpenChange={s} count={42} prompt="Írd be a törlendő POI-k számát" title="Végleges törlés: 42 POI"
              confirmLabel="42 POI végleges törlése" onConfirm={() => setLog('42 POI törölve')}>
              Vele törlődik: 118 kép, 6 nyitott hibajelzés, 240 értékelés (mintaadat). Nem vonható vissza.
            </TypeToConfirm>)}
          </Nyito>
        </Case>
        <Case id="type-nev" title="Egy elem, másokat is érint: a nevét kell begépelni">
          <Nyito id="nev" label="Partner végleges törlése">{(o, s) => (
            <TypeToConfirm open={o} onOpenChange={s} name="Méhes Kávézó" prompt="Írd be a partner nevét" title="Végleges törlés: Méhes Kávézó"
              confirmLabel="Partner végleges törlése" onConfirm={() => setLog('partner törölve')}>
              A partnerrel együtt törlődik 12 kupon és 3 időzítés (mintaadat). A felhasználók kuponjai érvénytelenné válnak.
            </TypeToConfirm>)}
          </Nyito>
        </Case>
        <Case id="type-hatas" title="A hatásvizsgálat nem töltött be → a gomb tiltott">
          <Nyito id="hatas" label="Tömeges törlés">{(o, s) => (
            <TypeToConfirm open={o} onOpenChange={s} count={15} title="Végleges törlés: 15 kupon" confirmLabel="15 kupon végleges törlése"
              impactLoading={impact === 'tolt'} impactError={impact === 'hiba' ? 'Nem sikerült összeszedni, mi törlődik még.' : undefined}
              onRetry={() => { setImpact('tolt'); setTimeout(() => setImpact('kesz'), 400); }} onConfirm={() => setLog('15 kupon törölve')}>
              {impact === 'kesz' ? 'Vele törlődik: 31 beváltás-előzmény (mintaadat).' : 'A törlés nem vonható vissza.'}
            </TypeToConfirm>)}
          </Nyito>
        </Case>
      </Grid>
      <Grid title="Oldalpanel (Drawer) – 3A">
        <Case id="drawer-url" title="Részletek saját URL-lel (?reszlet=…), a Vissza bezárja" wide>
          <ul className="bc-stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {['Zöld Sarok Bolt', 'Méhes Kávézó', 'Kerti Javító'].map((p, i) => (
              <li key={p} className="bc-row is-between"><span>{p} (mintaadat)</span><Button icon={<IcOpen />} variant="secondary" size="sm" data-open={`drawer-${i}`} onClick={() => setReszlet(String(i))}>Részletek</Button></li>
            ))}
          </ul>
          <Drawer open={reszlet !== null} onOpenChange={(o) => !o && setReszlet(null)} title={['Zöld Sarok Bolt', 'Méhes Kávézó', HOSSZU_CIM][Number(reszlet)] ?? 'Nincs ilyen elem'}
            description="Partner · mintaadat" footer={<><a href="#teljes">Teljes oldal</a><ModalCancel>Bezárás</ModalCancel><Button icon={<IcSave />}>Mentés</Button></>}>
            <p>Állapot: <span className="bc-badge is-success">Aktív</span></p>
            {Array.from({ length: 20 }, (_, i) => bekezdes(i))}
          </Drawer>
        </Case>
      </Grid>
    </>
  );
}

function Mentetlen({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const [v, setV] = useState('Méhes Kávézó');
  const dirty = v !== 'Méhes Kávézó';
  return (
    <Modal open={open} onOpenChange={(o) => { setOpen(o); if (!o) setV('Méhes Kávézó'); }} dirty={dirty} title="Partner átnevezése"
      footer={<><ModalCancel /><Button icon={<IcSave />} onClick={() => setOpen(false)}>Mentés</Button></>}>
      <TextField label="Partner neve" help="Így jelenik meg az appban a partner kártyáján." maxLength={60} value={v} onChange={(e) => setV(e.target.value)} />
    </Modal>
  );
}

function Folyamat({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const save = async () => { setBusy(true); setErr(''); await wait(600); setBusy(false); setErr('Nem sikerült menteni: lejárt a munkamenet. Jelentkezz be újra egy új lapon, aztán próbáld újra.'); };
  return (
    <Modal open={open} onOpenChange={setOpen} busy={busy} title="Kupon mentése"
      footer={<><ModalCancel disabled={busy} /><Button icon={<IcSave />} busy={busy} onClick={() => void save()}>Mentés</Button></>}>
      <p>Mentés közben az Esc, a ✕ és a háttérre kattintás nem zár be.</p>
      {err && <div className="bc-alert is-danger" role="alert"><p>{err}</p></div>}
    </Modal>
  );
}

function Beagyazott({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const [inner, setInner] = useState(false);
  return (
    <Modal open={open} onOpenChange={setOpen} title="Kép szerkesztése" footer={<ModalCancel>Kész</ModalCancel>}>
      <Button variant="secondary" data-open="belso" onClick={() => setInner(true)}>Kép vágása</Button>
      <Modal open={inner} onOpenChange={setInner} size="sm" title="Kép vágása" footer={<><ModalCancel /><Button onClick={() => setInner(false)}>Vágás</Button></>}>
        <p>Második szint: Esc csak ezt zárja be, a fókusz a „Kép vágása” gombra tér vissza.</p>
      </Modal>
    </Modal>
  );
}

mount('Rétegek – ablakok', 'Felugró ablak, megerősítés, begépelős végleges törlés és oldalpanel: fókusz, Esc, mentetlen változás, folyamatban, hiba, ablak az ablakban.', <Oldal />);
