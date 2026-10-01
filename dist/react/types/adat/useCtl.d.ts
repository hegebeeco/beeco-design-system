type Updater<S> = S | ((old: S) => S);
/** Vezérelt vagy nem vezérelt állapot egyben: ha a projekt adja az értéket, azt használja, különben belsőt. TanStack-frissítőt is elfogad. */
export declare function useCtl<S>(value: S | undefined, onChange: ((v: S) => void) | undefined, initial: S): readonly [S, (u: Updater<S>) => void];
export {};
