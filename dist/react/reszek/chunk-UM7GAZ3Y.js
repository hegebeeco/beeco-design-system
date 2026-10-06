/* beeco design system 1.48.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  SablonFrame,
  useTemplateTitle
} from "./chunk-UMCZEVNR.js";
import {
  useQueryParam
} from "./chunk-Z26SXUAP.js";
import {
  Drawer
} from "./chunk-5I27ACP2.js";
import {
  PageHeader
} from "./chunk-EYTLHMLK.js";
import {
  BeeMoment
} from "./chunk-BM56AYJ7.js";
import {
  DataState
} from "./chunk-4X47HYEZ.js";
import {
  Button
} from "./chunk-K7H75UN6.js";

// react/src/sablon/ListPage.tsx
import { useCallback } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ListPage(p) {
  const { title, description, breadcrumbs, renderLink, primaryAction, actions, filters, status = "ready", what = "a list\xE1t", detail } = p;
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix);
  const showFilters = filters && status !== "empty" && status !== "forbidden";
  const head = actions || primaryAction ? /* @__PURE__ */ jsxs(Fragment, { children: [
    actions,
    primaryAction
  ] }) : void 0;
  let body;
  if (status === "empty") {
    body = /* @__PURE__ */ jsx("div", { className: "bc-card bc-sablon-state", children: /* @__PURE__ */ jsx(BeeMoment, { pillanat: "ures", sima: p.emptyText, action: p.emptyAction }) });
  } else if (status === "no-results") {
    body = /* @__PURE__ */ jsx("div", { className: "bc-card bc-sablon-state", children: /* @__PURE__ */ jsx(
      BeeMoment,
      {
        pillanat: "nincs-talalat",
        sima: p.noResultsText,
        action: p.onClearFilters && /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: p.onClearFilters, children: "Sz\u0171r\u0151k t\xF6rl\xE9se" })
      }
    ) });
  } else {
    body = /* @__PURE__ */ jsx(DataState, { status, what, error: p.error, onRetry: p.onRetry, retrying: p.retrying, skeleton: p.skeleton, children: p.children });
  }
  return /* @__PURE__ */ jsxs(SablonFrame, { kind: "lista", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, busy: status === "loading", children: [
    /* @__PURE__ */ jsx(PageHeader, { title, description, breadcrumbs, renderLink, actions: head }),
    showFilters && /* @__PURE__ */ jsx("div", { className: "bc-sablon-filters", children: filters }),
    /* @__PURE__ */ jsx("div", { className: "bc-sablon-list", children: body }),
    detail && /* @__PURE__ */ jsx(
      Drawer,
      {
        open: detail.open,
        onOpenChange: (o) => {
          if (!o) detail.onClose();
        },
        title: detail.title,
        description: detail.description,
        footer: detail.footer,
        size: detail.size,
        dirty: detail.dirty,
        busy: detail.busy,
        children: detail.children
      }
    )
  ] });
}
function useDetailParam(name = "reszlet") {
  const [id, set] = useQueryParam(name);
  const open = useCallback((next) => set(next), [set]);
  const close = useCallback(() => set(null), [set]);
  return { id, open, close };
}

export {
  ListPage,
  useDetailParam
};
