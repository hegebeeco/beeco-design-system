/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Sparkline
} from "./chunk-47JUHSSP.js";
import {
  HelpButton
} from "./chunk-WSKDGDS2.js";
import {
  fmt,
  fmtSigned
} from "./chunk-ADA2ZXKE.js";
import {
  Button
} from "./chunk-E5CUZH7I.js";
import {
  cx
} from "./chunk-42HXLUBI.js";

// react/src/adat/StatTile.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function StatTile(p) {
  const { label, help, value, unit, decimals = 0, period, delta, good = "up", n, nLabel = "\xE9rintett", minN = 5, estimate, source, trend } = p;
  const hidden = n !== void 0 && n > 0 && n < minN;
  let body;
  if (p.loading) body = /* @__PURE__ */ jsx("span", { className: "bc-skeleton bc-stat-skel", role: "status", "aria-label": `${label}: bet\xF6lt\xE9s\u2026` });
  else if (p.error) body = /* @__PURE__ */ jsxs("div", { className: "bc-stat-err", role: "alert", children: [
    /* @__PURE__ */ jsx("span", { children: p.error }),
    p.onRetry && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: p.onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
  ] });
  else if (hidden) body = /* @__PURE__ */ jsxs("p", { className: "bc-stat-value is-hidden", children: [
    "rejtve",
    /* @__PURE__ */ jsxs("span", { className: "bc-stat-sub", children: [
      "kevesebb mint ",
      minN,
      " ",
      nLabel,
      " \u2013 adatv\xE9delmi k\xFCsz\xF6b"
    ] })
  ] });
  else if (p.text) body = /* @__PURE__ */ jsx("p", { className: "bc-stat-value is-text", children: p.text });
  else if (value === null) body = /* @__PURE__ */ jsxs("p", { className: "bc-stat-value is-missing", children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2014" }),
    /* @__PURE__ */ jsx("span", { className: "bc-sr", children: "nincs adat" })
  ] });
  else body = /* @__PURE__ */ jsxs("p", { className: "bc-stat-value", children: [
    estimate && /* @__PURE__ */ jsx("span", { title: "becsl\xE9s", children: "~" }),
    fmt(value, decimals),
    unit && /* @__PURE__ */ jsxs("span", { className: "bc-stat-unit", children: [
      " ",
      unit
    ] }),
    estimate && /* @__PURE__ */ jsx("span", { className: "bc-stat-sub", children: "becsl\xE9s" })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-stat", "bc-kpi", p.className), children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-label-row bc-kpi-head", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-stat-label", children: label }),
      /* @__PURE__ */ jsx(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-kpi-main", children: [
      body,
      trend && !hidden && !p.loading && !p.error && /* @__PURE__ */ jsx(Sparkline, { values: trend, className: "bc-kpi-spark" })
    ] }),
    !hidden && !p.loading && !p.error && value !== null && !p.text && delta && /* @__PURE__ */ jsx(Delta, { d: delta, good }),
    (period || n !== void 0 && !hidden) && /* @__PURE__ */ jsxs("p", { className: "bc-kpi-meta", children: [
      period,
      period && n !== void 0 && !hidden ? " \xB7 " : "",
      n !== void 0 && !hidden ? `elemsz\xE1m: ${fmt(n)} ${nLabel}` : ""
    ] }),
    source && /* @__PURE__ */ jsxs("p", { className: "bc-kpi-source", children: [
      "Forr\xE1s: ",
      source
    ] })
  ] });
}
function Delta({ d, good }) {
  if (d === "new") return /* @__PURE__ */ jsx("p", { className: "bc-stat-delta bc-kpi-delta is-neutral", children: "\xFAj \u2013 nincs el\u0151z\u0151 id\u0151szak" });
  const dir = d.value > 0 ? "up" : d.value < 0 ? "down" : "flat";
  const tone = good === "none" || dir === "flat" ? "neutral" : dir === good ? "good" : "bad";
  const arrow = dir === "up" ? "\u25B2" : dir === "down" ? "\u25BC" : "=";
  const unit = d.fromZero ? "" : d.unit === "%" ? "%" : d.unit ? ` ${d.unit}` : "";
  const meaning = tone === "good" ? "j\xF3 ir\xE1ny" : tone === "bad" ? "rossz ir\xE1ny" : "";
  return /* @__PURE__ */ jsxs("p", { className: cx("bc-stat-delta", "bc-kpi-delta", `is-${tone}`), children: [
    /* @__PURE__ */ jsxs("span", { "aria-hidden": "true", children: [
      arrow,
      " "
    ] }),
    fmtSigned(d.value, d.decimals ?? 0),
    unit,
    d.fromZero ? " (el\u0151tte 0)" : "",
    " ",
    d.compare,
    meaning && /* @__PURE__ */ jsxs("span", { className: "bc-kpi-meaning", children: [
      " \xB7 ",
      meaning
    ] })
  ] });
}

export {
  StatTile
};
