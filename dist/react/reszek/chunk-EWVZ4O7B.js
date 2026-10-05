/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-FXE4ZZPK.js";

// react/src/meh/BeeSprite.tsx
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
function BeeSprite({ szereplo, size = "m", replay, label, className }) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (replay !== void 0) setK((x) => x + 1);
  }, [replay]);
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-szereplo": szereplo,
      className: cx("bc-sprite", size !== "m" && `is-${size}`, className),
      ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }
    },
    k
  );
}

export {
  BeeSprite
};
