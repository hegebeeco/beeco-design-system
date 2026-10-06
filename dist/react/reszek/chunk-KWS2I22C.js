/* beeco design system 1.47.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  CloseIcon
} from "./chunk-ZOLVBMFZ.js";
import {
  LayerCloseContext,
  useCloseGuard
} from "./chunk-5CVUSKGB.js";
import {
  keepToasts
} from "./chunk-TGNA4BID.js";
import {
  firstTabbable,
  useReturnFocus
} from "./chunk-KN5KKW7L.js";
import {
  IconButton
} from "./chunk-3RAKH2ZV.js";
import {
  cx
} from "./chunk-4C25CCAY.js";

// react/src/reteg/Drawer.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Drawer({ open, onOpenChange, title, description, size = "md", footer, busy, dirty, initialFocus, closeLabel = "Panel bez\xE1r\xE1sa", className, children }) {
  const guard = useCloseGuard({ onOpenChange, dirty, busy });
  const focus = useReturnFocus();
  const head = useRef(null);
  return /* @__PURE__ */ jsx(Dialog.Root, { open, onOpenChange: guard.change, children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [
    /* @__PURE__ */ jsx(Dialog.Overlay, { className: "bc-scrim is-drawer" }),
    /* @__PURE__ */ jsx(
      Dialog.Content,
      {
        className: cx("bc-drawer", size === "wide" && "is-wide", className),
        ...description ? {} : { "aria-describedby": void 0 },
        onOpenAutoFocus: (e) => {
          focus.remember();
          const target = initialFocus?.() ?? firstTabbable(head.current);
          if (target) {
            e.preventDefault();
            target.focus();
          }
        },
        onCloseAutoFocus: focus.restore,
        onInteractOutside: keepToasts,
        children: /* @__PURE__ */ jsxs(LayerCloseContext.Provider, { value: guard.requestClose, children: [
          /* @__PURE__ */ jsxs("div", { className: "bc-drawer-head", ref: head, children: [
            /* @__PURE__ */ jsxs("div", { className: "bc-layer-titles", children: [
              /* @__PURE__ */ jsx(Dialog.Title, { asChild: true, children: /* @__PURE__ */ jsx("h2", { children: title }) }),
              description && /* @__PURE__ */ jsx(Dialog.Description, { className: "bc-layer-desc", children: description })
            ] }),
            /* @__PURE__ */ jsx(IconButton, { "aria-label": closeLabel, disabled: busy, onClick: guard.requestClose, children: /* @__PURE__ */ jsx(CloseIcon, {}) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bc-drawer-body", children }),
          footer && /* @__PURE__ */ jsx("div", { className: "bc-drawer-foot", children: footer }),
          guard.discardDialog
        ] })
      }
    )
  ] }) });
}

export {
  Drawer
};
