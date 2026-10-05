/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-FXE4ZZPK.js";

// react/src/meh/Bee.tsx
import { jsx } from "react/jsx-runtime";
function Bee({ szerep, size = "m", buzz = true, label, className }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-szerep": szerep,
      className: cx("bc-bee", size !== "m" && `is-${size}`, buzz && "is-buzz", className),
      ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }
    }
  );
}

export {
  Bee
};
