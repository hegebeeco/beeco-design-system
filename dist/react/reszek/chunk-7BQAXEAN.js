/* beeco design system 1.51.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  formatHu
} from "./chunk-HDFSCYBK.js";

// react/src/kieg2/useGeolocation.ts
import { useCallback, useEffect, useRef, useState } from "react";
var MSG = {
  denied: "Nem engedted a helymeghat\xE1roz\xE1st. A b\xF6ng\xE9sz\u0151 c\xEDmsor\xE1ban (lakat ikon) enged\xE9lyezheted, vagy keresd meg a c\xEDmet.",
  unavailable: "Most nem tal\xE1lom a helyed (nincs GPS vagy h\xE1l\xF3zat). Pr\xF3b\xE1ld \xFAjra, vagy add meg a c\xEDmet.",
  unsupported: "Ez a b\xF6ng\xE9sz\u0151 nem tud helyet meghat\xE1rozni. Keresd meg a c\xEDmet, vagy \xEDrd be a koordin\xE1t\xE1kat.",
  timeout: "T\xFAl sok\xE1ig tartott a helymeghat\xE1roz\xE1s. Pr\xF3b\xE1ld \xFAjra szabad \xE9g alatt, vagy add meg a c\xEDmet."
};
var accuracyText = (m) => m < 1e3 ? `\xB1${formatHu(Math.round(m), 0)} m` : `\xB1${formatHu(m / 1e3, 1)} km`;
function useGeolocation(timeoutMs = 1e4) {
  const [state, setState] = useState({ status: "idle" });
  const alive = useRef(true);
  useEffect(() => () => {
    alive.current = false;
  }, []);
  const locate = useCallback((onFound) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({ status: "unavailable", message: MSG.unsupported });
      return;
    }
    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!alive.current) return;
        const at = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setState({ status: "found", at, accuracy: pos.coords.accuracy });
        onFound?.(at);
      },
      (err) => {
        if (!alive.current) return;
        if (err.code === err.PERMISSION_DENIED) setState({ status: "denied", message: MSG.denied });
        else if (err.code === err.TIMEOUT) setState({ status: "timeout", message: MSG.timeout });
        else setState({ status: "unavailable", message: MSG.unavailable });
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 6e4 }
    );
  }, [timeoutMs]);
  const reset = useCallback(() => setState({ status: "idle" }), []);
  return { state, locate, reset };
}

export {
  accuracyText,
  useGeolocation
};
