import { useRef, useState } from 'react';
import { FileImport, FilePicker, ImportResult, Stepper, VideoUpload, type ImportIssue, type ImportSummary } from '../src/media';
import { Case, Grid, mount } from './_keret';
import { fakeUpload } from './_media-minta';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const VHELP = 'A rövid bemutató videó a hely oldalán jelenik meg az appban. Fekvő, 30–60 másodperces videó a legjobb, hang nélkül is érthető legyen.';
const XHELP = 'A sablonba írt partnereket egyszerre veszi fel a rendszer. A hibás sorok kimaradnak – a lista megmondja, melyik sor, melyik oszlop és mit javíts.';

/** Minta-hibalista (mintaadat): sor + oszlop + ok + teendő */
const ISSUES: ImportIssue[] = [
  { row: 14, column: 'Irányítószám', reason: '„11O5” – betű van benne (O a 0 helyett?)', next: 'Javítsd: 1105.', level: 'error' },
  { row: 27, column: 'Név', reason: 'üres, pedig kötelező', next: 'Írd be a partner nevét.', level: 'error' },
  { row: 61, column: 'Nyitvatartás', reason: 'nem értelmezhető („reggeltől estig”), üresen került be', next: 'Írd így: H–P 8:00–18:00.', level: 'warning' },
  { row: 88, column: 'Weboldal', reason: 'nagyonhosszuweboldalcimszokozoknelkul.example.hu/egy/nagyon/hosszu/utvonal/ami/nem/fer/ki/egy/sorba – a cím nem érhető el', next: 'Ellenőrizd a címet a böngészőben.', level: 'error' },
];
const many = (n: number): ImportIssue[] => Array.from({ length: n }, (_, i) => ({ row: i + 2, column: 'Kategória', reason: 'ismeretlen kategória', next: 'Válassz a sablon listájából.', level: i % 5 ? 'error' : 'warning' }));

/** Hamis import: a fájlnév dönti el az eredményt (mintaadat) */
const importFake = fakeUpload<ImportSummary>((f) => {
  if (/ures/.test(f.name)) return { total: 0, imported: 0, issues: [] };
  if (/rendben/.test(f.name)) return { total: 128, imported: 128, issues: [] };
  if (/csak-sorszam/.test(f.name)) return { total: 124, imported: 121, issues: [14, 27, 61].map((row) => ({ row, level: 'error' as const })) };
  if (/sok/.test(f.name)) return { total: 12000, imported: 10800, issues: many(1200) };
  if (/szerverhiba/.test(f.name)) throw new Error('A szerver nem válaszolt időben. Próbáld újra pár perc múlva – addig semmi nem került be.');
  return { total: 128, imported: 125, issues: ISSUES };
}, 100);

function Import({ id }: { id: string }) {
  const [last, setLast] = useState('–');
  return <><FileImport label="Partnerek Excelből" help={XHELP} maxSizeMB={2} template={{ href: '#sablon' }}
    importFile={async (f, ctx) => { const r = await importFake(f, ctx); setLast(`${r.imported}/${r.total}`); return r; }} />
    <p className="tl-out" data-out={id}>utolsó import: {last}</p></>;
}
function Video({ id, procFailsOnce }: { id: string; procFailsOnce?: boolean }) {
  const [done, setDone] = useState('–');
  const failed = useRef(false);
  return <><VideoUpload label="Bemutató videó" help={VHELP} maxSizeMB={3} upload={fakeUpload<void>(() => undefined, 100)}
    process={async () => { await wait(300); if (procFailsOnce && !failed.current) { failed.current = true; throw new Error('A feldolgozás elakadt.'); } }}
    onDone={(f) => setDone(f.name)} />
    <p className="tl-out" data-out={id}>kész: {done}</p></>;
}

const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
/** FilePicker (Javaslat 18): csak kiválaszt, nem tölt fel – a kiválasztott fájl neve a kimenetben */
function Picker({ id, busy }: { id: string; busy?: boolean }) {
  const [f, setF] = useState<File | null>(null);
  return <><FilePicker label="Kitöltött sablon" help="A kitöltött Excel-sablon. A feltöltést az ablak „Feltöltés” gombja indítja." value={f} onChange={setF}
    accept={[XLSX_MIME]} acceptAttr=".xlsx" maxSizeMB={2} warnSizeMB={1} formatText=".xlsx" busy={busy}
    typeHint="Nyisd meg az Excelben, és mentsd el „Excel-munkafüzet (.xlsx)” formátumban." sizeHint="Bontsd több fájlra." required />
    <p className="tl-out" data-out={id}>kiválasztva: {f ? f.name : '–'}</p></>;
}

function Oldal() {
  return (
    <>
      <Grid title="Lépésjelző">
        <Case id="lepes" title="Minden állapot: kész · folyamatban · hátravan · hiba">
          <Stepper label="Példa" steps={[{ id: 'a', label: 'Fájl', state: 'done' }, { id: 'b', label: 'Feltöltés', state: 'current' }, { id: 'c', label: 'Feldolgozás', state: 'todo' }, { id: 'd', label: 'Kész', state: 'todo' }]} />
          <Stepper label="Példa hibával" steps={[{ id: 'a', label: 'Fájl', state: 'done' }, { id: 'b', label: 'Feltöltés', state: 'done' }, { id: 'c', label: 'Feldolgozás', state: 'error' }, { id: 'd', label: 'Kész', state: 'todo' }]} />
        </Case>
      </Grid>
      <Grid title="Videófeltöltés (4)">
        <Case id="video" title="MP4, legfeljebb 3 MB"><Video id="video" /></Case>
        <Case id="video-proc" title="A feldolgozás elsőre hibázik"><Video id="videoproc" procFailsOnce /></Case>
      </Grid>
      <Grid title="Fájlválasztó feltöltés nélkül (Javaslat 18)">
        <Case id="picker" title="Egy .xlsx – kiválasztás, csere, rossz típus, nagy fájl"><Picker id="picker" /></Case>
        <Case id="picker-busy" title="Feltöltés közben (a Másik fájl tiltva)"><Picker id="pickerbusy" busy /></Case>
      </Grid>
      <Grid title="Excel-import (5B: egy lépés, jobb eredménylista)">
        <Case id="import" title="Import – a fájlnév dönti el az eredményt (mintaadat)" wide><Import id="import" /></Case>
        <Case id="eredmeny-hibak" title="Eredmény: hibák + figyelmeztetés" wide><ImportResult result={{ total: 128, imported: 125, issues: ISSUES }} /></Case>
        <Case id="eredmeny-sorszam" title="A backend csak sorszámot ad (ok nélkül)"><ImportResult result={{ total: 124, imported: 121, issues: [14, 27, 61].map((row) => ({ row, level: 'error' as const })) }} /></Case>
        <Case id="eredmeny-rendben" title="Minden rendben"><ImportResult result={{ total: 128, imported: 128, issues: [] }} /></Case>
        <Case id="eredmeny-ures" title="Csak fejléc (0 sor)"><ImportResult result={{ total: 0, imported: 0, issues: [] }} /></Case>
        <Case id="eredmeny-semmi" title="Egy sor sem került be"><ImportResult result={{ total: 3, imported: 0, issues: ISSUES.slice(0, 3) }} /></Case>
        <Case id="eredmeny-sok" title="12 000 sor, 1 200 hiba (az első 200 látszik)" wide><ImportResult result={{ total: 12000, imported: 10800, issues: many(1200) }} /></Case>
      </Grid>
    </>
  );
}
mount('Média – videó és import', 'Lépésjelző, videófeltöltés (fájl → feltöltés → feldolgozás → kész), Excel-import egy lépésben, eredménylista sorral, oszloppal, okkal és teendővel. Minden adat mintaadat.', <Oldal />);
