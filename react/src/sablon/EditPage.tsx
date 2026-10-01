import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { IcSave } from '../inputs/ikonok';
import { FormActions } from '../form/FormSection';
import { DataState } from '../adat/DataState';
import { BeeMoment } from '../meh/BeeMoment';
import { shake } from '../meh/motion';
import { PageHeader } from '../reteg/PageHeader';
import { notify } from '../reteg/notify';
import { defaultLink } from '../reteg/NavTabs';
import { useUnsavedChanges } from '../kieg';
import { ErrorSummary, useLinkGuard, type FormError } from './ErrorSummary';
import { SablonFrame, useTemplateTitle, type TemplateHeadProps } from './Frame';

export type EditContext = {
  /** A mező hibája (a FormError name-je szerint) – add át a mező error propjának */
  errorOf: (name: string) => string | undefined;
  submitting: boolean;
};

export type EditPageProps = TemplateHeadProps & {
  status?: 'ready' | 'loading' | 'error' | 'forbidden';
  what?: string;
  error?: string;
  onRetry?: () => void;
  /** Van mentetlen változás (a hívó számolja: jelenlegi ≠ betöltött) – az őr és a „Nem mentett változások” jelzés ebből dolgozik */
  dirty: boolean;
  /** Beküldés előtti ellenőrzés – üres lista = rendben. Sikertelen beküldés után minden rajzoláskor újrafut (a javított hiba eltűnik). */
  validate?: () => FormError[];
  /** Mentés. Hibát dobhat (→ általános hiba), vagy szerveroldali mezőhibákat adhat vissza (→ hibaösszesítő). */
  onSubmit: () => void | FormError[] | Promise<void | FormError[]>;
  /** Mégse: az őrön át (mentetlen változásnál előbb kérdez) – vagy cancelHref link */
  onCancel?: () => void;
  cancelHref?: string;
  submitLabel?: string;
  /** A mentés gomb piktogramja – alap: mentés; létrehozásnál pl. <IcNew /> (Kristóf szabálya: szöveges gombon is legyen piktogram) */
  submitIcon?: ReactNode;
  cancelLabel?: string;
  /** Értesítés sikeres mentés után */
  successMessage?: string;
  /** Mentés után a gombsorban méhecske-pillanat ('mentve') – alap: igen */
  savedMoment?: boolean;
  /** Élő előnézet (pl. PreviewCard) – széles helyen jobb oldalt, telefonon az űrlap alatt */
  preview?: ReactNode;
  previewLabel?: string;
  /** A szakaszok (FormSection) – vagy függvény, ami megkapja a hibákat */
  children: ReactNode | ((ctx: EditContext) => ReactNode);
};

/**
 * EditPage (sablon, Javaslat 06c/16): oldalfej · hibaösszesítő · szakaszok · ragadós gombsor (Mégse / Mentés) · előnézet-oszlop.
 * Mentetlen változásnál a Mégse, a linkek és a böngésző bezárása előtt kérdez (kieg useUnsavedChanges).
 * Sikertelen beküldés: összesítő felül, fókusz rá, kíméletes rázás. Siker: értesítés + mentve-pipa + 'mentve' pillanat.
 */
export function EditPage(p: EditPageProps) {
  const { title, description, breadcrumbs, renderLink = defaultLink, status = 'ready', dirty, validate, preview } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix, status === 'loading');
  const pid = useId();
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [server, setServer] = useState<FormError[]>([]);
  const [general, setGeneral] = useState<string>();
  const [failed, setFailed] = useState(0);
  const guard = useUnsavedChanges(dirty && !busy);
  useLinkGuard(dirty && !busy, guard.confirm);

  // Ha újra módosít, a „mentve” pillanat eltűnik
  useEffect(() => { if (dirty) setSaved(false); }, [dirty]);
  // Sikertelen beküldés: fókusz az összesítőre + rázás (az összesítő ekkor már a DOM-ban van)
  useEffect(() => { if (failed) { summary.current?.focus(); shake(summary.current); } }, [failed]);
  useEffect(() => { if (!done) return; const t = setTimeout(() => setDone(false), 1500); return () => clearTimeout(t); }, [done]);

  const live = attempted && validate ? validate() : [];
  const names = new Set(live.map((e) => e.name));
  const errors = [...live, ...server.filter((e) => !names.has(e.name))];
  const errorOf = (name: string) => errors.find((e) => e.name === name)?.message;
  const fail = () => setFailed((n) => n + 1);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return; // dupla beküldés ellen
    setServer([]); setGeneral(undefined); setSaved(false); setAttempted(true);
    if (validate?.().length) { fail(); return; }
    setBusy(true);
    try {
      const r = await p.onSubmit();
      setBusy(false);
      if (Array.isArray(r) && r.length) { setServer(r); fail(); return; }
      setAttempted(false); setDone(true);
      if (p.savedMoment !== false) setSaved(true);
      notify.success(p.successMessage ?? 'Mentve.');
    } catch (err) {
      setBusy(false);
      setGeneral(`${err instanceof Error && err.message ? err.message : 'A szerver nem válaszolt'}. A módosításaid megvannak – próbáld újra.`);
      fail();
    }
  };

  const cancelLabel = p.cancelLabel ?? 'Mégse';
  const cancel = p.cancelHref
    ? renderLink({ href: p.cancelHref, className: 'bc-btn is-secondary', children: cancelLabel })
    : p.onCancel && <Button variant="secondary" disabled={busy} onClick={() => guard.confirm(p.onCancel!)}>{cancelLabel}</Button>;
  const showSummary = (errors.length > 0 || general) && (attempted || server.length > 0 || general);

  return (
    <SablonFrame kind="szerkeszto" standalone={p.standalone} skipLabel={p.skipLabel} className={p.className} busy={status === 'loading'}>
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} renderLink={renderLink} loading={status === 'loading'} />
      <DataState status={status} what={p.what ?? 'az űrlapot'} error={p.error} onRetry={p.onRetry}>
        <div className={cx('bc-sablon-cols', Boolean(preview) && 'has-preview')}>
          <form ref={form} className="bc-sablon-form" noValidate onSubmit={(e) => void submit(e)} aria-busy={busy || undefined}>
            {showSummary && <ErrorSummary ref={summary} errors={errors} general={general} form={form} />}
            {typeof p.children === 'function' ? p.children({ errorOf, submitting: busy }) : p.children}
            <div className="bc-sablon-bar">
              <div className="bc-sablon-bar-note">
                {saved && !dirty ? <BeeMoment inline pillanat="mentve" />
                  : dirty ? <p className="bc-sablon-dirty"><span className="bc-sablon-dot" aria-hidden="true" />Nem mentett változások</p> : null}
              </div>
              <FormActions>
                {cancel}
                <Button type="submit" busy={busy} done={done} icon={p.submitIcon ?? <IcSave />}>{p.submitLabel ?? 'Mentés'}</Button>
              </FormActions>
            </div>
          </form>
          {preview && (
            <aside className="bc-sablon-preview" aria-labelledby={`${pid}-pv`}>
              <h2 id={`${pid}-pv`} className="bc-sablon-aside-title">{p.previewLabel ?? 'Előnézet'}</h2>
              {preview}
            </aside>
          )}
        </div>
      </DataState>
      {guard.dialog}
    </SablonFrame>
  );
}
