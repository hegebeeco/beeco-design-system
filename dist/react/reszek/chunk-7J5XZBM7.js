/* beeco design system 1.50.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  dayTitle
} from "./chunk-NOHRDOV4.js";

// react/src/media/MonthParts.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Ic = ({ icon }) => icon ? /* @__PURE__ */ jsx("span", { className: "bc-mcal-ic", "aria-hidden": "true", children: icon }) : null;
function MonthLegend({ kinds, view, hidden, onHiddenChange }) {
  if (!onHiddenChange) {
    return /* @__PURE__ */ jsx("ul", { className: "bc-mcal-legend", "aria-label": "Jelmagyar\xE1zat", children: kinds.map((k) => {
      const v = view(k);
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("span", { className: `bc-mcal-ev is-${v.tone}`, children: [
        /* @__PURE__ */ jsx(Ic, { icon: v.icon }),
        v.label
      ] }) }, k);
    }) });
  }
  const toggle = (k) => onHiddenChange(hidden.has(k) ? [...hidden].filter((x) => x !== k) : [...hidden, k]);
  return /* @__PURE__ */ jsx("div", { className: "bc-mcal-legend", role: "group", "aria-label": "Jelmagyar\xE1zat \xE9s sz\u0171r\u0151 \u2013 mit mutasson a napt\xE1r", children: kinds.map((k) => {
    const v = view(k);
    return /* @__PURE__ */ jsxs("button", { type: "button", className: `bc-tag bc-mcal-filter is-${v.tone}`, "aria-pressed": !hidden.has(k), onClick: () => toggle(k), children: [
      /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: hidden.has(k) ? "\u25CB" : "\u2713" }),
      /* @__PURE__ */ jsx(Ic, { icon: v.icon }),
      v.label
    ] }, k);
  }) });
}
function MonthAgenda({ iso, events, view }) {
  return /* @__PURE__ */ jsxs("section", { className: "bc-mcal-agenda", children: [
    /* @__PURE__ */ jsx("h3", { className: "bc-mcal-agenda-title", children: dayTitle(iso) }),
    events.length ? /* @__PURE__ */ jsx("ul", { children: events.map((e) => {
      const v = view(e.kind);
      return /* @__PURE__ */ jsxs("li", { className: `bc-mcal-ev is-${v.tone}`, children: [
        /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx(Ic, { icon: v.icon }),
          e.title
        ] }),
        " ",
        /* @__PURE__ */ jsx("span", { className: "bc-mcal-kind", children: v.label })
      ] }, e.id);
    }) }) : /* @__PURE__ */ jsx("p", { className: "bc-mcal-note", children: "Ezen a napon nincs tartalom." })
  ] });
}

export {
  MonthLegend,
  MonthAgenda
};
