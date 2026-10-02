import { useEffect, Fragment, useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
  type ColumnDef, type ExpandedState, type PaginationState, type RowSelectionState, type SortingState,
} from '@tanstack/react-table';
import { cx } from '../cx';
import { SegmentedControl } from '../inputs/SegmentedControl';
import { DataState, SkeletonRows } from './DataState';
import { BulkBar, ColumnResizer, SortHeader } from './DataTableParts';
import { DefaultCell, expandColumn, headerText, metaOf, selectColumn, wrapColumn } from './dataTableColumns';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { SortSelect } from './SortSelect';
import { useCtl } from './useCtl';

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any -- TanStack oszloptípus
  /** A táblázat neve (képernyőolvasó, görgethető terület neve); `captionVisible` → látható cím */
  caption: string;
  captionVisible?: boolean;
  getRowId: (row: T) => string;
  /** Sor emberi neve (jelölő és lenyitó felirata): „Kijelölés: Zöld Sarok” */
  rowLabel: (row: T) => string;
  /** Mit listázunk: „1–25 / 312 POI” */
  itemLabel?: string;
  status?: 'ready' | 'loading' | 'error' | 'forbidden';
  error?: string;
  onRetry?: () => void;
  /** Frissítés közben: a régi adat látszik, felül vékony töltésjel */
  refreshing?: boolean;
  /** Üres állapot (0 sor) – teendővel; szűrésre üresnél „Szűrők törlése” */
  empty?: ReactNode;
  sorting?: SortingState;
  onSortingChange?: (s: SortingState) => void;
  selectable?: boolean;
  selection?: RowSelectionState;
  onSelectionChange?: (s: RowSelectionState) => void;
  /** Kijelölés felső határa (POI: 200) – fölötte szól és nem jelöl */
  maxSelection?: number;
  /** Tömeges műveletek gombjai – a kijelölt sorok azonosítóit kapja */
  bulkActions?: (ids: string[], clear: () => void) => ReactNode;
  renderExpanded?: (row: T) => ReactNode;
  canExpand?: (row: T) => boolean;
  resizable?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (p: PaginationState) => void;
  pageSizes?: number[];
  /** Szerveroldali rendezés + lapozás: a szerver adja a sorokat és az összes darabszámot */
  serverRowCount?: number;
  density?: 'comfortable' | 'dense';
  onDensityChange?: (d: 'comfortable' | 'dense') => void;
  /** Sűrűség-kapcsoló a sávban (alap: igen) */
  densityToggle?: boolean;
  /** Telefonon: 'scroll' (alap, rögzített első oszlop) vagy 'cards' (soronként kártya) */
  mobile?: 'scroll' | 'cards';
  /** Extra elemek a táblázat fölötti sávban (jobbra) */
  toolbar?: ReactNode;
  /** A görgethető terület legnagyobb magassága (rögzített fejléc) – alap: 70vh */
  maxHeight?: string;
};

/**
 * DataTable (organizmus, Javaslat 02 – 1a A, 1b A): TanStack-logika + DS `bc-table`.
 * Rendezés (aria-sort), rögzített fejléc és első oszlop, kijelölés + tömeges sáv, lenyitható sor, oszlophúzás (billentyűvel is),
 * lapozás 10/25/100 (kliens vagy szerver), sűrűség, töltés (csontváz) / frissítés / üres / hiba / nincs jogosultság.
 */
export function DataTable<T>(p: DataTableProps<T>) {
  const { data, caption, getRowId, rowLabel, itemLabel = 'sor', status = 'ready', selectable, maxSelection, renderExpanded, resizable, mobile = 'scroll' } = p;
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const detailId = (id: string) => `${uid}-d-${id}`;
  const [sorting, setSorting] = useCtl(p.sorting, p.onSortingChange, []);
  const [selection, setSelection] = useCtl(p.selection, p.onSelectionChange, {});
  const [pagination, setPagination] = useCtl(p.pagination, p.onPaginationChange, { pageIndex: 0, pageSize: (p.pageSizes ?? [10, 25, 100])[1] ?? 25 });
  const [density, setDensity] = useCtl(p.density, p.onDensityChange, 'comfortable');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [notice, setNotice] = useState<string>();
  const server = p.serverRowCount !== undefined;

  const columns = useMemo(() => [
    ...(selectable ? [selectColumn<T>(rowLabel)] : []),
    ...(renderExpanded ? [expandColumn<T>(rowLabel, detailId)] : []),
    ...(p.columns as ColumnDef<T, unknown>[]).map(wrapColumn),
  ], [p.columns, selectable, renderExpanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const table = useReactTable<T>({
    data, columns, getRowId, columnResizeMode: 'onChange', enableColumnResizing: Boolean(resizable),
    defaultColumn: { cell: DefaultCell, sortUndefined: 'last', size: 160, minSize: 64 },
    state: { sorting, rowSelection: selection, pagination, expanded },
    onSortingChange: (u) => { setSorting(u); setPagination((o) => ({ ...o, pageIndex: 0 })); },
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onRowSelectionChange: (u) => {
      const next = typeof u === 'function' ? u(selection) : u;
      const n = Object.values(next).filter(Boolean).length;
      if (maxSelection && n > maxSelection) { setNotice(`${maxSelection}/${maxSelection} – több nem jelölhető ki.`); return; }
      setNotice(undefined); setSelection(next);
    },
    enableRowSelection: Boolean(selectable),
    getRowCanExpand: (r) => Boolean(renderExpanded) && (p.canExpand?.(r.original) ?? true),
    getCoreRowModel: getCoreRowModel(),
    ...(server ? { manualSorting: true, manualPagination: true, rowCount: p.serverRowCount } : { getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() }),
    autoResetPageIndex: false,
  });

  const total = server ? p.serverRowCount ?? 0 : table.getPrePaginationRowModel().rows.length;
  // Kliensoldali lapozás: ha az adat szűkült (pl. rövidebb időszak, szűrés), ne maradjon üres lapon – az utolsó létező lapra lép
  const lapSzam = server ? 0 : table.getPageCount();
  useEffect(() => {
    if (!server && pagination.pageIndex > 0 && pagination.pageIndex > Math.max(0, lapSzam - 1)) setPagination({ ...pagination, pageIndex: Math.max(0, lapSzam - 1) });
  }, [server, lapSzam, pagination, setPagination]);
  const selIds = Object.keys(selection).filter((k) => selection[k]);
  const leafs = table.getVisibleLeafColumns();
  const pinCount = leafs.findIndex((c) => !c.id.startsWith('_')) + 1; // a segédoszlopok + az első adatoszlop rögzített
  const pinStyle = (i: number): CSSProperties | undefined => (i < pinCount ? { left: `calc(var(--bc-tap) * ${i})` } : undefined);
  const clear = () => { setSelection({}); setNotice(undefined); };
  const rows = table.getRowModel().rows;
  const body = status !== 'ready' || !data.length;

  return (
    <div className={cx('bc-dt', density === 'dense' && 'is-dense', mobile === 'cards' && 'is-cards')}>
      <p className="bc-sr" aria-live="polite">{selIds.length ? `${selIds.length} kijelölt ${itemLabel}` : ''}</p>
      {(selectable || p.densityToggle !== false || p.toolbar || p.captionVisible || mobile === 'cards') && <div className="bc-dt-bar">
        {selIds.length ? (
          <BulkBar count={selIds.length} max={maxSelection} itemLabel={itemLabel} notice={notice} onClear={clear}>{p.bulkActions?.(selIds, clear)}</BulkBar>
        ) : (
          <div className="bc-dt-tools">
            {p.captionVisible && <h3 className="bc-dt-title" aria-hidden="true">{caption}</h3>}
            {mobile === 'cards' && <SortSelect table={table} />}
            {p.densityToggle !== false && (
              <SegmentedControl label="Sűrűség" value={density} onChange={setDensity} items={[{ value: 'comfortable', label: 'Kényelmes' }, { value: 'dense', label: 'Sűrű' }]} />
            )}
            {p.toolbar}
          </div>
        )}
      </div>}
      {p.refreshing && <div className="bc-dt-progress" role="status" aria-label="Frissítem a listát…" />}
      <div className="bc-table-wrap bc-dt-wrap" tabIndex={0} role="region" aria-label={`${caption} – görgethető táblázat`}
        style={p.maxHeight ? ({ '--_dt-max': p.maxHeight } as CSSProperties) : undefined}>
        <table className={cx('bc-table', density === 'dense' && 'is-dense', resizable && 'is-fixed')} style={resizable ? { width: table.getTotalSize(), minWidth: '100%' } : undefined}>
          <caption className="bc-sr">{caption}</caption>
          <thead>
            {table.getHeaderGroups().map((g) => (
              <tr key={g.id}>
                {g.headers.map((h, i) => {
                  const c = h.column, s = c.getIsSorted();
                  return (
                    <th key={h.id} scope="col" className={cx(metaOf(c).num && 'is-num', i < pinCount && 'is-pin', c.id.startsWith('_') && 'is-util')} style={{ width: h.getSize(), ...pinStyle(i) }}
                      aria-sort={c.getCanSort() ? (s === 'asc' ? 'ascending' : s === 'desc' ? 'descending' : 'none') : undefined}>
                      {c.getCanSort() ? <SortHeader label={flexRender(c.columnDef.header, h.getContext())} sorted={s} onToggle={() => c.toggleSorting(undefined, false)} />
                        : flexRender(c.columnDef.header, h.getContext())}
                      {resizable && c.getCanResize() && <ColumnResizer header={h} label={headerText(c)} />}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {status === 'loading' ? <SkeletonRows cols={leafs.length} /> : body ? (
              <tr className="bc-dt-state"><td colSpan={leafs.length}>
                <DataState status={status === 'ready' ? 'empty' : status} what={`a listát (${itemLabel})`} error={p.error} onRetry={p.onRetry}
                  empty={p.empty ?? <EmptyState compact title="Még nincs itt semmi">Ha lesz, ebben a listában látod.</EmptyState>} />
              </td></tr>
            ) : rows.map((r) => (
              <Fragment key={r.id}>
                <tr data-selected={r.getIsSelected() || undefined} data-expanded={r.getIsExpanded() || undefined}>
                  {r.getVisibleCells().map((cell, i) => (
                    <td key={cell.id} data-label={headerText(cell.column)} style={pinStyle(i)}
                      className={cx(metaOf(cell.column).num && 'is-num', i < pinCount && 'is-pin', cell.column.id.startsWith('_') && 'is-util', metaOf(cell.column).wrap && 'is-wrap')}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {r.getIsExpanded() && renderExpanded && (
                  <tr className="bc-dt-detail" id={detailId(r.id)}><td colSpan={leafs.length}><div className="bc-dt-detail-body">{renderExpanded(r.original)}</div></td></tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {status === 'ready' && total > 0 && (
        <Pagination page={pagination.pageIndex} pageSize={pagination.pageSize} total={total} itemLabel={itemLabel} pageSizes={p.pageSizes} label={`Lapozás – ${caption}`}
          onPageChange={(i) => setPagination((o) => ({ ...o, pageIndex: i }))} onPageSizeChange={(s) => setPagination({ pageIndex: 0, pageSize: s })} />
      )}
    </div>
  );
}
