/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  HU_OUTLINE,
  MINI,
  formatLatLng,
  inHungary,
  project
} from "./chunk-LOIVEZKT.js";

// react/src/kieg2/MiniMap.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function MiniMap({ point }) {
  const outline = HU_OUTLINE.map(([lng, lat]) => {
    const p = project({ lat, lng });
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
  const pin = point ? project(point) : null;
  const inside = !!pin && pin.x >= 0 && pin.x <= MINI.w && pin.y >= 0 && pin.y <= MINI.h;
  const name = point ? `V\xE1zlatos el\u0151n\xE9zet: ${formatLatLng(point)}${inHungary(point) ? "" : inside ? " \u2013 Magyarorsz\xE1gon k\xEDv\xFCl" : " \u2013 a v\xE1zlaton k\xEDv\xFCl esik"}` : "V\xE1zlatos el\u0151n\xE9zet: m\xE9g nincs kiv\xE1lasztott pont";
  return /* @__PURE__ */ jsxs("figure", { className: "bc-loc-mini", children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: `0 0 ${MINI.w} ${MINI.h}`, role: "img", "aria-label": name, preserveAspectRatio: "xMidYMid meet", children: [
      /* @__PURE__ */ jsx("polygon", { className: "bc-loc-mini-land", points: outline }),
      pin && inside && /* @__PURE__ */ jsxs("g", { className: "bc-loc-mini-pin", transform: `translate(${pin.x.toFixed(1)} ${pin.y.toFixed(1)})`, children: [
        /* @__PURE__ */ jsx("path", { d: "M0 0 C -2 -4 -6 -7 -6 -11 A 6 6 0 1 1 6 -11 C 6 -7 2 -4 0 0 Z" }),
        /* @__PURE__ */ jsx("circle", { cy: "-11", r: "2.2" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("figcaption", { className: "bc-loc-mini-cap", children: !point ? "M\xE9g nincs pont \u2013 keress c\xEDmet, vagy \xEDrd be a koordin\xE1t\xE1kat." : !inside ? "A pont a v\xE1zlaton k\xEDv\xFCl esik." : "V\xE1zlatos el\u0151n\xE9zet \u2013 a pontos helyet a koordin\xE1t\xE1k adj\xE1k." })
  ] });
}

export {
  MiniMap
};
