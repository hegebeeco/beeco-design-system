import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../inputs/Button';
import { KiegDialog } from './KiegDialog';

export type UnsavedChangesDialogProps = {
  open: boolean;
  /** „Maradok” / Esc: vissza a szerkesztéshez */
  onStay: () => void;
  /** „Elvetés és továbblépés” */
  onLeave: () => void;
  /** Ha van: „Mentés és továbblépés” – ígéretet adhat; közben a gomb pörög, hiba esetén az ablak marad és kiírja */
  onSave?: () => void | Promise<void>;
  title?: string;
  children?: ReactNode;
};

/**
 * UnsavedChangesDialog (molekula, Javaslat 06a/5): kíméletes kérdés, szóvicc nélkül.
 * A fókusz a „Maradok” gombon indul – véletlen Enter nem dob el semmit.
 */
export function UnsavedChangesDialog({ open, onStay, onLeave, onSave, title = 'Nem mentett változásaid vannak', children }: UnsavedChangesDialogProps) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>();
  useEffect(() => { if (!open) { setBusy(false); setErr(undefined); } }, [open]);
  const save = async () => {
    if (!onSave || busy) return;
    setErr(undefined);
    try { const r = onSave(); if (r instanceof Promise) { setBusy(true); await r; } setBusy(false); onLeave(); }
    catch (e) { setBusy(false); setErr(`Nem sikerült menteni${e instanceof Error && e.message ? `: ${e.message}` : ''}. Próbáld újra, vagy maradj az oldalon.`); }
  };
  return (
    <KiegDialog open={open} onCancel={() => { if (!busy) onStay(); }} title={title}
      actions={<>
        <Button variant="secondary" data-autofocus disabled={busy} onClick={onStay}>Maradok</Button>
        <Button variant={onSave ? 'secondary' : 'danger'} disabled={busy} onClick={onLeave}>Elvetés és továbblépés</Button>
        {onSave && <Button busy={busy} onClick={() => void save()}>Mentés és továbblépés</Button>}
      </>}>
      {children ?? <p>Ha most továbblépsz, a módosításaid elvesznek. Maradj, ha még menteni szeretnéd őket.</p>}
      {err && <div className="bc-alert is-danger" role="alert"><p>{err}</p></div>}
    </KiegDialog>
  );
}

export type UseUnsavedChangesOptions = { onSave?: () => void | Promise<void>; title?: string; text?: ReactNode };

/**
 * useUnsavedChanges(dirty) – útválasztó-független őr:
 * - amíg dirty, a böngésző bezárás/frissítés előtt rákérdez (beforeunload);
 * - confirm(tovább) a saját navigációhoz: ha nincs változás, azonnal továbblép, különben előbb kérdez;
 * - dialog: ezt tedd ki az oldalra.
 */
export function useUnsavedChanges(dirty: boolean, opts: UseUnsavedChangesOptions = {}) {
  const [pending, setPending] = useState<(() => void) | null>(null);
  const live = useRef(dirty);
  const released = useRef(false);
  useEffect(() => { live.current = dirty; released.current = false; }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { if (released.current) return; e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const confirm = useCallback((proceed: () => void) => {
    if (!live.current || released.current) { proceed(); return; }
    setPending(() => proceed);
  }, []);
  const leave = () => { const p = pending; released.current = true; setPending(null); p?.(); };
  const dialog = (
    <UnsavedChangesDialog open={pending !== null} onStay={() => setPending(null)} onLeave={leave} onSave={opts.onSave} title={opts.title}>{opts.text}</UnsavedChangesDialog>
  );
  return { confirm, dialog, asking: pending !== null };
}

export type UnsavedChangesGuardProps = UseUnsavedChangesOptions & {
  dirty: boolean;
  /** A linkekre kattintást is elkapja (alap: igen). Kivétel: új lap, letöltés, #horgony, data-unsaved-ignore. */
  interceptLinks?: boolean;
};

/**
 * UnsavedChangesGuard (molekula, Javaslat 06a/5): tedd a szerkesztő oldalra – bezárás, frissítés és linkre kattintás
 * előtt kérdez. Útválasztó-független: a linket a döntés után „újrakattintja”, így a router (vagy a böngésző) viszi tovább.
 */
export function UnsavedChangesGuard({ dirty, interceptLinks = true, ...opts }: UnsavedChangesGuardProps) {
  const { confirm, dialog } = useUnsavedChanges(dirty, opts);
  const bypass = useRef(false);
  useEffect(() => {
    if (!dirty || !interceptLinks) return;
    const h = (e: MouseEvent) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement) || a.closest('dialog, [data-unsaved-ignore]')) return;
      const href = a.getAttribute('href') ?? '';
      if ((a.target && a.target !== '_self') || a.hasAttribute('download') || href.startsWith('#') || href.startsWith('javascript:')) return;
      e.preventDefault(); e.stopPropagation();
      confirm(() => { bypass.current = true; a.click(); bypass.current = false; });
    };
    document.addEventListener('click', h, true);
    return () => document.removeEventListener('click', h, true);
  }, [dirty, interceptLinks, confirm]);
  return dialog;
}
