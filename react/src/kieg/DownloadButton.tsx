import { useEffect, useRef, useState } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { formatHu } from '../inputs/number';
import { HexLoader, ProgressBar } from '../meh/motion';
import { say } from '../meh/say';
import { CheckIcon, DownloadIcon, RetryIcon } from './icons';

export type DownloadContext = {
  /** Haladás 0–1 (ha a szerver jelzi); ha soha nem hívod, mézsejt-töltő látszik */
  progress: (value: number) => void;
  /** A „Megszakítás” gomb ezt jelzi – add tovább a fetch-nek */
  signal: AbortSignal;
};

export type DownloadButtonProps = {
  /** Mit tölt le, a gomb felirata: „Excel-export”, „Lista letöltése” */
  label: string;
  /** A mentett fájl neve: „partnerek-2026-10-01.xlsx” */
  fileName: string;
  /** Becsült méret letöltés előtt, ha tudható: „kb. 40 KB” */
  sizeHint?: string;
  /** Elkészíti a fájlt. Ha Blob-ot ad vissza, a gomb menti; ha semmit, a hívó intézte a mentést. Hiba → „Újra”. */
  onDownload: (ctx: DownloadContext) => Promise<Blob | void>;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
};

type State = 'idle' | 'busy' | 'done' | 'error';

/** Bájt → „24,5 KB” / „1,2 MB” */
export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${formatHu(n / 1024, 1)} KB`;
  return `${formatHu(n / 1024 / 1024, 1)} MB`;
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.style.display = 'none';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * DownloadButton (molekula, Javaslat 06a/3): kész → készül (haladás, megszakítható) → letöltve (pipa, méret) → hiba (újra).
 * Fájlnév és méret mindig látszik; készülés közben a gomb nem nyomható kétszer; 10 mp után türelmet kér.
 */
export function DownloadButton({ label, fileName, sizeHint, onDownload, variant = 'secondary', disabled, className }: DownloadButtonProps) {
  const [state, setState] = useState<State>('idle');
  const [progress, setProgress] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [slow, setSlow] = useState(false);
  const [stopped, setStopped] = useState(false);
  const ctrl = useRef<AbortController | null>(null);
  useEffect(() => () => ctrl.current?.abort(), []);
  useEffect(() => {
    if (state !== 'busy') return;
    const t = window.setTimeout(() => setSlow(true), 10_000);
    return () => window.clearTimeout(t);
  }, [state]);

  const run = async () => {
    if (state === 'busy') return;
    const c = new AbortController(); ctrl.current = c;
    setState('busy'); setProgress(null); setSlow(false); setStopped(false);
    try {
      const blob = await onDownload({ progress: (v) => !c.signal.aborted && setProgress(Math.max(0, Math.min(1, v))), signal: c.signal });
      if (c.signal.aborted) return;
      if (blob) { save(blob, fileName); setSize(blob.size); } else setSize(null);
      setState('done');
    } catch {
      if (!c.signal.aborted) setState('error');
    }
  };
  const cancel = () => { ctrl.current?.abort(); setState('idle'); setStopped(true); };

  const pct = progress === null ? null : Math.round(progress * 100);
  const text = state === 'busy' ? 'Készül' : state === 'done' ? 'Letöltve' : state === 'error' ? 'Újra' : label;
  const icon = state === 'done' ? <span className="bc-anim-tick bc-copy-tick"><CheckIcon /></span> : state === 'error' ? <RetryIcon /> : <DownloadIcon />;

  return (
    <div className={cx('bc-download', className)} data-state={state}>
      <div className="bc-row">
        <Button variant={variant} icon={icon} busy={state === 'busy'} disabled={disabled} onClick={run}
          aria-label={`${text}: ${fileName}`}>{text}</Button>
        {state === 'busy' && <Button variant="ghost" size="sm" onClick={cancel}>Megszakítás</Button>}
      </div>
      <div className="bc-download-meta" role="status">
        {state === 'idle' && <span>{fileName}{sizeHint ? ` · ${sizeHint}` : ''}{stopped ? ' · megszakítottad, bármikor újrakezdheted' : ''}</span>}
        {state === 'busy' && (
          <>
            {pct === null ? <HexLoader label={`Készül: ${fileName}`} /> : <ProgressBar value={progress ?? 0} label={`Készül: ${fileName}`} moving />}
            <span>Készül: {fileName}{pct === null ? '…' : ` · ${pct}%`}</span>
            {slow && <span className="bc-download-slow">{say('toltes-hosszu').sima}</span>}
          </>
        )}
        {state === 'done' && <span>Letöltve: {fileName}{size !== null ? ` · ${formatBytes(size)}` : ''}</span>}
        {state === 'error' && <span className="bc-error" role="alert">Nem sikerült elkészíteni a fájlt ({fileName}). Ellenőrizd a kapcsolatot, és próbáld újra.</span>}
      </div>
    </div>
  );
}
