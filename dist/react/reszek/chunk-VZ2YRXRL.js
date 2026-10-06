/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-MGWI3LRM.js";

// react/src/media/Avatar.tsx
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
var DIGRAPH = /^(dzs|cs|dz|gy|ly|ny|sz|ty|zs)/i;
var firstLetter = (w) => {
  const m = w.match(DIGRAPH);
  return m ? m[0][0].toUpperCase() + m[0].slice(1).toLowerCase() : w.charAt(0).toUpperCase();
};
function initials(name) {
  const words = name.trim().split(/\s+/).filter((w) => /\p{L}/u.test(w));
  if (!words.length) return "?";
  if (words.length === 1) return firstLetter(words[0]);
  return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
}
function Avatar({ name, src, size = 40, shape = "circle", decorative = false, className }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const showImg = src && !broken;
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cx("bc-avatar", `is-${size}`, shape === "square" && "is-square", className),
      role: showImg || decorative ? void 0 : "img",
      "aria-label": showImg || decorative ? void 0 : name,
      "aria-hidden": decorative && !showImg ? true : void 0,
      children: showImg ? /* @__PURE__ */ jsx("img", { src, alt: decorative ? "" : name, onError: () => setBroken(true) }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: initials(name) })
    }
  );
}

export {
  initials,
  Avatar
};
