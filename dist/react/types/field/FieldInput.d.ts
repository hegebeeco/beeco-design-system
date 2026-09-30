import type { ReactElement } from 'react';
import { type FieldCtx } from './FieldContext';
/** Segéd: a Field-kontextust (id, aria-describedby, invalid) render-függvénnyel adja a mezőnek. */
export declare function FieldInput({ children }: {
    children: (f: FieldCtx) => ReactElement;
}): ReactElement<unknown, string | import("react").JSXElementConstructor<any>>;
