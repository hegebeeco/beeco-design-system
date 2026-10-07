/* beeco design system 1.51.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  fmt
} from "./chunk-KPAJG4PO.js";
import {
  Button,
  IconButton
} from "./chunk-RRMQQIT4.js";
import {
  cx
} from "./chunk-HJFOG57B.js";

// react/src/adat/DataTableParts.tsx
import { useEffect, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SortHeader({ label, sorted, onToggle }) {
  const next = sorted === "asc" ? "cs\xF6kken\u0151 sorrend" : sorted === "desc" ? "rendez\xE9s kikapcsol\xE1sa" : "n\xF6vekv\u0151 sorrend";
  return /* @__PURE__ */ jsxs("button", { type: "button", className: "bc-sort bc-dt-sort", onClick: onToggle, title: `Rendez\xE9s: ${next}`, children: [
    label,
    /* @__PURE__ */ jsxs("svg", { className: cx("bc-dt-sorticon", sorted && `is-${sorted}`), viewBox: "0 0 12 16", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("path", { className: "is-up", d: "M6 1l4 5H2z" }),
      /* @__PURE__ */ jsx("path", { className: "is-down", d: "M6 15l4-5H2z" })
    ] })
  ] });
}
function SelectCell({ checked, indeterminate, disabled, label, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  return /* @__PURE__ */ jsx("label", { className: "bc-dt-check", children: /* @__PURE__ */ jsx("input", { ref, type: "checkbox", checked, disabled, onChange, "aria-label": label }) });
}
function ExpandToggle({ expanded, controls, label, onToggle }) {
  return /* @__PURE__ */ jsx(IconButton, { className: "bc-dt-expand", "aria-label": `R\xE9szletek: ${label}`, "aria-expanded": expanded, "aria-controls": expanded ? controls : void 0, onClick: onToggle, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M9 6l6 6-6 6" }) }) });
}
var STEP = 16;
function ColumnResizer({ header, label }) {
  const col = header.column;
  const size = col.getSize();
  const min = col.columnDef.minSize ?? 64, max = col.columnDef.maxSize ?? 800;
  const set = (v) => header.getContext().table.setColumnSizing((old) => ({ ...old, [col.id]: Math.max(min, Math.min(max, v)) }));
  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      set(size + (e.key === "ArrowRight" ? STEP : -STEP));
    }
    if (e.key === "Home") {
      e.preventDefault();
      col.resetSize();
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "separator",
      "aria-orientation": "vertical",
      "aria-label": `${label} oszlop sz\xE9less\xE9ge`,
      "aria-valuenow": Math.round(size),
      "aria-valuemin": min,
      "aria-valuemax": Math.min(max, 2e3),
      tabIndex: 0,
      className: cx("bc-dt-resizer", col.getIsResizing() && "is-resizing"),
      onKeyDown: onKey,
      onMouseDown: header.getResizeHandler(),
      onTouchStart: header.getResizeHandler(),
      onDoubleClick: () => col.resetSize()
    }
  );
}
function BulkBar({ count, max, itemLabel, notice, onClear, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bc-dt-bulk", role: "region", "aria-label": "T\xF6meges m\u0171veletek", children: [
    /* @__PURE__ */ jsxs("p", { className: "bc-dt-bulk-count", children: [
      /* @__PURE__ */ jsxs("strong", { children: [
        fmt(count),
        " kijel\xF6lt"
      ] }),
      " ",
      itemLabel,
      max ? /* @__PURE__ */ jsxs("span", { className: "bc-muted", children: [
        " (",
        fmt(count),
        "/",
        fmt(max),
        ")"
      ] }) : null
    ] }),
    notice && /* @__PURE__ */ jsx("p", { className: "bc-notice", children: notice }),
    /* @__PURE__ */ jsxs("div", { className: "bc-dt-bulk-actions", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: onClear, children: "Kijel\xF6l\xE9s t\xF6rl\xE9se" }),
      children
    ] })
  ] });
}

export {
  SortHeader,
  SelectCell,
  ExpandToggle,
  ColumnResizer,
  BulkBar
};
