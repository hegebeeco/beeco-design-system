/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  CloseIcon
} from "./chunk-6REKQ267.js";
import {
  keepToasts
} from "./chunk-M3HNDASB.js";
import {
  firstTabbable,
  useReturnFocus
} from "./chunk-FSQ5GEYV.js";
import {
  IconButton
} from "./chunk-E5CUZH7I.js";
import {
  cx
} from "./chunk-42HXLUBI.js";

// react/src/reteg/StageDialog.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function StageDialog({ open, onOpenChange, title, closable = true, announce = "", fullscreen = false, closeLabel = "Bez\xE1r\xE1s", className, children }) {
  const focus = useReturnFocus();
  const close = useRef(null);
  const sajat = useRef(false);
  const tartalom = useRef(null);
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const a = document.activeElement;
      if (tartalom.current && (!a || a === document.body || !tartalom.current.contains(a) || a.disabled)) tartalom.current.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, closable, announce]);
  useEffect(() => {
    if (!open || !fullscreen) return;
    const el = document.documentElement;
    if (document.fullscreenEnabled && !document.fullscreenElement) {
      el.requestFullscreen?.().then(() => {
        sajat.current = true;
      }).catch(() => {
      });
    }
    return () => {
      if (sajat.current && document.fullscreenElement === el) void document.exitFullscreen?.().catch(() => void 0);
      sajat.current = false;
    };
  }, [open, fullscreen]);
  return /* @__PURE__ */ jsx(Dialog.Root, { open, onOpenChange: (o) => {
    if (o || closable) onOpenChange(o);
  }, children: /* @__PURE__ */ jsx(Dialog.Portal, { children: /* @__PURE__ */ jsxs(
    Dialog.Content,
    {
      ref: tartalom,
      tabIndex: -1,
      className: cx("bc-stage", className),
      "aria-describedby": void 0,
      onOpenAutoFocus: (e) => {
        focus.remember();
        e.preventDefault();
        (close.current && !close.current.disabled ? close.current : firstTabbable(e.currentTarget))?.focus();
      },
      onCloseAutoFocus: focus.restore,
      onEscapeKeyDown: (e) => {
        if (!closable) e.preventDefault();
      },
      onPointerDownOutside: (e) => e.preventDefault(),
      onInteractOutside: keepToasts,
      children: [
        /* @__PURE__ */ jsx(IconButton, { ref: close, className: "bc-stage-close", "aria-label": closeLabel, disabled: !closable, onClick: () => {
          if (closable) onOpenChange(false);
        }, children: /* @__PURE__ */ jsx(CloseIcon, {}) }),
        /* @__PURE__ */ jsxs("div", { className: "bc-stage-body", children: [
          /* @__PURE__ */ jsx(Dialog.Title, { asChild: true, children: /* @__PURE__ */ jsx("h2", { className: "bc-stage-title", children: title }) }),
          children
        ] }),
        /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", "aria-live": "polite", children: announce })
      ]
    }
  ) }) });
}

export {
  StageDialog
};
