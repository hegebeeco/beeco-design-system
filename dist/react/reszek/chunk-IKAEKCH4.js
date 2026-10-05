/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  IcInfo
} from "./chunk-5GI76K7O.js";

// react/src/field/HelpButton.tsx
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var NYIT_MS = 250;
var ZAR_MS = 200;
function HelpButton({ label, children, srLabel }) {
  const [open, setOpen] = useState(false);
  const [rogzitett, setRogzitett] = useState(false);
  const idozito = useRef(void 0);
  useEffect(() => () => window.clearTimeout(idozito.current), []);
  const eger = (e) => e.pointerType === "mouse";
  const be = (e) => {
    if (!eger(e)) return;
    window.clearTimeout(idozito.current);
    idozito.current = window.setTimeout(() => setOpen(true), open ? 0 : NYIT_MS);
  };
  const ki = (e) => {
    if (!eger(e) || rogzitett) return;
    window.clearTimeout(idozito.current);
    idozito.current = window.setTimeout(() => setOpen(false), ZAR_MS);
  };
  const kattint = (e) => {
    window.clearTimeout(idozito.current);
    if (open && !rogzitett) {
      e.preventDefault();
      setRogzitett(true);
      return;
    }
    setRogzitett(!open);
  };
  return /* @__PURE__ */ jsxs(Popover.Root, { open, onOpenChange: (o) => {
    setOpen(o);
    if (!o) setRogzitett(false);
  }, children: [
    /* @__PURE__ */ jsx(Popover.Trigger, { className: "bc-help-btn", "aria-label": srLabel ?? `S\xFAg\xF3: ${label}`, type: "button", onPointerEnter: be, onPointerLeave: ki, onClick: kattint, children: /* @__PURE__ */ jsx(IcInfo, {}) }),
    /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(
      Popover.Content,
      {
        className: "bc-pop",
        side: "top",
        align: "start",
        sideOffset: 6,
        collisionPadding: 16,
        onPointerEnter: be,
        onPointerLeave: ki,
        onOpenAutoFocus: (e) => {
          if (!rogzitett) e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsx("strong", { className: "bc-pop-title", children: label }),
          typeof children === "string" ? /* @__PURE__ */ jsx("p", { children }) : children
        ]
      }
    ) })
  ] });
}

export {
  HelpButton
};
