/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/reteg/notify.ts
var DEFAULT_MS = 5e3;
var LEAVE_MS = 150;
var list = [];
var seq = 0;
var paused = false;
var listeners = /* @__PURE__ */ new Set();
var timers = /* @__PURE__ */ new Map();
var emit = () => listeners.forEach((l) => l());
var subscribe = (l) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
var getToasts = () => list;
function arm(id) {
  const t = timers.get(id);
  if (!t || paused) return;
  t.start = Date.now();
  t.h = setTimeout(() => dismiss(id), t.left);
}
function setTimer(id, ms) {
  const old = timers.get(id);
  if (old?.h) clearTimeout(old.h);
  if (!Number.isFinite(ms)) {
    timers.delete(id);
    return;
  }
  timers.set(id, { left: ms, start: Date.now() });
  arm(id);
}
function push(kind, message, opts = {}) {
  const ms = opts.duration ?? (kind === "error" ? Infinity : DEFAULT_MS);
  const same = list.find((t) => t.kind === kind && t.message === message && !t.leaving);
  if (same) {
    list = list.map((t) => t === same ? { ...t, count: t.count + 1, action: opts.action ?? t.action } : t);
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
function dismiss(id) {
  const ids = id ? [id] : list.map((t) => t.id);
  ids.forEach((i) => {
    const t = timers.get(i);
    if (t?.h) clearTimeout(t.h);
    timers.delete(i);
  });
  list = list.map((t) => ids.includes(t.id) ? { ...t, leaving: true } : t);
  emit();
  setTimeout(() => {
    list = list.filter((t) => !ids.includes(t.id));
    emit();
  }, LEAVE_MS);
}
function pauseToasts(on) {
  if (on === paused) return;
  paused = on;
  timers.forEach((t, id) => {
    if (on) {
      if (t.h) clearTimeout(t.h);
      t.h = void 0;
      t.left = Math.max(0, t.left - (Date.now() - t.start));
    } else arm(id);
  });
}
var notify = {
  success: (message, opts) => push("success", message, opts),
  error: (message, opts) => push("error", message, opts),
  info: (message, opts) => push("info", message, opts),
  warning: (message, opts) => push("warning", message, opts),
  /**
   * Visszavonható művelet (Javaslat 13/6): megerősítő ablak helyett siker-értesítés „Visszavonás” gombbal, 10 mp-ig.
   * Csak valóban visszafordítható műveletnél (a projekt tudja a fordítottját hívni) – törlésnél, kiküldésnél nem.
   */
  undo: (message, onUndo, opts) => push("success", message, { action: { label: opts?.label ?? "Visszavon\xE1s", onClick: onUndo }, duration: opts?.duration ?? 1e4 }),
  dismiss
};

export {
  subscribe,
  getToasts,
  dismiss,
  pauseToasts,
  notify
};
