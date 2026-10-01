import { useRef, useState } from 'react';
import { Button, ErrorPage, ForbiddenPage, NotFoundPage, OfflineBanner, OfflinePage, SessionExpired, TextField, UnsavedChangesGuard, useUnsavedChanges, IcSave } from '../src';
import { Case, Grid, mount } from './_keret';

// 06a – oldalak és őrök: állapot-oldalak (BeeMoment), offline sáv, mentetlen változások (mintaadat)
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Hiba() {
  const [busy, setBusy] = useState(false);
  const [n, setN] = useState(0);
  return <><ErrorPage errorId="E-7F3A-21" retrying={busy} homeHref="#kezdolap" onRetry={async () => { setBusy(true); await wait(500); setBusy(false); setN((x) => x + 1); }} /><p className="tl-out" data-out="retry">újrapróbálás: {n}</p></>;
}
function Tiltott() {
  const [kert, setKert] = useState(false);
  return <ForbiddenPage homeHref="#kezdolap" onRequestAccess={() => setKert(true)} requested={kert} />;
}
function Offline() {
  const [kezi, setKezi] = useState<boolean | undefined>(undefined);
  return (
    <>
      <div className="bc-row">
        <Button size="sm" variant="secondary" onClick={() => setKezi(false)}>Kapcsolat elvesztése (szimuláció)</Button>
        <Button size="sm" variant="secondary" onClick={() => setKezi(true)}>Kapcsolat vissza</Button>
      </div>
      <OfflineBanner online={kezi} pending={3} onRetry={() => undefined} />
      <p className="tl-out">A sáv a böngésző jelzésére is reagál (repülőgép-mód). 3 módosítás vár mentésre (mintaadat).</p>
    </>
  );
}

/** Szerkesztő oldal mintája: ha a név változott, linkre kattintás és „Mégse” előtt kérdez */
function Szerkeszto() {
  const [nev, setNev] = useState('Zöld Sarok Bolt');
  const [mentett, setMentett] = useState('Zöld Sarok Bolt');
  const [oldal, setOldal] = useState('Partner szerkesztése');
  const dirty = nev !== mentett;
  const saved = useRef(mentett); saved.current = mentett;
  const save = async () => { await wait(300); setMentett(nev); saved.current = nev; };
  const kezi = useUnsavedChanges(dirty, { onSave: save });
  // „Router”: a link saját kezelője (preventDefault + állapot), ahogy egy SPA-ban
  const go = (cel: string) => (e: React.MouseEvent) => { e.preventDefault(); setOldal(cel); setNev(mentett); };
  return (
    <>
      <UnsavedChangesGuard dirty={dirty} onSave={save} />
      {kezi.dialog}
      <p className="tl-out" data-out="oldal">Jelenlegi oldal: {oldal} · {dirty ? 'nem mentett változás van' : 'minden mentve'}</p>
      <TextField label="Partner neve" help="Így jelenik meg az appban (mintaadat)." maxLength={60} value={nev} onChange={(e) => setNev(e.target.value)} />
      <div className="bc-row">
        <a className="bc-btn is-ghost is-sm" href="/partnerek" onClick={go('Partnerek listája')} data-link="lista">Vissza a listához</a>
        <a className="bc-btn is-ghost is-sm" href="#szerkeszto" data-link="horgony">Horgony (nem kérdez)</a>
        <Button variant="secondary" size="sm" onClick={() => kezi.confirm(() => { setNev(saved.current); setOldal('Mégse – visszaállítva'); })}>Mégse</Button>
        <Button icon={<IcSave />} size="sm" disabled={!dirty} onClick={() => void save()}>Mentés</Button>
      </div>
    </>
  );
}

function Oldal() {
  return (
    <>
      <Grid title="Mentetlen változások (UnsavedChangesGuard)">
        <Case id="mentetlen" title="Szerkesztő oldal mintája" wide><Szerkeszto /></Case>
      </Grid>
      <Grid title="Offline sáv (OfflineBanner)">
        <Case id="offline-sav" title="Sáv, szimulálható" wide><Offline /></Case>
        <Case id="offline-meh-nelkul" title="Méh nélkül (ha az oldalon már van méh)"><OfflineBanner online={false} bee={false} /></Case>
      </Grid>
      <Grid title="Állapot-oldalak (sablon)">
        <Case id="oldal-404" title="404 – nincs ilyen oldal" wide><NotFoundPage homeHref="#kezdolap" /></Case>
        <Case id="oldal-403" title="403 – nincs jogosultság" wide><Tiltott /></Case>
        <Case id="oldal-500" title="Szerverhiba (a mi hibánk)" wide><Hiba /></Case>
        <Case id="oldal-lejart" title="Lejárt munkamenet" wide><SessionExpired loginHref="#belepes" /></Case>
        <Case id="oldal-offline" title="Nincs internet (egész oldal)" wide><OfflinePage onRetry={() => undefined} /></Case>
      </Grid>
    </>
  );
}

mount('Kiegészítők – oldalak és őrök', 'Állapot-oldalak méhecskével (szóvicc + sima jelentés), offline sáv és a mentetlen változások őre. Szóvicc csak a méh mellett – gombban, teendőben, megerősítésben soha.', <Oldal />);
