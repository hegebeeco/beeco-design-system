/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Button
} from "./chunk-PAKWALHM.js";

// react/src/form/useDraft.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var PREFIX = "bc-draft:";
var read = (key) => {
  try {
    const s = localStorage.getItem(PREFIX + key);
    const p = s ? JSON.parse(s) : null;
    return p && p.v === 1 ? p : null;
  } catch {
    return null;
  }
};
var remove = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
  }
};
function useDraft({ key, values, dirty, onRestore, maxAgeDays = 7, debounceMs = 800 }) {
  const [found, setFound] = useState(null);
  const kezdo = useRef(null);
  useEffect(() => {
    if (!key || kezdo.current === key) return;
    kezdo.current = key;
    const s = read(key);
    if (s && Date.now() - s.savedAt > maxAgeDays * 864e5) {
      remove(key);
      setFound(null);
    } else setFound(s);
  }, [key, maxAgeDays]);
  const json = JSON.stringify(values);
  const torolt = useRef(null);
  useEffect(() => {
    if (!key || !dirty || found || torolt.current === json) return;
    const t = window.setTimeout(() => {
      if (torolt.current === json) return;
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify({ v: 1, savedAt: Date.now(), values: JSON.parse(json) }));
      } catch {
      }
    }, debounceMs);
    return () => window.clearTimeout(t);
  }, [key, dirty, json, found, debounceMs]);
  const jsonRef = useRef(json);
  jsonRef.current = json;
  const restore = useCallback(() => {
    if (found) {
      onRestore(found.values);
      setFound(null);
    }
  }, [found, onRestore]);
  const discard = useCallback(() => {
    if (key) remove(key);
    setFound(null);
  }, [key]);
  const clear = useCallback(() => {
    torolt.current = jsonRef.current;
    if (key) remove(key);
    setFound(null);
  }, [key]);
  return { draft: found, restore, discard, clear };
}
function DraftNotice({ savedAt, onRestore, onDiscard }) {
  const mikor = new Date(savedAt);
  const ma = (/* @__PURE__ */ new Date()).toDateString() === mikor.toDateString();
  const ido = mikor.toLocaleString("hu-HU", ma ? { hour: "2-digit", minute: "2-digit" } : { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ jsx("div", { className: "bc-alert is-info bc-draft", role: "status", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsxs("strong", { children: [
        "Van egy be nem fejezett v\xE1ltozatod (",
        ma ? `ma ${ido}` : ido,
        ")."
      ] }),
      " Ezen az eszk\xF6z\xF6n mentett\xFCk, miel\u0151tt elhagytad az oldalt."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-row bc-draft-actions", children: [
      /* @__PURE__ */ jsx(Button, { size: "sm", onClick: onRestore, children: "Vissza\xE1ll\xEDt\xE1s" }),
      /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: onDiscard, children: "Elvet\xE9s" })
    ] })
  ] }) });
}

export {
  useDraft,
  DraftNotice
};
