/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  IcOk
} from "./chunk-ELRX4ZP3.js";
import {
  cx
} from "./chunk-MGWI3LRM.js";

// react/src/inputs/Button.tsx
import { forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Button = forwardRef(function Button2({ variant = "primary", size = "md", block, busy, done, icon, className, children, type = "button", disabled, ...rest }, ref) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref,
      type,
      disabled,
      "aria-busy": busy || void 0,
      "aria-disabled": busy || void 0,
      onClickCapture: busy ? (e) => e.preventDefault() : void 0,
      className: cx("bc-btn", variant !== "primary" && `is-${variant}`, size !== "md" && `is-${size}`, block && "is-block", !children && "is-icon", className),
      ...rest,
      children: [
        done ? /* @__PURE__ */ jsx("span", { className: "bc-anim-tick", "aria-hidden": "true", children: /* @__PURE__ */ jsx(IcOk, {}) }) : icon,
        children,
        done && /* @__PURE__ */ jsx("span", { className: "bc-sr", role: "status", children: "K\xE9sz" })
      ]
    }
  );
});
var IconButton = forwardRef(function IconButton2({ danger, className, type = "button", children, ...rest }, ref) {
  return /* @__PURE__ */ jsx("button", { ref, type, className: cx("bc-icon-btn", danger && "is-danger", className), ...rest, children });
});

export {
  Button,
  IconButton
};
