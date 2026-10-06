/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  KiegDialog
} from "./chunk-YRRMYRGC.js";
import {
  Button
} from "./chunk-EYUU5TDK.js";

// react/src/kieg/UnsavedChanges.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function UnsavedChangesDialog({ open, onStay, onLeave, onSave, title = "Nem mentett v\xE1ltoz\xE1said vannak", children }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState();
  useEffect(() => {
    if (!open) {
      setBusy(false);
      setErr(void 0);
    }
  }, [open]);
  const save = async () => {
    if (!onSave || busy) return;
    setErr(void 0);
    try {
      const r = onSave();
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      onLeave();
    } catch (e) {
      setBusy(false);
      setErr(`Nem siker\xFClt menteni${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra, vagy maradj az oldalon.`);
    }
  };
  return /* @__PURE__ */ jsxs(
    KiegDialog,
    {
      open,
      onCancel: () => {
        if (!busy) onStay();
      },
      title,
      actions: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", "data-autofocus": true, disabled: busy, onClick: onStay, children: "Maradok" }),
        /* @__PURE__ */ jsx(Button, { variant: onSave ? "secondary" : "danger", disabled: busy, onClick: onLeave, children: "Elvet\xE9s \xE9s tov\xE1bbl\xE9p\xE9s" }),
        onSave && /* @__PURE__ */ jsx(Button, { busy, onClick: () => void save(), children: "Ment\xE9s \xE9s tov\xE1bbl\xE9p\xE9s" })
      ] }),
      children: [
        children ?? /* @__PURE__ */ jsx("p", { children: "Ha most tov\xE1bbl\xE9psz, a m\xF3dos\xEDt\xE1said elvesznek. Maradj, ha m\xE9g menteni szeretn\xE9d \u0151ket." }),
        err && /* @__PURE__ */ jsx("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx("p", { children: err }) })
      ]
    }
  );
}
function useUnsavedChanges(dirty, opts = {}) {
  const [pending, setPending] = useState(null);
  const live = useRef(dirty);
  const released = useRef(false);
  useEffect(() => {
    live.current = dirty;
    released.current = false;
  }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => {
      if (released.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  const confirm = useCallback((proceed) => {
    if (!live.current || released.current) {
      proceed();
      return;
    }
    setPending(() => proceed);
  }, []);
  const leave = () => {
    const p = pending;
    released.current = true;
    setPending(null);
    p?.();
  };
  const dialog = /* @__PURE__ */ jsx(UnsavedChangesDialog, { open: pending !== null, onStay: () => setPending(null), onLeave: leave, onSave: opts.onSave, title: opts.title, children: opts.text });
  return { confirm, dialog, asking: pending !== null };
}
function UnsavedChangesGuard({ dirty, interceptLinks = true, ...opts }) {
  const { confirm, dialog } = useUnsavedChanges(dirty, opts);
  const bypass = useRef(false);
  useEffect(() => {
    if (!dirty || !interceptLinks) return;
    const h = (e) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.closest("dialog, [data-unsaved-ignore]")) return;
      const href = a.getAttribute("href") ?? "";
      if (a.target && a.target !== "_self" || a.hasAttribute("download") || href.startsWith("#") || href.startsWith("javascript:")) return;
      e.preventDefault();
      e.stopPropagation();
      confirm(() => {
        bypass.current = true;
        a.click();
        bypass.current = false;
      });
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [dirty, interceptLinks, confirm]);
  return dialog;
}

export {
  UnsavedChangesDialog,
  useUnsavedChanges,
  UnsavedChangesGuard
};
