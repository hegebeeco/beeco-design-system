/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  usePrintFrame
} from "./chunk-LDSBWUNK.js";
import {
  SablonFrame,
  useTemplateTitle
} from "./chunk-J5NCG7LI.js";
import {
  PageHeader
} from "./chunk-P3R7Y6TP.js";
import {
  BeeMoment
} from "./chunk-WLDWXVNI.js";
import {
  Stagger,
  useCountUp
} from "./chunk-YUG65WGE.js";
import {
  StatTile
} from "./chunk-564AFZTI.js";
import {
  DataState
} from "./chunk-VDC2PVQ7.js";

// react/src/sablon/Dashboard.tsx
import { useId, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Dashboard(p) {
  const { title, description, breadcrumbs, renderLink, status = "ready", stats, charts } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix);
  usePrintFrame(Boolean(p.printable));
  const id = useId();
  return /* @__PURE__ */ jsxs(SablonFrame, { kind: "iranyitopult", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, children: [
    /* @__PURE__ */ jsx(PageHeader, { title, description, breadcrumbs, renderLink, actions: p.actions }),
    (p.period || p.toolbar) && status === "ready" && /* @__PURE__ */ jsxs("div", { className: "bc-sablon-toolbar", children: [
      p.period,
      p.toolbar
    ] }),
    /* @__PURE__ */ jsxs(DataState, { status, what: p.what ?? "az ir\xE1ny\xEDt\xF3pultot", error: p.error, onRetry: p.onRetry, children: [
      p.moment && /* @__PURE__ */ jsx("div", { className: "bc-card bc-sablon-moment", children: /* @__PURE__ */ jsx(BeeMoment, { inline: true, ...p.moment }) }),
      stats && stats.length > 0 && /* @__PURE__ */ jsxs("section", { "aria-labelledby": `${id}-s`, children: [
        /* @__PURE__ */ jsx("h2", { id: `${id}-s`, className: "bc-sr", children: p.statsTitle ?? "F\u0151 sz\xE1mok" }),
        /* @__PURE__ */ jsx(Stagger, { className: "bc-stats bc-sablon-stats", children: stats.map(({ id: key, ...s }) => /* @__PURE__ */ jsx("div", { className: "bc-sablon-stat", children: /* @__PURE__ */ jsx(CountedStat, { ...s }) }, key)) })
      ] }),
      charts && /* @__PURE__ */ jsxs("section", { "aria-labelledby": `${id}-c`, children: [
        /* @__PURE__ */ jsx("h2", { id: `${id}-c`, className: "bc-sr", children: p.chartsTitle ?? "Grafikonok" }),
        /* @__PURE__ */ jsx("div", { className: "bc-sablon-charts", children: charts })
      ] }),
      p.children
    ] })
  ] });
}
function CountedStat(s) {
  const phase = useRef("wait");
  const ready = !s.loading && !s.error && typeof s.value === "number";
  if (phase.current === "wait" && ready) phase.current = "count";
  else if (phase.current === "count" && !ready) phase.current = "done";
  return phase.current === "count" ? /* @__PURE__ */ jsx(Counting, { ...s, value: s.value }) : /* @__PURE__ */ jsx(StatTile, { ...s });
}
function Counting(s) {
  const v = useCountUp(s.value);
  return /* @__PURE__ */ jsx(StatTile, { ...s, value: v });
}

export {
  Dashboard
};
