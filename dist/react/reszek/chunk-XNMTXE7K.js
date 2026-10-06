/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Bee
} from "./chunk-DBIACAMN.js";
import {
  say
} from "./chunk-ALGDDMVX.js";
import {
  cx
} from "./chunk-MW6TFN7W.js";

// react/src/meh/BeeMoment.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function BeeMoment({ pillanat, poen, sima, szerep, action, inline, valtozat, live, className }) {
  const m = pillanat ? say(pillanat, valtozat) : null;
  const title = poen ?? m?.poen;
  const text = sima ?? m?.sima;
  const who = szerep ?? m?.meh ?? "piheno";
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-moment", inline && "is-inline", className), role: live, "data-pillanat": pillanat, children: [
    /* @__PURE__ */ jsx(Bee, { szerep: who, size: inline ? "s" : "m" }),
    title && /* @__PURE__ */ jsx("p", { className: "bc-moment-title", children: title }),
    text && /* @__PURE__ */ jsx("p", { className: "bc-moment-text", children: text }),
    action && /* @__PURE__ */ jsx("div", { className: "bc-moment-action", children: action })
  ] });
}

export {
  BeeMoment
};
