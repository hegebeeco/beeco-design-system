/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-4NETF2NE.js";

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
