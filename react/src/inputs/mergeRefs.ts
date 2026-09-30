import type { MutableRefObject, Ref } from 'react';

/** Több ref egy elemre (a hívóé + a belső, pl. számlálóhoz) */
export function mergeRefs<T>(...refs: Array<Ref<T> | MutableRefObject<T | null> | undefined>) {
  return (el: T | null) => {
    for (const r of refs) {
      if (typeof r === 'function') r(el);
      else if (r) (r as MutableRefObject<T | null>).current = el;
    }
  };
}
