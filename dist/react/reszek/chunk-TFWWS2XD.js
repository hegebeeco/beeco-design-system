/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/reteg/layer.ts
import { useSyncExternalStore } from "react";
function keepToasts(e) {
  if (e.target instanceof Element && e.target.closest(".bc-toaster")) e.preventDefault();
}
function useMedia(query) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export {
  keepToasts,
  useMedia
};
