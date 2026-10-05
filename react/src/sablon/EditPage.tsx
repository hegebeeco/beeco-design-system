import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../cx';
import { Button } from '../inputs/Button';
import { IcLeft, IcRight, IcSave } from '../inputs/ikonok';
import { FormActions } from '../form/FormSection';
import { DataState } from '../adat/DataState';
import { BeeMoment } from '../meh/BeeMoment';
import { shake } from '../meh/motion';
import { PageHeader } from '../reteg/PageHeader';
import { notify } from '../reteg/notify';
import { defaultLink } from '../reteg/NavTabs';
import { useUnsavedChanges } from '../kieg';
import { DraftNotice, useDraft } from '../form/useDraft';
import { Stepper, type Step } from '../media/Stepper';
import { ErrorSummary, findField, useLinkGuard, type FormError } from './ErrorSummary';
import { SablonFrame, useTemplateTitle, type TemplateHeadProps } from './Frame';

export type EditContext = {
  /** A mező hibája (a FormError name-je szerint) – add át a mező error propjának */
  errorOf: (name: string) => string | undefined;
  submitting: boolean;
  /** Lépés-módban (steps) a mostani lépés azonosítója – ennek a mezőit rajzold ki */
  step?: string;
};

/** Egy lépés (Javaslat 20): azonosító, cím, rövid leírás és a lépés mezőinek neve (a FormError name-jei szerint) */
export type EditStep = { id: string; title: string; description?: ReactNode; fields: readonly string[] };

export type EditStepsConfig = {
  /** A lépések sorrendben (legalább kettő) */
  items: readonly EditStep[];
  /** A lépésjelző neve képernyőolvasónak, pl. „Az új POI felvételének lépései” */
  label: string;
  /**
   * Kitöltve induló űrlap (pl. másolás, szerkesztés): a jelző kezdettől minden lépésre kattintható.
   * Javaslat 21: a még nem látott lépés ettől „hátravan” marad (szám, nem pipa) – pipát csak a ténylegesen bejárt, hibátlan lépés kap.
   */
  allReachable?: boolean;
  /** Lépésváltáskor (pl. analitika, URL) */
  onStepChange?: (id: string) => void;
  backLabel?: string;
  nextLabel?: string;
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
  /**
   * Piszkozat (Javaslat 13/7): a módosított űrlap az eszközön megmarad; újranyitáskor felajánljuk a visszaállítást,
   * sikeres mentés után törlődik. key: űrlap + rekord (pl. „esemeny:126”); onRestore: az értékek visszatöltése (dirty marad).
   */
  draft?: { key: string | null; values: unknown; onRestore: (values: never) => void };
  /**
   * Javaslat 20 – lépés-mód: egyszerre egy lépés látszik, felül a kattintható lépésjelző, a gombsorban Vissza / Tovább és az
   * utolsó lépésen a Mentés. A „Tovább” csak a lépés mezőit ellenőrzi (a validate eredménye a lépés fields-ére szűrve); a hibaösszesítő
   * linkje a megfelelő lépésre vált; mentéskor a korábbi lépés hibájára odaugrik. A children függvény ctx.step-je a mostani lépés.
   */
  steps?: EditStepsConfig;
  /** Javaslat 20 – ⌘S / Ctrl+S menti az űrlapot (lépés-módban csak az utolsó lépésen; előtte a „Tovább”-ra figyelmeztet) */
  saveShortcut?: boolean;
  /** A szakaszok (FormSection) – vagy függvény, ami megkapja a hibákat */
  children: ReactNode | ((ctx: EditContext) => ReactNode);
};

type FocusReq = { target: 'title' | 'error' | 'field' | 'none'; name?: string; n: number };
/** Enter ezekben NEM a „Tovább” (gomb, jelölő, fájl…) – szövegmezőben igen */
const ENTER_SKIP = new Set(['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'image', 'range', 'color']);
const STEP_STATE_ERROR = (n: number) => (n === 1 ? 'Egy mezőt javíts ki' : `${n} mezőt javíts ki`);

/**
 * EditPage (sablon, Javaslat 06c/16): oldalfej · hibaösszesítő · szakaszok · ragadós gombsor (Mégse / Mentés) · előnézet-oszlop.
 * Javaslat 20: lépés-mód (steps: Vissza / Tovább, lépésenkénti ellenőrzés) és ⌘S / Ctrl+S mentés (saveShortcut).
 * Mentetlen változásnál a Mégse, a linkek és a böngésző bezárása előtt kérdez (kieg useUnsavedChanges).
 * Sikertelen beküldés: összesítő felül, fókusz rá, kíméletes rázás. Siker: értesítés + mentve-pipa + 'mentve' pillanat.
 */
export function EditPage(p: EditPageProps) {
  const { title, description, breadcrumbs, renderLink = defaultLink, status = 'ready', dirty, validate, preview } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix, status === 'loading');
  const pid = useId();
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [server, setServer] = useState<FormError[]>([]);
  const [general, setGeneral] = useState<string>();
  const [failed, setFailed] = useState(0);
  const guard = useUnsavedChanges(dirty && !busy);
  const draft = useDraft<unknown>({ key: status === 'ready' ? p.draft?.key ?? null : null, values: p.draft?.values, dirty, onRestore: (v) => (p.draft?.onRestore as ((x: unknown) => void) | undefined)?.(v) });
  useLinkGuard(dirty && !busy, guard.confirm);

  // --- Lépés-mód (Javaslat 20)
  const steps = p.steps?.items.length ? p.steps.items : null;
  const [curRaw, setCur] = useState(0);
  const cur = steps ? Math.min(curRaw, steps.length - 1) : 0;
  // reached: meddig kattintható a jelző (allReachable: mind); seen: a ténylegesen látott lépések (Javaslat 21 – a pipa csak ezeken)
  const [reached, setReached] = useState(() => (p.steps?.allReachable && steps ? steps.length - 1 : 0));
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  // azok a lépések, ahol a „Tovább” hibát talált – ezek hibái élőben látszanak (a javított eltűnik)
  const [tried, setTried] = useState<ReadonlySet<string>>(() => new Set());
  const [focusReq, setFocusReq] = useState<FocusReq | null>(null);
  const step = steps?.[cur];
  const last = !steps || cur === steps.length - 1;
  const stepOf = (name: string) => (steps ? steps.findIndex((s) => s.fields.includes(name)) : -1);
  const onStepChange = useRef(p.steps?.onStepChange);
  onStepChange.current = p.steps?.onStepChange;
  const prevStep = useRef(step?.id);
  useEffect(() => { if (step && prevStep.current !== step.id) { prevStep.current = step.id; onStepChange.current?.(step.id); } }, [step?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ha újra módosít, a „mentve” pillanat eltűnik
  useEffect(() => { if (dirty) setSaved(false); }, [dirty]);
  // Sikertelen beküldés: fókusz az összesítőre + rázás (az összesítő ekkor már a DOM-ban van)
  useEffect(() => { if (failed) { summary.current?.focus(); shake(summary.current); } }, [failed]);
  useEffect(() => { if (!done) return; const t = setTimeout(() => setDone(false), 1500); return () => clearTimeout(t); }, [done]);

  // lépés-módban a validate eredménye kell a pipához is (a látott, de még hibás lépés nem kap pipát) – egyszer számoljuk
  const all = validate && (attempted || steps) ? validate() : [];
  const live = attempted ? all : [];
  const names = new Set(live.map((e) => e.name));
  const errors = [...live, ...server.filter((e) => !names.has(e.name))];
  // a „Tovább” utáni lépéshibák (csak a próbált lépések mezőire)
  const stepLive = steps && tried.size ? all.filter((e) => { const i = stepOf(e.name); return i >= 0 && tried.has(steps[i].id); }) : [];
  const errorOf = (name: string) => errors.find((e) => e.name === name)?.message ?? stepLive.find((e) => e.name === name)?.message;
  const fail = () => setFailed((n) => n + 1);
  const stepHasError = (s: EditStep) => s.fields.some((f) => errors.some((e) => e.name === f) || stepLive.some((e) => e.name === f));
  const ownStepErrors = step ? stepLive.filter((e) => step.fields.includes(e.name)) : [];

  const goStep = (i: number, target: FocusReq['target'], name?: string) => {
    setCur(i);
    setReached((r) => Math.max(r, i));
    setSeen((v) => (v.has(i) ? v : new Set(v).add(i)));
    setFocusReq((f) => ({ target, name, n: (f?.n ?? 0) + 1 }));
  };
  const next = () => {
    if (!steps || !step || last) return;
    const errs = (validate?.() ?? []).filter((e) => step.fields.includes(e.name));
    if (errs.length) {
      setTried((t) => new Set(t).add(step.id));
      setFocusReq((f) => ({ target: 'error', name: errs[0].name, n: (f?.n ?? 0) + 1 }));
      return;
    }
    goStep(cur + 1, 'title');
  };
  // Mentés után: ha az első hibás mező egy MÁSIK lépésben van, oda váltunk (a fókusz az összesítőn marad)
  const jumpToError = (list: FormError[]) => {
    if (!steps) return;
    const i = steps.findIndex((s) => s.fields.some((f) => list.some((e) => e.name === f)));
    if (i >= 0 && i !== cur) goStep(i, 'none');
  };

  // Lépésváltás után: fókusz a lépés címére / az első hibás mezőre / a kért mezőre
  useEffect(() => {
    if (!focusReq || focusReq.target === 'none') return;
    if (focusReq.target === 'title') { stepTitle.current?.focus(); return; }
    const box = form.current;
    const el = (focusReq.target === 'error' ? box?.querySelector<HTMLElement>('.bc-sablon-steps [aria-invalid="true"]') : null) ?? findField(box, focusReq.name ?? '');
    if (el) { el.scrollIntoView?.({ block: 'center' }); el.focus({ preventScroll: true }); } else stepTitle.current?.focus();
  }, [focusReq]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return; // dupla beküldés ellen
    if (!last) { next(); return; } // lépés-módban a köztes lépésen a beküldés = „Tovább”
    setServer([]); setGeneral(undefined); setSaved(false); setAttempted(true);
    const v = validate?.() ?? [];
    if (v.length) { jumpToError(v); fail(); return; }
    setBusy(true);
    try {
      const r = await p.onSubmit();
      setBusy(false);
      if (Array.isArray(r) && r.length) { setServer(r); jumpToError(r); fail(); return; }
      setAttempted(false); setDone(true); setTried(new Set());
      draft.clear();
      if (p.savedMoment !== false) setSaved(true);
      notify.success(p.successMessage ?? 'Mentve.');
    } catch (err) {
      setBusy(false);
      setGeneral(`${err instanceof Error && err.message ? err.message : 'A szerver nem válaszolt'}. A módosításaid megvannak – próbáld újra.`);
      fail();
    }
  };

  // ⌘S / Ctrl+S (Javaslat 20): mentés – nyitott ablak mögött nem; lépés-módban a köztes lépésen a „Tovább”-ra figyelmeztet
  const shortcut = useRef<() => void>(() => {});
  shortcut.current = () => {
    if (busy) return;
    if (!last) { notify.info('Mentés az utolsó lépésen – előbb menj tovább.'); nextBtn.current?.focus(); return; }
    form.current?.requestSubmit();
  };
  useEffect(() => {
    if (!p.saveShortcut || status !== 'ready') return;
    const h = (e: globalThis.KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== 's') return;
      const t = e.target as Element | null;
      const layer = document.querySelector('dialog[open], [role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]');
      if (layer && !(t && layer.contains(t) && form.current && layer.contains(form.current))) return;
      e.preventDefault();
      shortcut.current();
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [p.saveShortcut, status]);

  // Enter egy szövegmezőben a köztes lépéseken: „Tovább” (nem az egész űrlap beküldése)
  const onStepKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const t = e.target;
    if (last || e.key !== 'Enter' || e.defaultPrevented || e.nativeEvent.isComposing) return;
    if (!(t instanceof HTMLInputElement) || ENTER_SKIP.has(t.type)) return;
    e.preventDefault();
    next();
  };

  const cancelLabel = p.cancelLabel ?? 'Mégse';
  const cancel = p.cancelHref
    ? renderLink({ href: p.cancelHref, className: 'bc-btn is-secondary', children: cancelLabel })
    : p.onCancel && <Button variant="secondary" disabled={busy} onClick={() => guard.confirm(p.onCancel!)}>{cancelLabel}</Button>;
  const showSummary = (errors.length > 0 || general) && (attempted || server.length > 0 || general);
  const ctx: EditContext = { errorOf, submitting: busy, step: step?.id };
  const content = typeof p.children === 'function' ? p.children(ctx) : p.children;
  // Javaslat 21: „kész” (pipa) csak a ténylegesen látott és hibátlan lépés (a validate szerint); a még nem látott „hátravan” (szám) –
  // allReachable mellett is, ott kattintható marad. Egy szabály mindkét módra: a látott, de azóta hibássá vált lépés sem kap pipát.
  const stepClean = (s: EditStep) => !s.fields.some((f) => all.some((e) => e.name === f));
  const stepperItems: Step[] = steps ? steps.map((s, i) => ({
    id: s.id, label: s.title, reachable: i <= reached,
    state: i === cur ? 'current' : stepHasError(s) ? 'error' : seen.has(i) && stepClean(s) ? 'done' : 'todo',
  })) : [];
  const keys = p.saveShortcut ? 'Meta+S Control+S' : undefined;

  return (
    <SablonFrame kind="szerkeszto" standalone={p.standalone} skipLabel={p.skipLabel} className={p.className} busy={status === 'loading'}>
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} renderLink={renderLink} loading={status === 'loading'} />
      <DataState status={status} what={p.what ?? 'az űrlapot'} error={p.error} onRetry={p.onRetry}>
        <div className={cx('bc-sablon-cols', Boolean(preview) && 'has-preview')}>
          <form ref={form} className="bc-sablon-form" noValidate onSubmit={(e) => void submit(e)} aria-busy={busy || undefined} data-step={step?.id}>
            {showSummary && (
              <ErrorSummary ref={summary} errors={errors} general={general} form={form}
                onJump={steps ? (name) => { const i = stepOf(name); if (i < 0 || i === cur) return false; goStep(i, 'field', name); return true; } : undefined} />
            )}
            {draft.draft && <DraftNotice savedAt={draft.draft.savedAt} onRestore={draft.restore} onDiscard={draft.discard} />}
            {steps && step ? (
              <div className="bc-sablon-steps" onKeyDown={onStepKey}>
                <Stepper label={p.steps!.label} steps={stepperItems} onSelect={(i) => goStep(i, 'title')} />
                <div className="bc-sablon-step-head">
                  <h2 ref={stepTitle} id={`${pid}-st`} tabIndex={-1} className="bc-sablon-step-title">
                    {step.title} <span className="bc-sablon-step-count">{cur + 1}/{steps.length}. lépés</span>
                  </h2>
                  {step.description && <p className="bc-sablon-step-desc">{step.description}</p>}
                </div>
                <div className="bc-stack" role="group" aria-labelledby={`${pid}-st`}>{content}</div>
              </div>
            ) : content}
            <div className="bc-sablon-bar">
              <div className="bc-sablon-bar-note">
                {ownStepErrors.length > 0 ? <p className="bc-sablon-step-error" role="alert">{STEP_STATE_ERROR(ownStepErrors.length)}, mielőtt továbblépsz.</p>
                  : saved && !dirty ? <BeeMoment inline pillanat="mentve" />
                  : dirty ? <p className="bc-sablon-dirty"><span className="bc-sablon-dot" aria-hidden="true" />Nem mentett változások</p> : null}
              </div>
              <FormActions>
                {cancel}
                {steps && cur > 0 && <Button variant="secondary" icon={<IcLeft />} disabled={busy} onClick={() => goStep(cur - 1, 'title')}>{p.steps!.backLabel ?? 'Vissza'}</Button>}
                {last
                  ? <Button type="submit" busy={busy} done={done} icon={p.submitIcon ?? <IcSave />} aria-keyshortcuts={keys}>{p.submitLabel ?? 'Mentés'}</Button>
                  : <Button ref={nextBtn} icon={<IcRight />} onClick={next}>{p.steps!.nextLabel ?? 'Tovább'}</Button>}
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
