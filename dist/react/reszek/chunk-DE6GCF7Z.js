/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  usePageTitle
} from "./chunk-4VR4LC3O.js";
import {
  cx
} from "./chunk-4NETF2NE.js";

// react/src/sablon/Frame.tsx
import { useId } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function SablonFrame({ kind, standalone, skipLabel = "Ugr\xE1s a tartalomra", className, busy, children }) {
  const id = `bc-sablon-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const body = /* @__PURE__ */ jsx("div", { className: cx("bc-sablon", `is-${kind}`, className), "data-sablon": kind, "aria-busy": busy || void 0, children });
  if (!standalone) return body;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("a", { className: "bc-skip", href: `#${id}`, children: skipLabel }),
    /* @__PURE__ */ jsx("main", { id, className: "bc-sablon-main", tabIndex: -1, children: body })
  ] });
}
function useTemplateTitle(title, docTitle, suffix, loading) {
  const text = docTitle ?? (typeof title === "string" ? title : null);
  usePageTitle(loading ? null : text, suffix);
}

export {
  SablonFrame,
  useTemplateTitle
};
