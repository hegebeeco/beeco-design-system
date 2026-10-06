/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  EmptyState
} from "./chunk-JRQOK474.js";
import {
  Button
} from "./chunk-YZUSUFMW.js";
import {
  cx
} from "./chunk-4HTA5F62.js";

// react/src/adat/DataState.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DataState({ status, what = "az adatokat", error, onRetry, retrying, empty, skeleton, children }) {
  if (status === "ready") return /* @__PURE__ */ jsx(Fragment, { children });
  if (status === "loading")
    return skeleton ? /* @__PURE__ */ jsx("div", { role: "status", "aria-label": `Bet\xF6lt\xF6m ${what}\u2026`, children: skeleton }) : /* @__PURE__ */ jsxs("div", { className: "bc-state", role: "status", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-spinner", "aria-hidden": "true" }),
      " Bet\xF6lt\xF6m ",
      what,
      "\u2026"
    ] });
  if (status === "empty") return /* @__PURE__ */ jsx(Fragment, { children: empty ?? /* @__PURE__ */ jsx(EmptyState, { compact: true, title: "M\xE9g nincs adat", children: "Ha lesz, itt l\xE1tod." }) });
  if (status === "forbidden")
    return /* @__PURE__ */ jsx("div", { className: "bc-alert is-warning bc-state-box", children: /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("strong", { children: "Ehhez nincs jogosults\xE1god." }),
      " Ha sz\xFCks\xE9ged van r\xE1, k\xE9rj hozz\xE1f\xE9r\xE9st egy admint\xF3l."
    ] }) });
  return /* @__PURE__ */ jsxs("div", { className: "bc-alert is-danger bc-state-box", role: "alert", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("strong", { children: error ?? `Nem siker\xFClt bet\xF6lteni ${what}.` }),
      " Ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra."
    ] }),
    onRetry && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", busy: retrying, onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
  ] });
}
function SkeletonRows({ rows = 5, cols }) {
  return /* @__PURE__ */ jsx(Fragment, { children: Array.from({ length: rows }, (_, r) => /* @__PURE__ */ jsx("tr", { className: "bc-skel-row", "aria-hidden": "true", children: Array.from({ length: cols }, (_2, c) => /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx("span", { className: "bc-skeleton", style: { width: `${55 + (r * 7 + c * 13) % 40}%` } }) }, c)) }, r)) });
}
function DataNote({ title, children, tone = "info", className }) {
  return /* @__PURE__ */ jsxs("aside", { className: cx("bc-alert", `is-${tone}`, "bc-note", className), "aria-label": title ?? "Megjegyz\xE9s az adatokhoz", children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
      /* @__PURE__ */ jsx("path", { d: "M12 11v6M12 7.5v.5" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      title && /* @__PURE__ */ jsx("strong", { children: title }),
      /* @__PURE__ */ jsx("div", { className: "bc-note-body", children })
    ] })
  ] });
}

export {
  DataState,
  SkeletonRows,
  DataNote
};
