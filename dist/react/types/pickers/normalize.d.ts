import { type ReactNode } from 'react';
/** Keresési alak: kisbetű, ékezet nélkül („Kávé” → „kave”). Az előre összetett magyar betűknél a hossz nem változik. */
export declare const norm: (s: string) => string;
/** A találat kiemelése <mark>-kal (ékezet-függetlenül) */
export declare function highlight(label: string, query: string): ReactNode;
