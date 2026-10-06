/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/adat/useCtl.ts
import { useState } from "react";
function useCtl(value, onChange, initial) {
  const [inner, setInner] = useState(initial);
  const cur = value ?? inner;
  const set = (u) => {
    const next = typeof u === "function" ? u(cur) : u;
    if (value === void 0) setInner(next);
    onChange?.(next);
  };
  return [cur, set];
}

export {
  useCtl
};
