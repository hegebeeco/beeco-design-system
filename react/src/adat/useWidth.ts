import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Egy elem aktuális szélessége (ResizeObserver). Az első mérés rajzolás előtt történik (nincs villanás);
 * a grafikon ebből rajzol valódi pixelben, így a felirat sosem torzul, a szűrősáv ebből dönt soros ↔ panel között.
 */
export function useWidth(ref: RefObject<HTMLElement | null>, fallback = 0) {
  const [w, setW] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}
