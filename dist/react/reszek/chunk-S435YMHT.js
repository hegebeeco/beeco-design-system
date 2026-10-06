/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  ErrorSummary,
  findField,
  useLinkGuard
} from "./chunk-LNRJW2GK.js";
import {
  SablonFrame,
  useTemplateTitle
} from "./chunk-J5NCG7LI.js";
import {
  notify
} from "./chunk-QL7IDSDP.js";
import {
  PageHeader
} from "./chunk-P3R7Y6TP.js";
import {
  defaultLink
} from "./chunk-4ES2XWAF.js";
import {
  Stepper
} from "./chunk-EEDG5J6T.js";
import {
  useUnsavedChanges
} from "./chunk-UUIEH2OJ.js";
import {
  BeeMoment
} from "./chunk-WLDWXVNI.js";
import {
  shake
} from "./chunk-YUG65WGE.js";
import {
  FormActions
} from "./chunk-4AETSBHO.js";
import {
  DraftNotice,
  useDraft
} from "./chunk-UODGU2UF.js";
import {
  DataState
} from "./chunk-VDC2PVQ7.js";
import {
  Button
} from "./chunk-YXJMOLOZ.js";
import {
  IcLeft,
  IcRight,
  IcSave
} from "./chunk-ELRX4ZP3.js";
import {
  cx
} from "./chunk-MGWI3LRM.js";

// react/src/sablon/EditPage.tsx
import { useEffect, useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var ENTER_SKIP = /* @__PURE__ */ new Set(["button", "submit", "reset", "checkbox", "radio", "file", "image", "range", "color"]);
var STEP_STATE_ERROR = (n) => n === 1 ? "Egy mez\u0151t jav\xEDts ki" : `${n} mez\u0151t jav\xEDts ki`;
function EditPage(p) {
  const { title, description, breadcrumbs, renderLink = defaultLink, status = "ready", dirty, validate, preview } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix, status === "loading");
  const pid = useId();
  const form = useRef(null);
  const summary = useRef(null);
  const stepTitle = useRef(null);
  const nextBtn = useRef(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [server, setServer] = useState([]);
  const [general, setGeneral] = useState();
  const [failed, setFailed] = useState(0);
  const guard = useUnsavedChanges(dirty && !busy);
  const draft = useDraft({ key: status === "ready" ? p.draft?.key ?? null : null, values: p.draft?.values, dirty, onRestore: (v) => p.draft?.onRestore?.(v) });
  useLinkGuard(dirty && !busy, guard.confirm);
  const steps = p.steps?.items.length ? p.steps.items : null;
  const [curRaw, setCur] = useState(0);
  const cur = steps ? Math.min(curRaw, steps.length - 1) : 0;
  const [reached, setReached] = useState(() => p.steps?.allReachable && steps ? steps.length - 1 : 0);
  const [seen, setSeen] = useState(() => /* @__PURE__ */ new Set([0]));
  const [tried, setTried] = useState(() => /* @__PURE__ */ new Set());
  const [focusReq, setFocusReq] = useState(null);
  const step = steps?.[cur];
  const last = !steps || cur === steps.length - 1;
  const stepOf = (name) => steps ? steps.findIndex((s) => s.fields.includes(name)) : -1;
  const onStepChange = useRef(p.steps?.onStepChange);
  onStepChange.current = p.steps?.onStepChange;
  const prevStep = useRef(step?.id);
  useEffect(() => {
    if (step && prevStep.current !== step.id) {
      prevStep.current = step.id;
      onStepChange.current?.(step.id);
    }
  }, [step?.id]);
  useEffect(() => {
    if (dirty) setSaved(false);
  }, [dirty]);
  useEffect(() => {
    if (failed) {
      summary.current?.focus();
      shake(summary.current);
    }
  }, [failed]);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1500);
    return () => clearTimeout(t);
  }, [done]);
  const all = validate && (attempted || steps) ? validate() : [];
  const live = attempted ? all : [];
  const names = new Set(live.map((e) => e.name));
  const errors = [...live, ...server.filter((e) => !names.has(e.name))];
  const stepLive = steps && tried.size ? all.filter((e) => {
    const i = stepOf(e.name);
    return i >= 0 && tried.has(steps[i].id);
  }) : [];
  const errorOf = (name) => errors.find((e) => e.name === name)?.message ?? stepLive.find((e) => e.name === name)?.message;
  const fail = () => setFailed((n) => n + 1);
  const stepHasError = (s) => s.fields.some((f) => errors.some((e) => e.name === f) || stepLive.some((e) => e.name === f));
  const ownStepErrors = step ? stepLive.filter((e) => step.fields.includes(e.name)) : [];
  const goStep = (i, target, name) => {
    setCur(i);
    setReached((r) => Math.max(r, i));
    setSeen((v) => v.has(i) ? v : new Set(v).add(i));
    setFocusReq((f) => ({ target, name, n: (f?.n ?? 0) + 1 }));
  };
  const next = () => {
    if (!steps || !step || last) return;
    const errs = (validate?.() ?? []).filter((e) => step.fields.includes(e.name));
    if (errs.length) {
      setTried((t) => new Set(t).add(step.id));
      setFocusReq((f) => ({ target: "error", name: errs[0].name, n: (f?.n ?? 0) + 1 }));
      return;
    }
    goStep(cur + 1, "title");
  };
  const jumpToError = (list) => {
    if (!steps) return;
    const i = steps.findIndex((s) => s.fields.some((f) => list.some((e) => e.name === f)));
    if (i >= 0 && i !== cur) goStep(i, "none");
  };
  useEffect(() => {
    if (!focusReq || focusReq.target === "none") return;
    if (focusReq.target === "title") {
      stepTitle.current?.focus();
      return;
    }
    const box = form.current;
    const el = (focusReq.target === "error" ? box?.querySelector('.bc-sablon-steps [aria-invalid="true"]') : null) ?? findField(box, focusReq.name ?? "");
    if (el) {
      el.scrollIntoView?.({ block: "center" });
      el.focus({ preventScroll: true });
    } else stepTitle.current?.focus();
  }, [focusReq]);
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!last) {
      next();
      return;
    }
    setServer([]);
    setGeneral(void 0);
    setSaved(false);
    setAttempted(true);
    const v = validate?.() ?? [];
    if (v.length) {
      jumpToError(v);
      fail();
      return;
    }
    setBusy(true);
    try {
      const r = await p.onSubmit();
      setBusy(false);
      if (Array.isArray(r) && r.length) {
        setServer(r);
        jumpToError(r);
        fail();
        return;
      }
      setAttempted(false);
      setDone(true);
      setTried(/* @__PURE__ */ new Set());
      draft.clear();
      if (p.savedMoment !== false) setSaved(true);
      notify.success(p.successMessage ?? "Mentve.");
    } catch (err) {
      setBusy(false);
      setGeneral(`${err instanceof Error && err.message ? err.message : "A szerver nem v\xE1laszolt"}. A m\xF3dos\xEDt\xE1said megvannak \u2013 pr\xF3b\xE1ld \xFAjra.`);
      fail();
    }
  };
  const shortcut = useRef(() => {
  });
  shortcut.current = () => {
    if (busy) return;
    if (!last) {
      notify.info("Ment\xE9s az utols\xF3 l\xE9p\xE9sen \u2013 el\u0151bb menj tov\xE1bb.");
      nextBtn.current?.focus();
      return;
    }
    form.current?.requestSubmit();
  };
  useEffect(() => {
    if (!p.saveShortcut || status !== "ready") return;
    const h = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.key.toLowerCase() !== "s") return;
      const t = e.target;
      const layer = document.querySelector('dialog[open], [role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]');
      if (layer && !(t && layer.contains(t) && form.current && layer.contains(form.current))) return;
      e.preventDefault();
      shortcut.current();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [p.saveShortcut, status]);
  const onStepKey = (e) => {
    const t = e.target;
    if (last || e.key !== "Enter" || e.defaultPrevented || e.nativeEvent.isComposing) return;
    if (!(t instanceof HTMLInputElement) || ENTER_SKIP.has(t.type)) return;
    e.preventDefault();
    next();
  };
  const cancelLabel = p.cancelLabel ?? "M\xE9gse";
  const cancel = p.cancelHref ? renderLink({ href: p.cancelHref, className: "bc-btn is-secondary", children: cancelLabel }) : p.onCancel && /* @__PURE__ */ jsx(Button, { variant: "secondary", disabled: busy, onClick: () => guard.confirm(p.onCancel), children: cancelLabel });
  const showSummary = (errors.length > 0 || general) && (attempted || server.length > 0 || general);
  const ctx = { errorOf, submitting: busy, step: step?.id };
  const content = typeof p.children === "function" ? p.children(ctx) : p.children;
  const stepClean = (s) => !s.fields.some((f) => all.some((e) => e.name === f));
  const stepperItems = steps ? steps.map((s, i) => ({
    id: s.id,
    label: s.title,
    reachable: i <= reached,
    state: i === cur ? "current" : stepHasError(s) ? "error" : seen.has(i) && stepClean(s) ? "done" : "todo"
  })) : [];
  const keys = p.saveShortcut ? "Meta+S Control+S" : void 0;
  return /* @__PURE__ */ jsxs(SablonFrame, { kind: "szerkeszto", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, busy: status === "loading", children: [
    /* @__PURE__ */ jsx(PageHeader, { title, description, breadcrumbs, renderLink, loading: status === "loading" }),
    /* @__PURE__ */ jsx(DataState, { status, what: p.what ?? "az \u0171rlapot", error: p.error, onRetry: p.onRetry, children: /* @__PURE__ */ jsxs("div", { className: cx("bc-sablon-cols", Boolean(preview) && "has-preview"), children: [
      /* @__PURE__ */ jsxs("form", { ref: form, className: "bc-sablon-form", noValidate: true, onSubmit: (e) => void submit(e), "aria-busy": busy || void 0, "data-step": step?.id, children: [
        showSummary && /* @__PURE__ */ jsx(
          ErrorSummary,
          {
            ref: summary,
            errors,
            general,
            form,
            onJump: steps ? (name) => {
              const i = stepOf(name);
              if (i < 0 || i === cur) return false;
              goStep(i, "field", name);
              return true;
            } : void 0
          }
        ),
        draft.draft && /* @__PURE__ */ jsx(DraftNotice, { savedAt: draft.draft.savedAt, onRestore: draft.restore, onDiscard: draft.discard }),
        steps && step ? /* @__PURE__ */ jsxs("div", { className: "bc-sablon-steps", onKeyDown: onStepKey, children: [
          /* @__PURE__ */ jsx(Stepper, { label: p.steps.label, steps: stepperItems, onSelect: (i) => goStep(i, "title") }),
          /* @__PURE__ */ jsxs("div", { className: "bc-sablon-step-head", children: [
            /* @__PURE__ */ jsxs("h2", { ref: stepTitle, id: `${pid}-st`, tabIndex: -1, className: "bc-sablon-step-title", children: [
              step.title,
              " ",
              /* @__PURE__ */ jsxs("span", { className: "bc-sablon-step-count", children: [
                cur + 1,
                "/",
                steps.length,
                ". l\xE9p\xE9s"
              ] })
            ] }),
            step.description && /* @__PURE__ */ jsx("p", { className: "bc-sablon-step-desc", children: step.description })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bc-stack", role: "group", "aria-labelledby": `${pid}-st`, children: content })
        ] }) : content,
        /* @__PURE__ */ jsxs("div", { className: "bc-sablon-bar", children: [
          /* @__PURE__ */ jsx("div", { className: "bc-sablon-bar-note", children: ownStepErrors.length > 0 ? /* @__PURE__ */ jsxs("p", { className: "bc-sablon-step-error", role: "alert", children: [
            STEP_STATE_ERROR(ownStepErrors.length),
            ", miel\u0151tt tov\xE1bbl\xE9psz."
          ] }) : saved && !dirty ? /* @__PURE__ */ jsx(BeeMoment, { inline: true, pillanat: "mentve" }) : dirty ? /* @__PURE__ */ jsxs("p", { className: "bc-sablon-dirty", children: [
            /* @__PURE__ */ jsx("span", { className: "bc-sablon-dot", "aria-hidden": "true" }),
            "Nem mentett v\xE1ltoz\xE1sok"
          ] }) : null }),
          /* @__PURE__ */ jsxs(FormActions, { children: [
            cancel,
            steps && cur > 0 && /* @__PURE__ */ jsx(Button, { variant: "secondary", icon: /* @__PURE__ */ jsx(IcLeft, {}), disabled: busy, onClick: () => goStep(cur - 1, "title"), children: p.steps.backLabel ?? "Vissza" }),
            last ? /* @__PURE__ */ jsx(Button, { type: "submit", busy, done, icon: p.submitIcon ?? /* @__PURE__ */ jsx(IcSave, {}), "aria-keyshortcuts": keys, children: p.submitLabel ?? "Ment\xE9s" }, "bc-submit") : /* @__PURE__ */ jsx(Button, { type: "button", ref: nextBtn, icon: /* @__PURE__ */ jsx(IcRight, {}), onClick: next, children: p.steps.nextLabel ?? "Tov\xE1bb" }, "bc-next")
          ] })
        ] })
      ] }),
      preview && /* @__PURE__ */ jsxs("aside", { className: "bc-sablon-preview", "aria-labelledby": `${pid}-pv`, children: [
        /* @__PURE__ */ jsx("h2", { id: `${pid}-pv`, className: "bc-sablon-aside-title", children: p.previewLabel ?? "El\u0151n\xE9zet" }),
        preview
      ] })
    ] }) }),
    guard.dialog
  ] });
}

export {
  EditPage
};
