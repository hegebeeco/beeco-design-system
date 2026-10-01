import type { MutableRefObject, Ref } from 'react';
/** Több ref egy elemre (a hívóé + a belső, pl. számlálóhoz) */
export declare function mergeRefs<T>(...refs: Array<Ref<T> | MutableRefObject<T | null> | undefined>): (el: T | null) => void;
