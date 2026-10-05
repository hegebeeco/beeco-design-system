/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-4NETF2NE.js";

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
