/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/reteg/useScrollFade.ts
import { useEffect, useRef } from "react";
function useScrollFade(selected, dep) {
  const ref = useRef(null);
  useEffect(() => {
    const wrap = ref.current;
    const row = wrap?.firstElementChild;
    if (!wrap || !row) return;
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      wrap.toggleAttribute("data-fade-start", row.scrollLeft > 2);
      wrap.toggleAttribute("data-fade-end", max - row.scrollLeft > 2);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(row);
    return () => {
      row.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);
  useEffect(() => {
    const reveal = () => {
      const row = ref.current?.firstElementChild;
      const el = row?.querySelector(selected);
      if (!row || !el) return;
      const l = el.offsetLeft - row.offsetLeft, r = l + el.offsetWidth;
      if (l < row.scrollLeft || el.offsetWidth > row.clientWidth) row.scrollLeft = l - 16;
      else if (r > row.scrollLeft + row.clientWidth) row.scrollLeft = r - row.clientWidth + 16;
    };
    reveal();
    let live = true;
    void document.fonts?.ready.then(() => {
      if (live) reveal();
    });
    return () => {
      live = false;
    };
  }, [dep, selected]);
  return ref;
}

export {
  useScrollFade
};
