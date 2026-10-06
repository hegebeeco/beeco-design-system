/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  ExpandToggle,
  SelectCell
} from "./chunk-XOYRNHRB.js";
import {
  fmt
} from "./chunk-PFWSOZ76.js";

// react/src/adat/dataTableColumns.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var metaOf = (c) => c.columnDef.meta ?? {};
var miss = (v) => v === null || v === "" ? void 0 : v;
var path = (row, key) => key.split(".").reduce((o, k) => o == null ? void 0 : o[k], row);
function wrapColumn(c) {
  const a = c;
  if (typeof a.accessorKey === "string") {
    const key = a.accessorKey;
    const { accessorKey: _drop, ...rest } = a;
    return { ...rest, id: a.id ?? key, accessorFn: (r) => miss(path(r, key)) };
  }
  if (a.accessorFn) {
    const fn = a.accessorFn;
    return { ...a, accessorFn: (r, i) => miss(fn(r, i)) };
  }
  return c;
}
function DefaultCell({ getValue, column }) {
  const v = getValue();
  if (v === void 0) return /* @__PURE__ */ jsxs("span", { className: "bc-dt-missing", children: [
    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2013" }),
    /* @__PURE__ */ jsx("span", { className: "bc-sr", children: "nincs adat" })
  ] });
  if (typeof v === "number") return /* @__PURE__ */ jsx(Fragment, { children: fmt(v, metaOf(column).decimals ?? 0) });
  const s = String(v);
  return /* @__PURE__ */ jsx("span", { className: "bc-dt-text", title: s.length > 40 ? s : void 0, children: s });
}
function selectColumn(rowLabel) {
  return {
    id: "_sel",
    size: 44,
    enableSorting: false,
    enableResizing: false,
    meta: { label: "Kijel\xF6l\xE9s" },
    header: ({ table }) => /* @__PURE__ */ jsx(
      SelectCell,
      {
        label: "Az oldal \xF6sszes sor\xE1nak kijel\xF6l\xE9se",
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onChange: () => table.toggleAllPageRowsSelected()
      }
    ),
    cell: ({ row }) => /* @__PURE__ */ jsx(SelectCell, { label: `Kijel\xF6l\xE9s: ${rowLabel(row.original)}`, checked: row.getIsSelected(), disabled: !row.getCanSelect(), onChange: () => row.toggleSelected() })
  };
}
function expandColumn(rowLabel, detailId) {
  return {
    id: "_exp",
    size: 44,
    enableSorting: false,
    enableResizing: false,
    meta: { label: "R\xE9szletek" },
    header: () => /* @__PURE__ */ jsx("span", { className: "bc-sr", children: "R\xE9szletek" }),
    cell: ({ row }) => row.getCanExpand() ? /* @__PURE__ */ jsx(ExpandToggle, { expanded: row.getIsExpanded(), controls: detailId(row.id), label: rowLabel(row.original), onToggle: () => row.toggleExpanded() }) : null
  };
}
var headerText = (c) => metaOf(c).label ?? (typeof c.columnDef.header === "string" ? c.columnDef.header : c.id);

export {
  metaOf,
  wrapColumn,
  DefaultCell,
  selectColumn,
  expandColumn,
  headerText
};
