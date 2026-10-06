/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  LayerCloseContext,
  useCloseGuard,
  useLayerClose
} from "./chunk-Z4ZUUKAR.js";
import {
  keepToasts
} from "./chunk-TFWWS2XD.js";
import {
  firstField,
  firstTabbable,
  useReturnFocus
} from "./chunk-TALWDK2L.js";
import {
  Button,
  IconButton
} from "./chunk-DNKGFO3X.js";
import {
  cx
} from "./chunk-KBQVEJSX.js";

// react/src/reteg/Modal.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Modal({ open, onOpenChange, title, description, size = "md", footer, busy, dirty, initialFocus, closeLabel = "Bez\xE1r\xE1s", className, children }) {
  const guard = useCloseGuard({ onOpenChange, dirty, busy });
  const body = useRef(null);
  const focus = useReturnFocus();
  return /* @__PURE__ */ jsx(Dialog.Root, { open, onOpenChange: guard.change, children: /* @__PURE__ */ jsx(Dialog.Portal, { children: /* @__PURE__ */ jsx(Dialog.Overlay, { className: "bc-scrim", children: /* @__PURE__ */ jsx(
    Dialog.Content,
    {
      className: cx("bc-modal is-layer", size !== "md" && `is-${size}`, className),
      ...description ? {} : { "aria-describedby": void 0 },
      onOpenAutoFocus: (e) => {
        focus.remember();
        const target = initialFocus?.() ?? firstField(body.current) ?? firstTabbable(body.current?.nextElementSibling);
        if (target) {
          e.preventDefault();
          target.focus();
        }
      },
      onCloseAutoFocus: focus.restore,
      onInteractOutside: keepToasts,
      children: /* @__PURE__ */ jsxs(LayerCloseContext.Provider, { value: guard.requestClose, children: [
        /* @__PURE__ */ jsxs("div", { className: "bc-modal-head", children: [
          /* @__PURE__ */ jsxs("div", { className: "bc-layer-titles", children: [
            /* @__PURE__ */ jsx(Dialog.Title, { asChild: true, children: /* @__PURE__ */ jsx("h2", { children: title }) }),
            description && /* @__PURE__ */ jsx(Dialog.Description, { className: "bc-layer-desc", children: description })
          ] }),
          /* @__PURE__ */ jsx(IconButton, { "aria-label": closeLabel, disabled: busy, onClick: guard.requestClose, children: /* @__PURE__ */ jsx(CloseIcon, {}) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bc-modal-body", ref: body, children }),
        footer && /* @__PURE__ */ jsx("div", { className: "bc-modal-foot", children: footer }),
        guard.discardDialog
      ] })
    }
  ) }) }) });
}
function ModalCancel({ children = "M\xE9gse", disabled }) {
  const close = useLayerClose();
  return /* @__PURE__ */ jsx(Button, { variant: "secondary", disabled, onClick: close, children });
}
function CloseIcon() {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) });
}

export {
  Modal,
  ModalCancel,
  CloseIcon
};
