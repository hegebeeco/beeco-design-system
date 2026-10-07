/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/sablon/ErrorSummary.tsx
import { forwardRef, useEffect, useId, useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function findField(form, name) {
  if (!form) return null;
  const byName = form.querySelector(`[name="${CSS.escape(name)}"]`);
  return byName ?? form.querySelector(`#${CSS.escape(name)}`);
}
var ErrorSummary = forwardRef(function ErrorSummary2({ errors, general, form, onJump }, ref) {
  const id = useId();
  const n = errors.length;
  const jump = (e, name) => {
    if (onJump?.(name)) {
      e.preventDefault();
      return;
    }
    const el = findField(form.current, name);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ block: "center" });
    el.focus({ preventScroll: true });
  };
  return /* @__PURE__ */ jsxs("div", { ref, className: "bc-alert is-danger bc-sablon-summary", tabIndex: -1, "aria-labelledby": `${id}-t`, children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("path", { d: "M12 7v6M12 16.5v.5" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { id: `${id}-t`, className: "bc-sablon-summary-title", children: n ? `Nem mentettem \u2013 ${n === 1 ? "egy mez\u0151t" : `${n} mez\u0151t`} jav\xEDts ki:` : "Nem siker\xFClt menteni." }),
      general && /* @__PURE__ */ jsx("p", { children: general }),
      n > 0 && /* @__PURE__ */ jsx("ul", { className: "bc-sablon-summary-list", children: errors.map((er) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: `#${er.name}`, onClick: (e) => jump(e, er.name), children: [
        er.label ? `${er.label}: ` : "",
        er.message
      ] }) }, er.name)) })
    ] })
  ] });
});
function useLinkGuard(dirty, confirm) {
  const bypass = useRef(false);
  useEffect(() => {
    if (!dirty) return;
    const h = (e) => {
      if (bypass.current || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.closest("dialog, [role=dialog], [role=alertdialog], [data-unsaved-ignore]")) return;
      const href = a.getAttribute("href") ?? "";
      if (a.target && a.target !== "_self" || a.hasAttribute("download") || href.startsWith("#") || href.startsWith("javascript:")) return;
      e.preventDefault();
      e.stopPropagation();
      confirm(() => {
        bypass.current = true;
        a.click();
        bypass.current = false;
      });
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [dirty, confirm]);
}

export {
  findField,
  ErrorSummary,
  useLinkGuard
};
