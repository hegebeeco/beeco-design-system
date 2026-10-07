/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useReturnFocus
} from "./chunk-FSQ5GEYV.js";
import {
  keepToasts
} from "./chunk-M3HNDASB.js";
import {
  Button
} from "./chunk-E5CUZH7I.js";
import {
  IcOk,
  IcTrash
} from "./chunk-BWSUD5Z6.js";
import {
  cx
} from "./chunk-42HXLUBI.js";

// react/src/reteg/ConfirmDialog.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var defaultError = (e) => `Nem siker\xFClt${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra.`;
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel,
  confirmIcon,
  cancelLabel = "M\xE9gse",
  danger,
  onConfirm,
  confirmDisabled,
  errorText = defaultError,
  initialFocus = "cancel",
  extra,
  size = "sm",
  className
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const cancelRef = useRef(null);
  const focus = useReturnFocus();
  const change = (next) => {
    if (busy && !next) return;
    if (!next) setError(null);
    onOpenChange(next);
  };
  const run = async () => {
    if (busy || confirmDisabled) return;
    setError(null);
    try {
      const r = onConfirm();
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      onOpenChange(false);
    } catch (e) {
      setBusy(false);
      setError(errorText(e));
    }
  };
  return /* @__PURE__ */ jsx(Dialog.Root, { open, onOpenChange: change, children: /* @__PURE__ */ jsx(Dialog.Portal, { children: /* @__PURE__ */ jsx(Dialog.Overlay, { className: "bc-scrim", children: /* @__PURE__ */ jsxs(
    Dialog.Content,
    {
      role: "alertdialog",
      ...children ? {} : { "aria-describedby": void 0 },
      className: cx("bc-modal is-layer", size === "sm" && "is-sm", className),
      onOpenAutoFocus: (e) => {
        focus.remember();
        e.preventDefault();
        const target = initialFocus === "cancel" ? cancelRef.current : initialFocus();
        (target ?? cancelRef.current)?.focus();
      },
      onCloseAutoFocus: focus.restore,
      onPointerDownOutside: (e) => e.preventDefault(),
      onInteractOutside: keepToasts,
      onEscapeKeyDown: (e) => {
        if (busy) e.preventDefault();
      },
      onKeyDown: (e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          e.preventDefault();
          void run();
        }
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "bc-modal-head", children: /* @__PURE__ */ jsx(Dialog.Title, { asChild: true, children: /* @__PURE__ */ jsx("h2", { children: title }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "bc-modal-body", children: [
          children && /* @__PURE__ */ jsx(Dialog.Description, { asChild: true, children: typeof children === "string" ? /* @__PURE__ */ jsx("p", { children }) : /* @__PURE__ */ jsx("div", { children }) }),
          extra,
          error && /* @__PURE__ */ jsx("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx("p", { children: error }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bc-modal-foot", children: [
          /* @__PURE__ */ jsx(Button, { ref: cancelRef, variant: "secondary", disabled: busy, onClick: () => change(false), children: cancelLabel }),
          /* @__PURE__ */ jsx(Button, { variant: danger ? "danger" : "primary", busy, disabled: confirmDisabled, icon: confirmIcon ?? (danger ? /* @__PURE__ */ jsx(IcTrash, {}) : /* @__PURE__ */ jsx(IcOk, {})), onClick: () => void run(), children: confirmLabel })
        ] })
      ]
    }
  ) }) }) });
}

export {
  ConfirmDialog
};
