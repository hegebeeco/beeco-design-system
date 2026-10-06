/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Breadcrumbs
} from "./chunk-W3CRTIW5.js";

// react/src/reteg/PageHeader.tsx
import { useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function PageHeader({ title, description, breadcrumbs, actions, loading, renderLink, breadcrumbsLabel }) {
  return /* @__PURE__ */ jsxs("header", { className: "bc-page-header bc-page-head", children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-page-head-text", children: [
      breadcrumbs && breadcrumbs.length > 0 && /* @__PURE__ */ jsx(Breadcrumbs, { items: breadcrumbs, renderLink, label: breadcrumbsLabel }),
      loading ? /* @__PURE__ */ jsxs("h1", { "aria-busy": "true", children: [
        /* @__PURE__ */ jsx("span", { className: "bc-skeleton bc-title-skeleton" }),
        /* @__PURE__ */ jsx("span", { className: "bc-sr", children: "T\xF6lt\xF6m\u2026" })
      ] }) : /* @__PURE__ */ jsx("h1", { children: title }),
      description && /* @__PURE__ */ jsx("p", { children: description })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "bc-row", children: actions })
  ] });
}
function usePageTitle(title, suffix = "beeco admin") {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} \u2013 ${suffix}` : suffix;
    return () => {
      document.title = prev;
    };
  }, [title, suffix]);
}

export {
  PageHeader,
  usePageTitle
};
