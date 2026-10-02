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
    keys?: {
        search?: string;
        page?: string;
        size?: string;
    };
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
    setPagination: (p: {
        pageIndex: number;
        pageSize: number;
    }) => void;
    /** Több kulcs egyszerre (null/'' törli); a lap 0-ra áll, ha nem adod meg */
    set: (next: Record<string, string | number | null | undefined>) => void;
    /** Keresés + szűrők törlése (a lapméret marad) */
    clear: () => void;
    hasSearch: boolean;
    hasFilters: boolean;
};
export declare function useListState({ params, setParams }: ListStateAdapter, opts?: ListStateOptions): ListState;
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
export declare function listStatus({ isPending, isError, hasData, count, filtered, forbidden }: ListStatusInput): ListStatus;
/** Szerveroldali lapozásnál: ha szűrés után kevesebb lap maradt, az utolsó létező lap (különben üres lap látszana) */
export declare const clampPage: (page: number, totalPages: number) => number;
