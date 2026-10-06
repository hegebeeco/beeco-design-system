/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-2JNV7AMO.js";

// react/src/marka/Logo.tsx
import { jsx } from "react/jsx-runtime";
function Logo({ size = "m", label = "beeco", className }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cx("bc-logo", size !== "m" && `is-${size}`, className),
      ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }
    }
  );
}

export {
  Logo
};
