/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  REVEAL_STEPS
} from "./chunk-4U5AAVWT.js";
import {
  Bee
} from "./chunk-DCNIJFGI.js";
import {
  HexLoader
} from "./chunk-VX625S5W.js";
import {
  cx
} from "./chunk-PFNFGQD5.js";

// react/src/kieg2/DrawStage.tsx
import { forwardRef } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DrawSpinner({ step, name, waiting }) {
  return /* @__PURE__ */ jsxs("div", { className: "bc-draw-stage", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx(Bee, { szerep: "futar", size: "s", buzz: false, className: "bc-draw-runner" }),
    /* @__PURE__ */ jsx("div", { className: "bc-draw-comb", children: REVEAL_STEPS.map((_, i) => /* @__PURE__ */ jsx("i", { className: cx(i <= step && "is-on") }, i)) }),
    /* @__PURE__ */ jsx("p", { className: "bc-draw-ticker", children: waiting ? /* @__PURE__ */ jsx(HexLoader, { label: "M\xE9g sorsolunk" }) : name }, step)
  ] });
}
var WinnerCard = forwardRef(function WinnerCard2({ winner, prize, test, attempt, animate }, ref) {
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-draw-winner", animate && "bc-anim-stamp"), "data-winner": winner.id, children: [
    /* @__PURE__ */ jsx(Bee, { szerep: "bajnok", size: "m", buzz: animate }),
    /* @__PURE__ */ jsxs("div", { className: "bc-draw-winner-body", children: [
      /* @__PURE__ */ jsx("p", { className: "bc-draw-kicker", children: attempt > 1 ? `\xDAj nyertes \u2013 ${attempt}. h\xFAz\xE1s` : /* @__PURE__ */ jsxs(Fragment, { children: [
        "Z\xFCmm, megvan! ",
        /* @__PURE__ */ jsx("span", { children: "Kisorsoltuk a nyertest." })
      ] }) }),
      /* @__PURE__ */ jsx("h3", { className: "bc-draw-name", ref, tabIndex: -1, children: winner.name }),
      winner.detail && /* @__PURE__ */ jsx("p", { className: "bc-draw-detail", children: winner.detail }),
      /* @__PURE__ */ jsxs("p", { className: "bc-draw-prize", children: [
        "Nyerem\xE9ny: ",
        prize
      ] }),
      test && /* @__PURE__ */ jsx("p", { className: "bc-badge is-warning bc-draw-test", children: "Teszt-sorsol\xE1s \u2013 nem \xE9les eredm\xE9ny" })
    ] })
  ] });
});

export {
  DrawSpinner,
  WinnerCard
};
