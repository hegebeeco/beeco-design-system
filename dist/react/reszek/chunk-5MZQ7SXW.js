/* beeco design system 1.47.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  SegmentedControl
} from "./chunk-C5VURLED.js";
import {
  useCtl
} from "./chunk-SKA3ETR2.js";
import {
  SortSelect
} from "./chunk-4SDQFXFN.js";
import {
  DefaultCell,
  expandColumn,
  headerText,
  metaOf,
  selectColumn,
  wrapColumn
} from "./chunk-63JVGOJK.js";
import {
  DataState,
  SkeletonRows
} from "./chunk-AZYMQ7P2.js";
import {
  BulkBar,
  ColumnResizer,
  SortHeader
} from "./chunk-7YFIEPAH.js";
import {
  EmptyState
} from "./chunk-7Q3LF2EL.js";
import {
  useWidth
} from "./chunk-WQNXIG4Y.js";
import {
  HelpButton
} from "./chunk-HRWZQVCF.js";
import {
  Pagination
} from "./chunk-CEWVK33Z.js";
import {
  cx
} from "./chunk-4C25CCAY.js";

// react/src/adat/DataTable.tsx
import { useEffect, Fragment, useId, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { jsx, jsxs } from "react/jsx-runtime";
var KARTYA_MAX = 640;
var SEGED = 44;
function rejtettOszlopok(oszlopok, szelesseg, kartya, segedSzam) {
  if (kartya) return oszlopok.filter((o) => o.card === "detail").map((o) => o.id);
  if (!szelesseg || !oszlopok.some((o) => o.priority && o.priority > 1)) return [];
  let kell = oszlopok.reduce((n, o) => n + o.size, 0) + segedSzam * SEGED;
  const jeloltek = [...oszlopok.filter((o) => o.priority === 3).reverse(), ...oszlopok.filter((o) => o.priority === 2).reverse()];
  const rejtett = [];
  for (const o of jeloltek) {
    if (kell + (rejtett.length ? 0 : SEGED) <= szelesseg) break;
    rejtett.push(o.id);
    kell -= o.size;
  }
  return rejtett;
}
function DataTable(p) {
  const { data, caption, getRowId, rowLabel, itemLabel = "sor", status = "ready", selectable, maxSelection, renderExpanded, resizable, mobile = "scroll" } = p;
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const detailId = (id) => `${uid}-d-${id}`;
  const [sorting, setSorting] = useCtl(p.sorting, p.onSortingChange, []);
  const [selection, setSelection] = useCtl(p.selection, p.onSelectionChange, {});
  const [pagination, setPagination] = useCtl(p.pagination, p.onPaginationChange, { pageIndex: 0, pageSize: (p.pageSizes ?? [10, 25, 100])[1] ?? 25 });
  const [density, setDensity] = useCtl(p.density, p.onDensityChange, p.defaultDensity ?? "comfortable");
  const [expanded, setExpanded] = useState({});
  const [notice, setNotice] = useState();
  const server = p.serverRowCount !== void 0;
  const gyoker = useRef(null);
  const szelesseg = useWidth(gyoker);
  const kartya = mobile === "cards" && szelesseg > 0 && szelesseg <= KARTYA_MAX;
  const rejtett = useMemo(() => rejtettOszlopok(
    p.columns.map((c) => {
      const m = c.meta ?? {};
      const a = c;
      return { id: a.id ?? a.accessorKey ?? "", size: c.size ?? 160, priority: m.priority, card: m.card };
    }),
    szelesseg,
    kartya,
    (selectable ? 1 : 0) + (renderExpanded ? 1 : 0)
  ), [p.columns, szelesseg, kartya, selectable, renderExpanded]);
  const lenyito = Boolean(renderExpanded) || rejtett.length > 0;
  const lathatosag = useMemo(() => Object.fromEntries(rejtett.map((id) => [id, false])), [rejtett]);
  const columns = useMemo(() => [
    ...selectable ? [selectColumn(rowLabel)] : [],
    ...lenyito ? [expandColumn(rowLabel, detailId)] : [],
    ...p.columns.map(wrapColumn)
  ], [p.columns, selectable, lenyito]);
  const table = useReactTable({
    data,
    columns,
    getRowId,
    columnResizeMode: "onChange",
    enableColumnResizing: Boolean(resizable),
    defaultColumn: { cell: DefaultCell, sortUndefined: "last", size: 160, minSize: 64 },
    state: { sorting, rowSelection: selection, pagination, expanded, columnVisibility: lathatosag },
    onSortingChange: (u) => {
      setSorting(u);
      setPagination((o) => ({ ...o, pageIndex: 0 }));
    },
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onRowSelectionChange: (u) => {
      const next = typeof u === "function" ? u(selection) : u;
      const n = Object.values(next).filter(Boolean).length;
      if (maxSelection && n > maxSelection) {
        setNotice(`${maxSelection}/${maxSelection} \u2013 t\xF6bb nem jel\xF6lhet\u0151 ki.`);
        return;
      }
      setNotice(void 0);
      setSelection(next);
    },
    enableRowSelection: Boolean(selectable),
    getRowCanExpand: (r) => rejtett.length > 0 || Boolean(renderExpanded) && (p.canExpand?.(r.original) ?? true),
    getCoreRowModel: getCoreRowModel(),
    ...server ? { manualSorting: true, manualPagination: true, rowCount: p.serverRowCount } : { getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() },
    autoResetPageIndex: false
  });
  const total = server ? p.serverRowCount ?? 0 : table.getPrePaginationRowModel().rows.length;
  const lapSzam = server ? 0 : table.getPageCount();
  useEffect(() => {
    if (!server && pagination.pageIndex > 0 && pagination.pageIndex > Math.max(0, lapSzam - 1)) setPagination({ ...pagination, pageIndex: Math.max(0, lapSzam - 1) });
  }, [server, lapSzam, pagination, setPagination]);
  const selIds = Object.keys(selection).filter((k) => selection[k]);
  const leafs = table.getVisibleLeafColumns();
  const pinCount = leafs.findIndex((c) => !c.id.startsWith("_")) + 1;
  const pinStyle = (i) => i < pinCount ? { left: `calc(var(--bc-tap) * ${i})` } : void 0;
  const cardCls = (c) => {
    const m = metaOf(c);
    return cx(m.pinEnd && "is-pin-end", m.card && `is-card-${m.card}`);
  };
  const clear = () => {
    setSelection({});
    setNotice(void 0);
  };
  const rows = table.getRowModel().rows;
  const body = status !== "ready" || !data.length;
  return /* @__PURE__ */ jsxs("div", { ref: gyoker, className: cx("bc-dt", p.bare && "is-bare", density === "dense" && "is-dense", mobile === "cards" && "is-cards", rejtett.length > 0 && "has-hidden"), children: [
    /* @__PURE__ */ jsx("p", { className: "bc-sr", "aria-live": "polite", children: selIds.length ? `${selIds.length} kijel\xF6lt ${itemLabel}` : "" }),
    (selectable || p.densityToggle !== false || p.toolbar || p.captionVisible || mobile === "cards") && /* @__PURE__ */ jsx("div", { className: "bc-dt-bar", children: selIds.length ? /* @__PURE__ */ jsx(BulkBar, { count: selIds.length, max: maxSelection, itemLabel, notice, onClear: clear, children: p.bulkActions?.(selIds, clear) }) : /* @__PURE__ */ jsxs("div", { className: "bc-dt-tools", children: [
      p.captionVisible && /* @__PURE__ */ jsx("h3", { className: "bc-dt-title", "aria-hidden": "true", children: caption }),
      mobile === "cards" && /* @__PURE__ */ jsx(SortSelect, { table }),
      p.densityToggle !== false && /* @__PURE__ */ jsx(SegmentedControl, { label: "S\u0171r\u0171s\xE9g", value: density, onChange: setDensity, items: [{ value: "comfortable", label: "K\xE9nyelmes" }, { value: "dense", label: "S\u0171r\u0171" }] }),
      p.toolbar
    ] }) }),
    p.refreshing && /* @__PURE__ */ jsx("div", { className: "bc-dt-progress", role: "status", "aria-label": "Friss\xEDtem a list\xE1t\u2026" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "bc-table-wrap bc-dt-wrap",
        tabIndex: 0,
        role: "region",
        "aria-label": `${caption} \u2013 g\xF6rgethet\u0151 t\xE1bl\xE1zat`,
        style: p.maxHeight ? { "--_dt-max": p.maxHeight } : void 0,
        children: /* @__PURE__ */ jsxs("table", { className: cx("bc-table", density === "dense" && "is-dense", resizable && "is-fixed"), style: resizable ? { width: table.getTotalSize(), minWidth: "100%" } : void 0, children: [
          /* @__PURE__ */ jsx("caption", { className: "bc-sr", children: caption }),
          /* @__PURE__ */ jsx("thead", { children: table.getHeaderGroups().map((g) => /* @__PURE__ */ jsx("tr", { children: g.headers.map((h, i) => {
            const c = h.column, s = c.getIsSorted(), help = metaOf(c).help;
            const head = c.getCanSort() ? /* @__PURE__ */ jsx(SortHeader, { label: flexRender(c.columnDef.header, h.getContext()), sorted: s, onToggle: () => c.toggleSorting(void 0, false) }) : flexRender(c.columnDef.header, h.getContext());
            return /* @__PURE__ */ jsxs(
              "th",
              {
                scope: "col",
                className: cx(metaOf(c).num && "is-num", i < pinCount && "is-pin", c.id.startsWith("_") && "is-util", cardCls(c)),
                style: { width: h.getSize(), ...pinStyle(i) },
                "aria-sort": c.getCanSort() ? s === "asc" ? "ascending" : s === "desc" ? "descending" : "none" : void 0,
                children: [
                  help ? /* @__PURE__ */ jsxs("span", { className: "bc-dt-head", children: [
                    head,
                    /* @__PURE__ */ jsx(HelpButton, { label: headerText(c), srLabel: `${headerText(c)} \u2013 s\xFAg\xF3`, children: help })
                  ] }) : head,
                  resizable && c.getCanResize() && /* @__PURE__ */ jsx(ColumnResizer, { header: h, label: headerText(c) })
                ]
              },
              h.id
            );
          }) }, g.id)) }),
          /* @__PURE__ */ jsx("tbody", { children: status === "loading" ? /* @__PURE__ */ jsx(SkeletonRows, { cols: leafs.length }) : body ? /* @__PURE__ */ jsx("tr", { className: "bc-dt-state", children: /* @__PURE__ */ jsx("td", { colSpan: leafs.length, children: /* @__PURE__ */ jsx(
            DataState,
            {
              status: status === "ready" ? "empty" : status,
              what: `a list\xE1t (${itemLabel})`,
              error: p.error,
              onRetry: p.onRetry,
              empty: p.empty ?? /* @__PURE__ */ jsx(EmptyState, { compact: true, title: "M\xE9g nincs itt semmi", children: "Ha lesz, ebben a list\xE1ban l\xE1tod." })
            }
          ) }) }) : rows.map((r) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("tr", { "data-selected": r.getIsSelected() || void 0, "data-expanded": r.getIsExpanded() || void 0, children: r.getVisibleCells().map((cell, i) => /* @__PURE__ */ jsx(
              "td",
              {
                "data-label": headerText(cell.column),
                style: pinStyle(i),
                className: cx(metaOf(cell.column).num && "is-num", i < pinCount && "is-pin", cell.column.id.startsWith("_") && "is-util", metaOf(cell.column).wrap && "is-wrap", cardCls(cell.column)),
                children: flexRender(cell.column.columnDef.cell, cell.getContext())
              },
              cell.id
            )) }),
            r.getIsExpanded() && lenyito && /* @__PURE__ */ jsx("tr", { className: "bc-dt-detail", id: detailId(r.id), children: /* @__PURE__ */ jsx("td", { colSpan: leafs.length, children: /* @__PURE__ */ jsxs("div", { className: "bc-dt-detail-body", children: [
              rejtett.length > 0 && // a szűk hely miatt elrejtett oszlopok tartalma – billentyűzettel és képernyőolvasóval is elérhető (Javaslat 15, 7.)
              /* @__PURE__ */ jsx("dl", { className: "bc-dt-hidden", children: r.getAllCells().filter((cell) => rejtett.includes(cell.column.id)).map((cell) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("dt", { children: headerText(cell.column) }),
                /* @__PURE__ */ jsx("dd", { children: flexRender(cell.column.columnDef.cell, cell.getContext()) })
              ] }, cell.id)) }),
              renderExpanded && (p.canExpand?.(r.original) ?? true) && renderExpanded(r.original)
            ] }) }) })
          ] }, r.id)) })
        ] })
      }
    ),
    status === "ready" && total > 0 && /* @__PURE__ */ jsx(
      Pagination,
      {
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        total,
        itemLabel,
        pageSizes: p.pageSizes,
        label: `Lapoz\xE1s \u2013 ${caption}`,
        onPageChange: (i) => setPagination((o) => ({ ...o, pageIndex: i })),
        onPageSizeChange: (s) => setPagination({ pageIndex: 0, pageSize: s })
      }
    )
  ] });
}

export {
  rejtettOszlopok,
  DataTable
};
