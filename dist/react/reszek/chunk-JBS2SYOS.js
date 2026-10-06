/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  linear
} from "./chunk-E6NOQYCW.js";
import {
  cx
} from "./chunk-MGWI3LRM.js";

// react/src/adat/chart/Sparkline.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function Sparkline({ values, label, className }) {
  const W = 96, H = 32, P = 4;
  const nums = values.filter((v) => typeof v === "number");
  if (!nums.length) return null;
  const lo = Math.min(...nums), hi = Math.max(...nums);
  const x = linear(0, Math.max(1, values.length - 1), P, W - P);
  const y = linear(lo, hi === lo ? lo + 1 : hi, H - P, P);
  let d = "", pen = false, last = -1;
  values.forEach((v, i) => {
    if (typeof v !== "number") {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
    pen = true;
    last = i;
  });
  return /* @__PURE__ */ jsxs("svg", { className: cx("bc-spark", className), viewBox: `0 0 ${W} ${H}`, width: W, height: H, ...label ? { role: "img", "aria-label": label } : { "aria-hidden": true }, children: [
    /* @__PURE__ */ jsx("path", { className: "bc-line-under", d }),
    /* @__PURE__ */ jsx("path", { className: "bc-line bc-s1", d }),
    /* @__PURE__ */ jsx("circle", { className: "bc-mark bc-s1", cx: x(last), cy: y(values[last]), r: 3.5 })
  ] });
}

export {
  Sparkline
};
