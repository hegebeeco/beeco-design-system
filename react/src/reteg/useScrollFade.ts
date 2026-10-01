import { useEffect, useRef } from 'react';

/**
 * Vízszintesen görgethető sor (fülek) halványuló széle: a burok data-fade-start / data-fade-end jelzést kap,
 * ha arra van még tartalom. A kijelölt elem (selector) magától a látható részbe gördül.
 */
export function useScrollFade<T extends HTMLElement>(selected: string, dep: unknown) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const wrap = ref.current;
    const row = wrap?.firstElementChild as HTMLElement | null;
    if (!wrap || !row) return;
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      wrap.toggleAttribute('data-fade-start', row.scrollLeft > 2);
      wrap.toggleAttribute('data-fade-end', max - row.scrollLeft > 2);
    };
    update();
    row.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(row);
    return () => { row.removeEventListener('scroll', update); ro.disconnect(); };
  }, []);
  useEffect(() => {
    const reveal = () => {
      const row = ref.current?.firstElementChild as HTMLElement | null;
      const el = row?.querySelector<HTMLElement>(selected);
      if (!row || !el) return;
      // Csak a sort görgetjük (az oldalt nem): a kijelölt fül teljesen látsszon
      const l = el.offsetLeft - row.offsetLeft, r = l + el.offsetWidth;
      if (l < row.scrollLeft || el.offsetWidth > row.clientWidth) row.scrollLeft = l - 16;
      else if (r > row.scrollLeft + row.clientWidth) row.scrollLeft = r - row.clientWidth + 16;
    };
    reveal();
    // A betűk betöltése után a fülek szélesebbek lehetnek – újra igazítjuk
    let live = true;
    void document.fonts?.ready.then(() => { if (live) reveal(); });
    return () => { live = false; };
  }, [dep, selected]);
  return ref;
}
