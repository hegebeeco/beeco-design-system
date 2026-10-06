/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  groupByDay,
  isoOf,
  timeLabel
} from "./chunk-BA4Z2QCK.js";
import {
  ChevronIcon
} from "./chunk-4LL7QMTV.js";
import {
  DataState
} from "./chunk-BLH7FQ6Q.js";
import {
  EmptyState
} from "./chunk-6TOA6BW7.js";
import {
  Button
} from "./chunk-LQIZVHIZ.js";
import {
  cx
} from "./chunk-MW6TFN7W.js";

// react/src/kieg/Timeline.tsx
import { useId, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var Empty = () => /* @__PURE__ */ jsx("span", { className: "bc-tl-empty", children: "(\xFCres)" });
var isEmpty = (v) => v === null || v === void 0 || v === "";
function Changes({ changes }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return /* @__PURE__ */ jsxs("div", { className: "bc-tl-changes", children: [
    /* @__PURE__ */ jsxs("button", { type: "button", className: "bc-tl-toggle", "aria-expanded": open, "aria-controls": id, onClick: () => setOpen(!open), children: [
      /* @__PURE__ */ jsx(ChevronIcon, { open }),
      changes.length,
      " mez\u0151 v\xE1ltozott"
    ] }),
    open && /* @__PURE__ */ jsx("dl", { id, className: "bc-tl-diff bc-anim-rise", children: changes.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "bc-tl-diff-row", children: [
      /* @__PURE__ */ jsx("dt", { children: c.field }),
      /* @__PURE__ */ jsxs("dd", { children: [
        /* @__PURE__ */ jsxs("del", { children: [
          /* @__PURE__ */ jsx("span", { className: "bc-sr", children: "el\u0151tte: " }),
          isEmpty(c.before) ? /* @__PURE__ */ jsx(Empty, {}) : c.before
        ] }),
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "bc-tl-arrow", children: "\u2192" }),
        /* @__PURE__ */ jsxs("ins", { children: [
          /* @__PURE__ */ jsx("span", { className: "bc-sr", children: ", ut\xE1na: " }),
          isEmpty(c.after) ? /* @__PURE__ */ jsx(Empty, {}) : c.after
        ] })
      ] })
    ] }, i)) })
  ] });
}
function Timeline({ items, status = "ready", onRetry, pageSize = 10, onLoadMore, hasMore, loadingMore, now, empty, label = "El\u0151zm\xE9nyek", className }) {
  const [shown, setShown] = useState(pageSize);
  const visible = onLoadMore ? items : items.slice(0, shown);
  const groups = useMemo(() => groupByDay(visible, now), [visible, now]);
  const rest = onLoadMore ? 0 : items.length - visible.length;
  const more = onLoadMore ? hasMore : rest > 0;
  return /* @__PURE__ */ jsx(
    DataState,
    {
      status: status === "ready" && items.length === 0 ? "empty" : status,
      what: "az el\u0151zm\xE9nyeket",
      onRetry,
      empty: empty ?? /* @__PURE__ */ jsx(EmptyState, { compact: true, title: "M\xE9g nincs bejegyz\xE9s", children: "Ha valaki m\xF3dos\xEDt valamit, itt l\xE1tod: ki, mit \xE9s mikor." }),
      children: /* @__PURE__ */ jsxs("div", { className: cx("bc-tl", className), role: "region", "aria-label": label, children: [
        groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "bc-tl-day", children: [
          /* @__PURE__ */ jsx("h3", { className: "bc-tl-day-h", children: g.label }),
          /* @__PURE__ */ jsx("ol", { className: "bc-tl-list", children: g.items.map((it) => /* @__PURE__ */ jsxs("li", { className: "bc-tl-item", "data-tone": it.tone, children: [
            /* @__PURE__ */ jsx("time", { className: "bc-tl-time", dateTime: isoOf(it.at), children: timeLabel(it.at) }),
            /* @__PURE__ */ jsxs("p", { className: "bc-tl-text", children: [
              /* @__PURE__ */ jsx("strong", { children: it.who }),
              " ",
              it.action,
              it.target ? /* @__PURE__ */ jsxs(Fragment, { children: [
                " ",
                it.target
              ] }) : null
            ] }),
            it.changes && it.changes.length > 0 && /* @__PURE__ */ jsx(Changes, { changes: it.changes })
          ] }, it.id)) })
        ] }, g.key)),
        (more || items.length > pageSize) && /* @__PURE__ */ jsxs("div", { className: "bc-tl-more", children: [
          /* @__PURE__ */ jsxs("span", { className: "bc-tl-count", role: "status", children: [
            visible.length,
            onLoadMore ? "" : `/${items.length}`,
            " bejegyz\xE9s l\xE1tszik"
          ] }),
          more && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", busy: loadingMore, onClick: () => onLoadMore ? onLoadMore() : setShown((s) => s + pageSize), children: onLoadMore ? "M\xE9g t\xF6bb bejegyz\xE9s" : `M\xE9g ${Math.min(pageSize, rest)} bejegyz\xE9s` })
        ] })
      ] })
    }
  );
}

export {
  Timeline
};
