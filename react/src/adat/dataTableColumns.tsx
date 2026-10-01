import type { CellContext, ColumnDef, Table } from '@tanstack/react-table';
import { fmt } from './format';
import { ExpandToggle, SelectCell } from './DataTableParts';

/** Oszlop-kiegészítők (columnDef.meta): szám-oszlop jobbra igazítva, felirat a kártyanézethez és a rendezés-választóhoz */
export type DataColumnMeta = { num?: boolean; decimals?: number; label?: string; wrap?: boolean };
export const metaOf = (c: { columnDef: { meta?: unknown } }) => (c.columnDef.meta ?? {}) as DataColumnMeta;

/** Hiányzó érték: null, undefined, üres szöveg → undefined (így a TanStack a rendezésnél a végére teszi) */
const miss = (v: unknown) => (v === null || v === '' ? undefined : v);
const path = (row: unknown, key: string) => key.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), row);

/** A projekt oszlopait úgy csomagolja, hogy a hiányzó érték mindig a lista végére kerüljön, iránytól függetlenül. */
export function wrapColumn<T>(c: ColumnDef<T, unknown>): ColumnDef<T, unknown> {
  const a = c as ColumnDef<T, unknown> & { accessorKey?: string; accessorFn?: (r: T, i: number) => unknown };
  if (typeof a.accessorKey === 'string') {
    const key = a.accessorKey;
    const { accessorKey: _drop, ...rest } = a;
    return { ...rest, id: a.id ?? key, accessorFn: (r: T) => miss(path(r, key)) } as ColumnDef<T, unknown>;
  }
  if (a.accessorFn) { const fn = a.accessorFn; return { ...a, accessorFn: (r: T, i: number) => miss(fn(r, i)) } as ColumnDef<T, unknown>; }
  return c;
}

/** Alap cella: hiányzó → „–” (képernyőolvasónak „nincs adat”), szám → magyar formátum, hosszú szöveg → „…” + teljes szöveg rámutatásra */
export function DefaultCell<T>({ getValue, column }: CellContext<T, unknown>) {
  const v = getValue();
  if (v === undefined) return <span className="bc-dt-missing"><span aria-hidden="true">–</span><span className="bc-sr">nincs adat</span></span>;
  if (typeof v === 'number') return <>{fmt(v, metaOf(column).decimals ?? 0)}</>;
  const s = String(v);
  return <span className="bc-dt-text" title={s.length > 40 ? s : undefined}>{s}</span>;
}

/** Kijelölő oszlop (fejlécben: az oldal összes sora; részleges állapot –) */
export function selectColumn<T>(rowLabel: (r: T) => string): ColumnDef<T, unknown> {
  return {
    id: '_sel', size: 44, enableSorting: false, enableResizing: false, meta: { label: 'Kijelölés' },
    header: ({ table }: { table: Table<T> }) => (
      <SelectCell label="Az oldal összes sorának kijelölése" checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()} onChange={() => table.toggleAllPageRowsSelected()} />
    ),
    cell: ({ row }) => <SelectCell label={`Kijelölés: ${rowLabel(row.original)}`} checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={() => row.toggleSelected()} />,
  };
}

/** Lenyitó oszlop */
export function expandColumn<T>(rowLabel: (r: T) => string, detailId: (id: string) => string): ColumnDef<T, unknown> {
  return {
    id: '_exp', size: 44, enableSorting: false, enableResizing: false, meta: { label: 'Részletek' },
    header: () => <span className="bc-sr">Részletek</span>,
    cell: ({ row }) => row.getCanExpand()
      ? <ExpandToggle expanded={row.getIsExpanded()} controls={detailId(row.id)} label={rowLabel(row.original)} onToggle={() => row.toggleExpanded()} />
      : null,
  };
}

/** A fejléc szövege (kártyanézet címkéje, rendezés-választó): meta.label, vagy a fejléc, ha szöveg */
export const headerText = <T,>(c: { id: string; columnDef: ColumnDef<T, unknown> }) =>
  metaOf(c).label ?? (typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id);
