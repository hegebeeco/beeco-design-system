/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/media/useReturnFocus.ts
import { useLayoutEffect, useRef } from "react";
function useReturnFocus(open, fallback) {
  const prev = useRef(null);
  useLayoutEffect(() => {
    if (open) prev.current = document.activeElement;
  }, [open]);
  return (e) => {
    e.preventDefault();
    const el = prev.current?.isConnected && !prev.current.closest("[role=menu]") ? prev.current : fallback?.();
    el?.focus();
  };
}

export {
  useReturnFocus
};
