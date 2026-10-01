import { useState } from 'react';

type Updater<S> = S | ((old: S) => S);

/** Vezérelt vagy nem vezérelt állapot egyben: ha a projekt adja az értéket, azt használja, különben belsőt. TanStack-frissítőt is elfogad. */
export function useCtl<S>(value: S | undefined, onChange: ((v: S) => void) | undefined, initial: S) {
  const [inner, setInner] = useState<S>(initial);
  const cur = value ?? inner;
  const set = (u: Updater<S>) => {
    const next = typeof u === 'function' ? (u as (o: S) => S)(cur) : u;
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [cur, set] as const;
}
