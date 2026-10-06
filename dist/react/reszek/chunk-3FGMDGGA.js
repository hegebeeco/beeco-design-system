/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/sablon/listState.ts
import { useCallback, useMemo } from "react";
function useListState({ params, setParams }, opts = {}) {
  const sizes = opts.pageSizes ?? [10, 25, 100];
  const kSearch = opts.keys?.search ?? "q", kPage = opts.keys?.page ?? "lap", kSize = opts.keys?.size ?? "meret";
  const filterKeys = opts.filters ?? [];
  const set = useCallback((next) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === void 0 || v === "") p.delete(k);
      else p.set(k, String(v));
    }
    if (!(kPage in next)) p.delete(kPage);
    setParams(p);
  }, [params, setParams, kPage]);
  const lapParam = Number(params.get(kPage));
  const page = Number.isInteger(lapParam) && lapParam > 0 ? lapParam : 0;
  const meretParam = Number(params.get(kSize));
  const pageSize = sizes.includes(meretParam) ? meretParam : sizes[0];
  const search = params.get(kSearch) ?? "";
  const hasFilters = filterKeys.some((k) => Boolean(params.get(k)));
  return useMemo(() => ({
    params,
    search,
    page,
    pageSize,
    hasSearch: search.trim().length > 0,
    hasFilters,
    setSearch: (q) => set({ [kSearch]: q }),
    filter: (k) => params.get(k) ?? "",
    setFilter: (k, v) => set({ [k]: v }),
    setPage: (n) => set({ [kPage]: n > 0 ? n : null }),
    setPagination: ({ pageIndex, pageSize: s }) => set({ [kPage]: s !== pageSize ? null : pageIndex > 0 ? pageIndex : null, [kSize]: s === sizes[0] ? null : s }),
    set,
    clear: () => set(Object.fromEntries([kSearch, ...filterKeys].map((k) => [k, null])))
  }), [params, search, page, pageSize, hasFilters, set, kSearch, kPage, kSize, sizes, filterKeys]);
}
function listStatus({ isPending, isError, hasData, count, filtered, forbidden }) {
  if (forbidden) return "forbidden";
  if (isError && !hasData) return "error";
  if (isPending && !hasData) return "loading";
  if (count === 0) return filtered ? "no-results" : "empty";
  return "ready";
}
var clampPage = (page, totalPages) => Math.max(0, Math.min(page, Math.max(0, totalPages - 1)));

export {
  useListState,
  listStatus,
  clampPage
};
