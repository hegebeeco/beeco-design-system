import { useRef, useState } from 'react';
import { TextField } from '../inputs/TextField';
import { Button } from '../inputs/Button';
import { norm } from '../pickers/normalize';
import { ConfirmDialog, type ConfirmDialogProps } from './ConfirmDialog';

export type TypeToConfirmProps = Omit<ConfirmDialogProps, 'confirmDisabled' | 'extra' | 'initialFocus' | 'danger'> & {
  /** Tömeges törlés: a darabszámot kell begépelni (a név tömegesen értelmetlen) */
  count?: number;
  /** Egyetlen elem: a nevét kell begépelni (kis-nagybetű, ékezet és dupla szóköz nem számít) */
  name?: string;
  /** A mező címkéje, pl. „Írd be a törlendő POI-k számát” */
  prompt?: string;
  /** A hatásvizsgálat (mi törlődik még) töltődik – addig a gomb tiltott */
  impactLoading?: boolean;
  /** A hatásvizsgálat nem töltött be – a gomb tiltott, „Újrapróbálás” */
  impactError?: string;
  onRetry?: () => void;
};

const same = (a: string, b: string, isCount: boolean) =>
  isCount ? a.replace(/\s/g, '') === b : norm(a.trim().replace(/\s+/g, ' ')) === norm(b.trim().replace(/\s+/g, ' '));

/**
 * TypeToConfirm (organizmus, Javaslat 03 – 2A): veszélyes tömeges vagy másokat érintő végleges törlés.
 * Mikor? 10-nél több elem végleges törlése, vagy ami másokat is érint. Egy elem sima törlésére a ConfirmDialog elég.
 * A gomb addig tiltott, amíg a begépelt érték nem egyezik; a fókusz a mezőn indul (a gomb úgyis tiltott).
 */
export function TypeToConfirm({ count, name, prompt, impactLoading, impactError, onRetry, open, onOpenChange, ...rest }: TypeToConfirmProps) {
  const [typed, setTyped] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const isCount = count !== undefined;
  const expected = isCount ? String(count) : name ?? '';
  const match = expected !== '' && same(typed, expected, isCount);
  const label = prompt ?? (isCount ? 'Írd be a törlendő elemek számát' : 'Írd be a nevét');

  return (
    <ConfirmDialog size="md" {...rest} open={open} danger
      onOpenChange={(o) => { if (!o) setTyped(''); onOpenChange(o); }}
      confirmDisabled={!match || impactLoading || Boolean(impactError)}
      initialFocus={() => input.current}
      extra={
        <div className="bc-stack">
          {impactLoading && <p className="bc-muted" role="status"><span className="bc-spinner" aria-hidden="true" /> Összeszedem, mi törlődik még vele…</p>}
          {impactError && (
            <div className="bc-alert is-danger" role="alert">
              <p>{impactError} Amíg nem látod, mi törlődik vele, nem törölhetsz.</p>
              {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Újrapróbálás</Button>}
            </div>
          )}
          <TextField ref={input} label={label} inputMode={isCount ? 'numeric' : 'text'} autoComplete="off" spellCheck={false}
            help="Így ellenőrizzük, hogy tényleg ezt akarod. A végleges törlés nem vonható vissza."
            range={`Ezt írd be: ${expected}`} value={typed} onChange={(e) => setTyped(e.target.value)}
            notice={match ? 'Egyezik – most már törölhetsz.' : undefined} />
        </div>
      } />
  );
}
