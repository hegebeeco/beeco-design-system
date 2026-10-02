import { useCallback, useMemo } from 'react';
import type { ListStatus } from './ListPage';

/**
 * Lista-állapot (Javaslat 13/1): keresés, szűrők, lap és lapméret a címsorban (megosztható link, a Vissza visszahoz).
 * Router-független: a projekt adja az URL-olvasót/-írót (React Routerben a useSearchParams párja), így a router tud a változásról.
 *
 *   const [params, setParams] = useSearchParams();
 *   const lista = useListState({ params, setParams: (p) => setParams(p, { replace: true }) }, { filters: ['tipus', 'ho'] });
 */
export type ListStateAdapter = {
  params: URLSearchParams;
  /** Az új paraméterek beírása (célszerűen replace-szel, hogy a gépelés ne töltse a böngésző-előzményt) */
  setParams: (next: URLSearchParams) => void;
};

export type ListStateOptions = {
  /** A szűrők URL-kulcsai (a keresés és a lapozás nélkül) */
  filters?: readonly string[];
  /** Választható lapméretek; az első az alap (az alap nem kerül az URL-be). Alap: [10, 25, 100] */
  pageSizes?: readonly number[];
  /** URL-kulcsok – alap: keresés „q”, lap „lap”, lapméret „meret” */
  keys?: { search?: string; page?: string; size?: string };
};

export type ListState = {
  params: URLSearchParams;
  search: string;
  setSearch: (q: string) => void;
  /** Egy szűrő értéke ('' ha nincs) */
  filter: (key: string) => string;
  setFilter: (key: string, value: string | null | undefined) => void;
  /** 0-tól számozott lap */
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  /** A DataTable onPaginationChange-éhez */
  setPagination: (p: { pageIndex: number; pageSize: number }) => void;
  /** Több kulcs egyszerre (null/'' törli); a lap 0-ra áll, ha nem adod meg */
  set: (next: Record<string, string | number | null | undefined>) => void;
  /** Keresés + szűrők törlése (a lapméret marad) */
  clear: () => void;
  hasSearch: boolean;
  hasFilters: boolean;
};

export function useListState({ params, setParams }: ListStateAdapter, opts: ListStateOptions = {}): ListState {
  const sizes = opts.pageSizes ?? [10, 25, 100];
  const kSearch = opts.keys?.search ?? 'q', kPage = opts.keys?.page ?? 'lap', kSize = opts.keys?.size ?? 'meret';
  const filterKeys = opts.filters ?? [];

  const set = useCallback((next: Record<string, string | number | null | undefined>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === undefined || v === '') p.delete(k); else p.set(k, String(v));
    }
    // Szűrő- vagy keresésváltáskor az első lapra (különben üres lapra eshetne)
    if (!(kPage in next)) p.delete(kPage);
    setParams(p);
  }, [params, setParams, kPage]);

  const lapParam = Number(params.get(kPage));
  const page = Number.isInteger(lapParam) && lapParam > 0 ? lapParam : 0;
  const meretParam = Number(params.get(kSize));
  const pageSize = sizes.includes(meretParam) ? meretParam : sizes[0];
  const search = params.get(kSearch) ?? '';
  const hasFilters = filterKeys.some((k) => Boolean(params.get(k)));

  return useMemo<ListState>(() => ({
    params, search, page, pageSize, hasSearch: search.trim().length > 0, hasFilters,
    setSearch: (q) => set({ [kSearch]: q }),
    filter: (k) => params.get(k) ?? '',
    setFilter: (k, v) => set({ [k]: v }),
    setPage: (n) => set({ [kPage]: n > 0 ? n : null }),
    setPagination: ({ pageIndex, pageSize: s }) => set({ [kPage]: s !== pageSize ? null : pageIndex > 0 ? pageIndex : null, [kSize]: s === sizes[0] ? null : s }),
    set,
    clear: () => set(Object.fromEntries([kSearch, ...filterKeys].map((k) => [k, null]))),
  }), [params, search, page, pageSize, hasFilters, set, kSearch, kPage, kSize, sizes, filterKeys]);
}

export type ListStatusInput = {
  /** React Query: isPending (NEM isLoading – a háttérben szünetelő újrapróbálás különben „üres listának” látszana) */
  isPending: boolean;
  isError: boolean;
  /** Van-e már (akár régi) adat – hibánál a régi adat marad, frissítéskor nem villan töltésre */
  hasData: boolean;
  /** A szűrt találatok száma */
  count: number;
  /** Van-e keresés vagy szűrő – ettől függ, „üres” (még nincs elem) vagy „nincs találat” */
  filtered: boolean;
  forbidden?: boolean;
};

/** A lista állapota egy helyen: jogosultság → hiba (adat nélkül) → töltés → üres / nincs találat → kész */
export function listStatus({ isPending, isError, hasData, count, filtered, forbidden }: ListStatusInput): ListStatus {
  if (forbidden) return 'forbidden';
  if (isError && !hasData) return 'error';
  if (isPending && !hasData) return 'loading';
  if (count === 0) return filtered ? 'no-results' : 'empty';
  return 'ready';
}

/** Szerveroldali lapozásnál: ha szűrés után kevesebb lap maradt, az utolsó létező lap (különben üres lap látszana) */
export const clampPage = (page: number, totalPages: number) => Math.max(0, Math.min(page, Math.max(0, totalPages - 1)));
