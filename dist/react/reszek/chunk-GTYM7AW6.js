/* beeco design system 1.47.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-4C25CCAY.js";

// react/src/kieg/Clamp.tsx
import { createContext, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
var CutContext = createContext(() => void 0);
function Clamp({ k, label, lines, as: Tag = "p", placeholder, className, onCut, children }) {
  const ref = useRef(null);
  const report = useContext(CutContext);
  const cutCb = useRef(onCut);
  cutCb.current = onCut;
  const empty = children === void 0 || children === null || typeof children === "string" && !children.trim();
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 16;
      const cut = !empty && (lines === 1 ? el.scrollWidth > el.clientWidth + 1 : el.scrollHeight - el.clientHeight > lh / 2);
      el.toggleAttribute("data-cut", cut);
      report(k, label, lines, cut);
      cutCb.current?.(cut);
    };
    measure();
    let live = true;
    document.fonts?.ready.then(() => live && measure());
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => {
      live = false;
      ro?.disconnect();
    };
  }, [children, lines, empty, k, label, report]);
  useEffect(() => () => report(k, label, lines, false), [k, label, lines, report]);
  const style = { ["--lines"]: lines };
  return /* @__PURE__ */ jsx(Tag, { ref, className: cx("bc-clamp", lines === 1 && "is-one", empty && "is-placeholder", className), style, "data-clamp": k, children: empty ? placeholder : children });
}

export {
  CutContext,
  Clamp
};
