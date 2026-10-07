/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/reteg/useQueryParam.ts
import { useCallback, useSyncExternalStore } from "react";
var EVT = "bc-query-change";
var subscribe = (cb) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVT, cb);
  };
};
function useQueryParam(name) {
  const value = useSyncExternalStore(subscribe, () => new URLSearchParams(window.location.search).get(name), () => null);
  const set = useCallback((next) => {
    const url = new URL(window.location.href);
    if (next === null) url.searchParams.delete(name);
    else url.searchParams.set(name, next);
    if (url.href === window.location.href) return;
    const st = window.history.state;
    if (next === null && st?.bcQ === name) {
      window.history.back();
      return;
    }
    if (next === null) window.history.replaceState(st, "", url);
    else window.history.pushState({ ...st ?? {}, bcQ: name }, "", url);
    window.dispatchEvent(new Event(EVT));
  }, [name]);
  return [value, set];
}

export {
  useQueryParam
};
