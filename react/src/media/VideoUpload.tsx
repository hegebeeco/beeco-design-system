import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Field } from '../field/Field';
import { FieldInput } from '../field/FieldInput';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { checkFiles, errorText, isAbort, sizePair, type Rejection, type UploadFn } from './files';
import { IcFile } from './icons';
import { Progress, Stepper, stepsFrom } from './Stepper';

export type VideoUploadProps = {
  label: string;
  help: ReactNode;
  /** Feltöltés (haladással, megszakítható) – a projekt adja */
  upload: UploadFn<void>;
  /** Feldolgozás a feltöltés után (pl. átkódolás, regisztráció); hiba esetén a feltöltés megmarad, csak ez ismételhető */
  process?: () => Promise<void>;
  onDone?: (file: File) => void;
  maxSizeMB?: number;
  disabled?: boolean;
};

const STEPS = [{ id: 'file', label: 'Fájl' }, { id: 'up', label: 'Feltöltés' }, { id: 'proc', label: 'Feldolgozás' }, { id: 'done', label: 'Kész' }];
type Phase = 'file' | 'up' | 'proc' | 'done';

/** VideoUpload (organizmus, Javaslat 04 – 4): fájl → feltöltés → feldolgozás → kész. Csak MP4 (a tartalom szerint), méret-határ, megszakítás, újrapróbálás. */
export function VideoUpload({ label, help, upload, process, onDone, maxSizeMB = 25, disabled }: VideoUploadProps) {
  const [phase, setPhase] = useState<Phase>('file');
  const [file, setFile] = useState<File | null>(null);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState<string | null>(null);
  const [rej, setRej] = useState<Rejection | null>(null);
  const [eta, setEta] = useState<string>();
  const ctrl = useRef<AbortController | null>(null);
  const rejId = useId();

  // Feltöltés közben a lap elhagyása előtt a böngésző rákérdez
  useEffect(() => {
    if (phase !== 'up') return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    addEventListener('beforeunload', warn);
    return () => removeEventListener('beforeunload', warn);
  }, [phase]);
  useEffect(() => () => ctrl.current?.abort(), []);

  const runProcess = async (f: File) => {
    setPhase('proc'); setFailed(null);
    try { await process?.(); setPhase('done'); onDone?.(f); }
    catch (e) { setFailed(`${errorText(e)} A videó fent van, csak a feldolgozást kell újrakezdeni.`); }
  };
  const runUpload = async (f: File) => {
    setPhase('up'); setLoaded(0); setFailed(null); setEta(undefined);
    const c = new AbortController(); ctrl.current = c;
    const t0 = performance.now();
    try {
      await upload(f, { signal: c.signal, onProgress: (n) => {
        setLoaded(n);
        const rate = n / Math.max(1, performance.now() - t0); // bájt / ms
        if (n > 0 && rate > 0) setEta(`kb. ${Math.max(1, Math.round((f.size - n) / rate / 1000))} mp van hátra`);
      } });
      await runProcess(f);
    } catch (e) {
      if (isAbort(e)) { setPhase('file'); setFile(null); setRej({ file: f.name, reason: 'a feltöltést megszakítottad', next: 'Ha mégis kell, válaszd ki újra.' }); return; }
      setFailed(errorText(e));
    }
  };
  const pick = async (list: FileList | null) => {
    if (!list?.length) return;
    const r = await checkFiles([list[0]], { accept: ['video/mp4'], maxSizeMB, unit: 'videó',
      typeHint: 'Alakítsd át MP4-re (pl. egy videószerkesztővel vagy a telefon exportjával), és töltsd fel újra.', sizeHint: 'Rövidítsd vagy tömörítsd a videót, és próbáld újra.' });
    setRej(r.rejected[0] ?? null);
    if (r.ok[0]) { setFile(r.ok[0]); void runUpload(r.ok[0]); }
  };
  const reset = () => { setPhase('file'); setFile(null); setFailed(null); setRej(null); setLoaded(0); };
  const cur = { file: 0, up: 1, proc: 2, done: 3 }[phase];
  const sizeText = file ? sizePair(loaded, file.size) : '';

  return (
    <div className="bc-video">
      <Stepper label="A videófeltöltés lépései" steps={stepsFrom(STEPS, phase === 'done' ? 4 : cur, Boolean(failed))} />
      <Field label={label} help={help} disabled={disabled} range={`MP4 · legfeljebb ${formatHu(maxSizeMB, 1)} MB · 1 videó`}
        count={{ value: file && phase !== 'file' ? 1 : 0, max: 1, unit: 'videó' }}>
        <FieldInput>
          {(f) => phase === 'file' ? (
            <label className="bc-dropzone" onDragOver={(e) => { if (!disabled) e.preventDefault(); }} onDrop={(e) => { e.preventDefault(); if (!disabled) void pick(e.dataTransfer.files); }}>
              <input id={f.id} type="file" accept="video/mp4" className="bc-upload-input" disabled={disabled} aria-describedby={[f.describedBy, rej && rejId].filter(Boolean).join(' ') || undefined}
                aria-invalid={rej ? true : undefined} onChange={(e) => { void pick(e.currentTarget.files); e.currentTarget.value = ''; }} />
              <IcFile /><strong>Videó kiválasztása</strong><span>vagy húzd ide a fájlt</span>
            </label>
          ) : (
            <div className="bc-filecard" aria-busy={phase === 'up' || phase === 'proc'}>
              <div className="bc-filecard-row"><b>{file?.name}</b><span className="bc-filecard-size">{sizeText}</span></div>
              {phase === 'up' && <Progress value={loaded} max={file?.size ?? 1} label={`${file?.name} feltöltése`} valueText={sizeText} />}
              <div className="bc-filecard-row" role="status">
                <span>{failed ? <span className="bc-error">{failed}</span> : phase === 'up' ? `${Math.round((loaded / (file?.size || 1)) * 100)}%${eta ? ` · ${eta}` : ''}` : phase === 'proc' ? <><span className="bc-spinner" aria-hidden="true" /> Feldolgozás… ez eltarthat pár percig.</> : 'Kész – a videó fent van.'}</span>
                <span className="bc-row">
                  {phase === 'up' && !failed && <Button variant="secondary" size="sm" onClick={() => ctrl.current?.abort()}>Megszakítás</Button>}
                  {failed && <Button variant="secondary" size="sm" onClick={() => file && (phase === 'proc' ? void runProcess(file) : void runUpload(file))}>Újrapróbálás</Button>}
                  {(failed || phase === 'done') && <Button variant="ghost" size="sm" onClick={reset}>{phase === 'done' ? 'Másik videó' : 'Mégse'}</Button>}
                </span>
              </div>
            </div>
          )}
        </FieldInput>
      </Field>
      {rej && <p className="bc-error" id={rejId} role="alert"><b>{rej.file}</b> – {rej.reason}. {rej.next}</p>}
    </div>
  );
}
