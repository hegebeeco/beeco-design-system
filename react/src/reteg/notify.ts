/* ============================================================
   Értesítés-tár (Javaslat 03 – 8A) – könyvtár nélkül. A projekt csak a notify.*-t hívja,
   a <Toaster /> egyszer van az alkalmazás gyökerében.
   Szabályok: hiba nem tűnik el magától · a többi 5 mp · rámutatásra/fókuszra megáll ·
   azonos üzenet nem halmozódik (×2) · egyszerre 3 látszik, a többi „+N további”.
   ============================================================ */
export type ToastKind = 'success' | 'error' | 'info' | 'warning';
export type ToastAction = { label: string; onClick: () => void };
export type ToastOptions = {
  /** Pl. { label: 'Visszavonás', onClick: undo } – visszafordítható műveletnél megerősítés helyett */
  action?: ToastAction;
  /** Ennyi ms után tűnik el (alap 5000; hibánál soha – Infinity) */
  duration?: number;
};
export type Toast = { id: string; kind: ToastKind; message: string; action?: ToastAction; count: number; leaving?: boolean };

const DEFAULT_MS = 5000;
const LEAVE_MS = 150; // a kilépő animáció ideje (≤ 300 ms)
let list: Toast[] = [];
let seq = 0;
let paused = false;
const listeners = new Set<() => void>();
const timers = new Map<string, { left: number; start: number; h?: ReturnType<typeof setTimeout> }>();

const emit = () => listeners.forEach((l) => l());
export const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getToasts = () => list;

function arm(id: string) {
  const t = timers.get(id);
  if (!t || paused) return;
  t.start = Date.now();
  t.h = setTimeout(() => dismiss(id), t.left);
}
function setTimer(id: string, ms: number) {
  const old = timers.get(id);
  if (old?.h) clearTimeout(old.h);
  if (!Number.isFinite(ms)) { timers.delete(id); return; }
  timers.set(id, { left: ms, start: Date.now() });
  arm(id);
}

function push(kind: ToastKind, message: string, opts: ToastOptions = {}) {
  const ms = opts.duration ?? (kind === 'error' ? Infinity : DEFAULT_MS);
  const same = list.find((t) => t.kind === kind && t.message === message && !t.leaving);
  if (same) {
    // Ugyanaz az üzenet még látszik: nem halmozunk, csak számolunk és újraindítjuk az időt
    list = list.map((t) => (t === same ? { ...t, count: t.count + 1, action: opts.action ?? t.action } : t));
    setTimer(same.id, ms);
    emit();
    return same.id;
  }
  const id = `bc-toast-${++seq}`;
  list = [...list, { id, kind, message, action: opts.action, count: 1 }];
  setTimer(id, ms);
  emit();
  return id;
}

/** Bezárás (id nélkül: mind) */
export function dismiss(id?: string) {
  const ids = id ? [id] : list.map((t) => t.id);
  ids.forEach((i) => { const t = timers.get(i); if (t?.h) clearTimeout(t.h); timers.delete(i); });
  list = list.map((t) => (ids.includes(t.id) ? { ...t, leaving: true } : t));
  emit();
  setTimeout(() => { list = list.filter((t) => !ids.includes(t.id)); emit(); }, LEAVE_MS);
}

/** Rámutatás / fókusz: minden visszaszámlálás megáll, utána folytatódik (a maradék idővel) */
export function pauseToasts(on: boolean) {
  if (on === paused) return;
  paused = on;
  timers.forEach((t, id) => {
    if (on) { if (t.h) clearTimeout(t.h); t.h = undefined; t.left = Math.max(0, t.left - (Date.now() - t.start)); }
    else arm(id);
  });
}

export const notify = {
  success: (message: string, opts?: ToastOptions) => push('success', message, opts),
  error: (message: string, opts?: ToastOptions) => push('error', message, opts),
  info: (message: string, opts?: ToastOptions) => push('info', message, opts),
  warning: (message: string, opts?: ToastOptions) => push('warning', message, opts),
  /**
   * Visszavonható művelet (Javaslat 13/6): megerősítő ablak helyett siker-értesítés „Visszavonás” gombbal, 10 mp-ig.
   * Csak valóban visszafordítható műveletnél (a projekt tudja a fordítottját hívni) – törlésnél, kiküldésnél nem.
   */
  undo: (message: string, onUndo: () => void, opts?: { label?: string; duration?: number }) =>
    push('success', message, { action: { label: opts?.label ?? 'Visszavonás', onClick: onUndo }, duration: opts?.duration ?? 10_000 }),
  dismiss,
};
