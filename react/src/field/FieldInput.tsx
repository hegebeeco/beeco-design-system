import type { ReactElement } from 'react';
import { useFieldContext, type FieldCtx } from './FieldContext';

/** Segéd: a Field-kontextust (id, aria-describedby, invalid) render-függvénnyel adja a mezőnek. */
export function FieldInput({ children }: { children: (f: FieldCtx) => ReactElement }) {
  const f = useFieldContext();
  if (!f) throw new Error('A mezőnek Field-en belül kell lennie (docs/komponensek.md 3/A)');
  return children(f);
}
