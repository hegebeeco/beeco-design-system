/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  LineChart
} from "./chunk-IUEUNFMN.js";
import {
  ChartLegend
} from "./chunk-FXZDVQIG.js";
import {
  isEmptyData,
  paletteClass
} from "./chunk-MTL4MSUK.js";
import {
  ChartTable
} from "./chunk-B2FNCEPK.js";
import {
  DataState
} from "./chunk-VDC2PVQ7.js";
import {
  EmptyState
} from "./chunk-CYDTWDWI.js";
import {
  HelpButton
} from "./chunk-S7S44IRI.js";
import {
  cx
} from "./chunk-MGWI3LRM.js";

// react/src/adat/chart/ChartCard.tsx
import { cloneElement, isValidElement, useId, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var KEY = (k) => `bc-howto:${k}`;
var readOpen = (k) => {
  if (!k) return true;
  try {
    return localStorage.getItem(KEY(k)) !== "closed";
  } catch {
    return true;
  }
};
function ChartCard(p) {
  const { title, unit, period, help, howToRead, source, data, children, status = "ready", headingLevel = 3 } = p;
  const id = useId();
  const [howOpen, setHowOpen] = useState(() => readOpen(p.rememberKey));
  const [tableOpen, setTableOpen] = useState(false);
  const H = `h${headingLevel}`;
  const empty = status === "ready" && isEmptyData(data);
  const kind = isValidElement(children) && children.type === LineChart ? "line" : "bar";
  const [offRaw, setOff] = useState(() => /* @__PURE__ */ new Set());
  const toggles = !!p.seriesToggle && kind === "line" && data.series.length > 1;
  const off = new Set([...offRaw].filter((k) => data.series.some((s) => s.key === k)));
  const childData = isValidElement(children) ? children.props.data ?? data : data;
  const mark = (d) => ({ ...d, series: d.series.map((s) => ({ ...s, hidden: off.has(s.key) })) });
  const shown = toggles ? mark(data) : data;
  const chart = toggles && isValidElement(children) ? cloneElement(children, { data: mark(childData) }) : children;
  const toggle = (key) => setOff((cur) => {
    const n = new Set([...cur].filter((k) => data.series.some((s) => s.key === k)));
    if (n.has(key)) n.delete(key);
    else if (data.series.length - n.size > 1) n.add(key);
    return n;
  });
  const pal = paletteClass(data);
  const onHow = (open) => {
    setHowOpen(open);
    if (p.rememberKey) try {
      localStorage.setItem(KEY(p.rememberKey), open ? "open" : "closed");
    } catch {
    }
  };
  return /* @__PURE__ */ jsxs("figure", { className: cx("bc-card", "bc-chart-card", pal, p.className), "aria-labelledby": `${id}-t`, "data-cb": p.cb ? "true" : void 0, children: [
    /* @__PURE__ */ jsx("header", { className: "bc-chart-head", children: /* @__PURE__ */ jsxs("div", { className: "bc-chart-titles", children: [
      /* @__PURE__ */ jsxs("div", { className: "bc-label-row", children: [
        /* @__PURE__ */ jsx(H, { className: "bc-chart-title", id: `${id}-t`, children: title }),
        /* @__PURE__ */ jsx(HelpButton, { label: title, children: help })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "bc-chart-sub", children: [
        unit,
        " \xB7 ",
        period,
        p.sample && /* @__PURE__ */ jsx("span", { className: "bc-badge is-muted", children: "mintaadat" })
      ] })
    ] }) }),
    status === "ready" && !empty && /* @__PURE__ */ jsx(ChartLegend, { data: shown, kind, onToggle: toggles ? toggle : void 0 }),
    /* @__PURE__ */ jsx("div", { className: "bc-chart-body", children: empty ? /* @__PURE__ */ jsx(EmptyState, { compact: true, title: "Ebben az id\u0151szakban nincs adat", action: p.emptyAction, children: "V\xE1lassz hosszabb vagy m\xE1sik id\u0151szakot." }) : /* @__PURE__ */ jsx(DataState, { status, what: "a grafikont", error: p.error, onRetry: p.onRetry, skeleton: /* @__PURE__ */ jsx("span", { className: "bc-skeleton bc-chart-skel" }), children: chart }) }),
    /* @__PURE__ */ jsxs("details", { className: "bc-disclosure", open: howOpen, onToggle: (e) => onHow(e.currentTarget.open), children: [
      /* @__PURE__ */ jsx("summary", { children: "Hogyan olvasd?" }),
      /* @__PURE__ */ jsx("div", { className: "bc-disclosure-body", children: howToRead })
    ] }),
    status === "ready" && !empty && /* @__PURE__ */ jsxs("details", { className: "bc-disclosure", onToggle: (e) => setTableOpen(e.currentTarget.open), children: [
      /* @__PURE__ */ jsxs("summary", { children: [
        "Adatt\xE1bla (",
        data.categories.length,
        " sor)"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bc-disclosure-body", children: tableOpen && /* @__PURE__ */ jsx(ChartTable, { data, caption: title }) })
    ] }),
    /* @__PURE__ */ jsxs("footer", { className: "bc-chart-source", children: [
      "Forr\xE1s: ",
      source
    ] })
  ] });
}

export {
  ChartCard
};
