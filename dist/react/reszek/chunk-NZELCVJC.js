/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  IconButton
} from "./chunk-E5CUZH7I.js";

// react/src/reteg/Tooltip.tsx
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var lastTab = 0;
if (typeof document !== "undefined") document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") lastTab = Date.now();
}, true);
var TooltipIconButton = forwardRef(function TooltipIconButton2({ label, children, side = "top", onBlur, onClick, onKeyDown, onPointerDown, ...rest }, ref) {
  const [open, setOpen] = useState(false);
  const pointer = useRef(false);
  const hover = useRef(void 0);
  return /* @__PURE__ */ jsx(TooltipPrimitive.Provider, { delayDuration: 500, skipDelayDuration: 300, children: /* @__PURE__ */ jsxs(TooltipPrimitive.Root, { open, onOpenChange: (o) => {
    if (!o) setOpen(false);
  }, children: [
    /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { asChild: true, "aria-describedby": void 0, children: /* @__PURE__ */ jsx(
      IconButton,
      {
        ref,
        "aria-label": label,
        ...rest,
        onPointerDown: (e) => {
          pointer.current = true;
          clearTimeout(hover.current);
          setOpen(false);
          onPointerDown?.(e);
        },
        onPointerEnter: (e) => {
          if (e.pointerType === "mouse") {
            clearTimeout(hover.current);
            hover.current = setTimeout(() => setOpen(true), 500);
          }
        },
        onPointerLeave: () => {
          pointer.current = false;
          clearTimeout(hover.current);
          setOpen(false);
        },
        onFocus: () => {
          if (!pointer.current && Date.now() - lastTab < 300) setOpen(true);
        },
        onBlur: (e) => {
          setOpen(false);
          pointer.current = false;
          onBlur?.(e);
        },
        onClick: (e) => {
          setOpen(false);
          onClick?.(e);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " " || e.key === "Escape") setOpen(false);
          onKeyDown?.(e);
        },
        children
      }
    ) }),
    /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Content, { className: "bc-tooltip", side, sideOffset: 6, collisionPadding: 8, "aria-hidden": "true", children: label }) })
  ] }) });
});

export {
  TooltipIconButton
};
