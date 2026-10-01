import { useState, type ReactElement } from 'react';
import { Accordion, Button, DropdownMenu, RowActions, TooltipIconButton, type RowAction } from '../src';
import { Case, Grid, mount } from './_keret';

const Toll = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>;
const Kuka = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" /></svg>;
const Masol = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="1" /><path d="M16 8V4H4v12h4" /></svg>;
const Doboz = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 7h18v4H3zM5 11v9h14v-9M10 15h4" /></svg>;
const Panel = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M14 4v16" /></svg>;

function Oldal() {
  const [log, setLog] = useState('még semmi');
  const act = (label: string, icon: ReactElement, extra: Partial<RowAction> = {}): RowAction => ({ label, icon, onSelect: () => setLog(label), ...extra });
  const ot = [act('Szerkesztés', <Toll />), act('Megnyitás oldalpanelben', <Panel />), act('Törlés…', <Kuka />, { danger: true }), act('Másolat készítése', <Masol />),
    act('Archiválás', <Doboz />, { disabled: true, disabledReason: 'Aktív kupon mellett nem archiválható' })];
  return (
    <>
      <p className="tl-out" data-out="log">utolsó: {log}</p>
      <Grid title="Legördülő menü (DropdownMenu) – 5A">
        <Case id="menu-profil" title="Profil-menü: név + szerep, Kijelentkezés alul">
          <div className="bc-row is-end">
            <DropdownMenu label="Profil" header={<><strong>Kovács Kata</strong><span className="bc-muted">admin · kata@example.com</span></>}
              trigger={<Button variant="secondary" size="sm">Kata K.</Button>}
              items={[{ label: 'Profilom', onSelect: () => setLog('Profilom') }, { label: 'Beállítások', shortcut: 'Ctrl+,', onSelect: () => setLog('Beállítások') }, 'separator', { label: 'Kijelentkezés', onSelect: () => setLog('Kijelentkezés') }]} />
          </div>
        </Case>
        <Case id="menu-al" title="Almenü, csoportcím, tiltott elem indoklással">
          <DropdownMenu label="Exportálás" trigger={<Button variant="secondary">Exportálás</Button>}
            items={[{ group: 'Formátum' }, { label: 'Excel (.xlsx)', onSelect: () => setLog('Excel') },
              { label: 'Más formátum', items: [{ label: 'CSV', onSelect: () => setLog('CSV') }, { label: 'JSON', onSelect: () => setLog('JSON') }] },
              { label: 'PDF', disabled: true, disabledReason: 'Ehhez admin jogosultság kell' }]} />
        </Case>
        <Case id="menu-hosszu" title="Nagyon hosszú felirat">
          <DropdownMenu label="Programok" trigger={<Button variant="secondary">Programok</Button>}
            items={[{ label: 'Fenntartható Belváros Kezdeményezés 2026 – őszi kupon- és javítóhét partnerprogram (mintaadat)', onSelect: () => setLog('hosszú') }, { label: 'Rövid', onSelect: () => setLog('rövid') }]} />
        </Case>
      </Grid>
      <Grid title="Sor-műveletek (RowActions): ≤ 2 → ikongombok, 3+ → fő művelet + „⋯”">
        <Case id="sor-egy" title="1 művelet"><div className="bc-row is-between"><span>Zöld Sarok Bolt (mintaadat)</span><RowActions rowLabel="Zöld Sarok Bolt" actions={ot.slice(0, 1)} /></div></Case>
        <Case id="sor-ketto" title="2 művelet (egy veszélyes)"><div className="bc-row is-between"><span>Bio Piac (mintaadat)</span><RowActions rowLabel="Bio Piac" actions={[ot[0], ot[2]]} /></div></Case>
        <Case id="sor-sok" title="5 művelet: törlés alul, elválasztva; tiltott indoklással"><div className="bc-row is-between"><span>Méhes Kávézó (mintaadat)</span><RowActions rowLabel="Méhes Kávézó" actions={ot} /></div></Case>
        <Case id="tooltip" title="Gomb-felirat (Tooltip) csak ikongombon">
          <div className="bc-row"><TooltipIconButton label="Szerkesztés" onClick={() => setLog('ikon: Szerkesztés')}><Toll /></TooltipIconButton>
            <TooltipIconButton label="Másolat készítése"><Masol /></TooltipIconButton><TooltipIconButton label="Törlés" danger><Kuka /></TooltipIconButton></div>
        </Case>
      </Grid>
      <Grid title="Lenyitható (Accordion)">
        <Case id="acc-egy" title="Egyszerre egy nyitva">
          <Accordion items={[{ value: 'kapcs', title: 'Kapcsolattartó', content: 'Név, e-mail, telefon (mintaadat).' },
            { value: 'szamla', title: 'Számlázási adatok', content: 'Cégnév, adószám, cím (mintaadat).' },
            { value: 'belso', title: 'Belső megjegyzés (csak adminnak)', content: 'Nem jelenik meg a partnernek.', disabled: true }]} defaultValue="kapcs" />
        </Case>
        <Case id="acc-tobb" title="Több is nyitva, hosszú cím és tartalom">
          <Accordion type="multiple" items={[{ value: 'a', title: 'Fenntartható Belváros Kezdeményezés 2026 – őszi kupon- és javítóhét partnerprogram részletei (mintaadat)', content: 'Hosszú tartalom '.repeat(30) },
            { value: 'b', title: 'Hogyan olvasd?', content: 'Rövid értelmezési segédlet 2–4 mondatban.' }]} />
        </Case>
      </Grid>
      <Grid title="Menü a képernyő alján (felfelé nyílik)">
        <Case id="menu-alul" title="Alul" wide>
          <div style={{ minHeight: '40vh' }} />
          <div className="bc-row is-between"><span>Utolsó sor (mintaadat)</span><RowActions rowLabel="Utolsó sor" actions={ot} /></div>
        </Case>
      </Grid>
    </>
  );
}

mount('Rétegek – menük', 'Legördülő menü (profil, almenü, tiltott elem), sor-műveletek szabálya, gomb-felirat és lenyitható.', <Oldal />);
