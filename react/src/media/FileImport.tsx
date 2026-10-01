import { useId, useRef, useState, type ReactNode } from 'react';
import { Field } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { checkFiles, errorText, fileKey, isAbort, sizePair, type Rejection, type UploadFn } from './files';
import { IcFile } from './icons';
import { ImportResult, type ImportSummary } from './ImportResult';
import { Progress } from './Stepper';

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const XLS = 'application/vnd.ms-excel';

export type FileImportProps = {
  label: string;
  help: ReactNode;
  /** Az import (a projekt küldi a backendnek), a végén az eredmény soronként */
  importFile: UploadFn<ImportSummary>;
  maxSizeMB?: number;
  /** Régi .xls is jöhet? Alap: igen */
  allowXls?: boolean;
  /** A sablon letöltése (link) – ha van */
  template?: { href: string; label?: string };
  disabled?: boolean;
};

/**
 * FileImport (organizmus, Javaslat 04 – 5B, átmeneti: backend-próbaimport nélkül): egy lépés –
 * fájl kiválasztása (típus a tartalom szerint, méret) → feltöltés haladással → eredménylista (sor, oszlop, ok, teendő).
 */
export function FileImport({ label, help, importFile, maxSizeMB = 10, allowXls = true, template, disabled }: FileImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [result, setResult] = useState<ImportSummary | null>(null);
  const [rej, setRej] = useState<Rejection | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const ctrl = useRef<AbortController | null>(null);
  const lastKey = useRef<string | null>(null);
  const [dup, setDup] = useState<File | null>(null);
  const rejId = useId();
  const accept = allowXls ? [XLSX, XLS] : [XLSX];
  const busy = Boolean(file) && !result && !failed;

  const run = async (f: File) => {
    setFile(f); setLoaded(0); setResult(null); setFailed(null); setDup(null); lastKey.current = fileKey(f);
    const c = new AbortController(); ctrl.current = c;
    try { setResult(await importFile(f, { signal: c.signal, onProgress: setLoaded })); }
    catch (e) {
      if (isAbort(e)) { setFile(null); setRej({ file: f.name, reason: 'az importot megszakítottad', next: 'Semmi nem került be. Ha kell, kezdd újra.' }); return; }
      setFailed(errorText(e));
    }
  };
  const pick = async (list: FileList | null) => {
    if (!list?.length) return;
    const r = await checkFiles([list[0]], { accept, maxSizeMB, unit: 'fájl',
      typeHint: 'Nyisd meg az Excelben, és mentsd el „Excel-munkafüzet (.xlsx)” formátumban – a CSV és a Numbers nem jó.',
      sizeHint: 'Bontsd két fájlra (pl. 5 000 soronként), és töltsd fel egymás után.' });
    setRej(r.rejected[0] ?? null);
    // Ugyanaz a fájl kétszer: a sorok duplán kerülhetnek be – előbb rákérdezünk
    if (r.ok[0] && fileKey(r.ok[0]) === lastKey.current) { setFile(null); setResult(null); setDup(r.ok[0]); return; }
    if (r.ok[0]) void run(r.ok[0]);
  };
  const reset = () => { setFile(null); setResult(null); setFailed(null); setRej(null); };
  const sizeText = file ? sizePair(loaded, file.size) : '';

  return (
    <div className="bc-import">
      <Field label={label} help={help} disabled={disabled} range={`${allowXls ? '.xlsx vagy .xls' : '.xlsx'} · legfeljebb ${formatHu(maxSizeMB, 1)} MB · 1 fájl`}
        count={{ value: file ? 1 : 0, max: 1, unit: 'fájl' }}>
        <FieldInput>
          {(f) => !file ? (
            <label className="bc-dropzone" onDragOver={(e) => { if (!disabled) e.preventDefault(); }} onDrop={(e) => { e.preventDefault(); if (!disabled) void pick(e.dataTransfer.files); }}>
              <input id={f.id} type="file" className="bc-upload-input" disabled={disabled} accept={`.xlsx${allowXls ? ',.xls' : ''},${accept.join(',')}`}
                aria-describedby={[f.describedBy, rej && rejId].filter(Boolean).join(' ') || undefined} aria-invalid={rej ? true : undefined}
                onChange={(e) => { void pick(e.currentTarget.files); e.currentTarget.value = ''; }} />
              <IcFile /><strong>Excel-fájl kiválasztása</strong><span>vagy húzd ide</span>
            </label>
          ) : (
            <div className="bc-filecard" aria-busy={busy}>
              <div className="bc-filecard-row"><b>{file.name}</b><span className="bc-filecard-size">{sizeText}</span></div>
              {busy && <Progress value={loaded} max={file.size} label={`${file.name} importálása`} valueText={sizeText} />}
              <div className="bc-filecard-row" role="status">
                <span>{failed ? <span className="bc-error">{failed}</span> : busy ? (loaded >= file.size ? 'Feldolgozás – a sorokat ellenőrzöm…' : 'Feltöltés…') : 'Kész.'}</span>
                <span className="bc-row">
                  {busy && <Button variant="secondary" size="sm" onClick={() => ctrl.current?.abort()}>Megszakítás</Button>}
                  {failed && <Button variant="secondary" size="sm" onClick={() => void run(file)}>Újrapróbálás</Button>}
                  {!busy && <Button variant="ghost" size="sm" onClick={reset}>Másik fájl</Button>}
                </span>
              </div>
            </div>
          )}
        </FieldInput>
      </Field>
      {dup && (
        <div className="bc-alert is-warning" role="alert">
          <div><p><strong>Ezt a fájlt ({dup.name}) az imént már importáltad.</strong> Ha újra beküldöd, a sorok kétszer kerülhetnek be.</p>
            <div className="bc-row"><Button variant="secondary" size="sm" onClick={() => void run(dup)}>Mégis importálom</Button><Button variant="ghost" size="sm" onClick={() => setDup(null)}>Mégse</Button></div></div>
        </div>
      )}
      {rej && <p className="bc-error" id={rejId} role="alert"><b>{rej.file}</b> – {rej.reason}. {rej.next}</p>}
      {template && !file && <p className="bc-help"><a href={template.href} download>{template.label ?? 'Sablon letöltése (.xlsx)'}</a> – ebbe írd az adatokat, a fejlécet ne módosítsd.</p>}
      {result && <ImportResult result={result} fileName={`${file?.name.replace(/\.[^.]+$/, '') ?? 'import'}-hibalista.csv`} />}
    </div>
  );
}
