/* beeco design system 1.46.3 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  SablonFrame,
  useTemplateTitle
} from "./chunk-J5NCG7LI.js";
import {
  DetailActions
} from "./chunk-7UI7G43I.js";
import {
  PageHeader
} from "./chunk-P3R7Y6TP.js";
import {
  Tabs
} from "./chunk-PRFH6POK.js";
import {
  DataState
} from "./chunk-VDC2PVQ7.js";
import {
  cx
} from "./chunk-MGWI3LRM.js";

// react/src/sablon/DetailPage.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function DetailPage(p) {
  const { title, description, breadcrumbs, renderLink, status = "ready", actions, summary, tabs, side } = p;
  const loading = status === "loading";
  useTemplateTitle(title, p.docTitle, p.docTitleSuffix, loading);
  const subject = p.subject ?? (typeof title === "string" ? title : "elem");
  const head = status === "ready" && actions?.length ? /* @__PURE__ */ jsx(DetailActions, { actions, subject }) : void 0;
  return /* @__PURE__ */ jsxs(SablonFrame, { kind: "reszletek", standalone: p.standalone, skipLabel: p.skipLabel, className: p.className, busy: loading, children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title,
        description: status === "ready" ? description : void 0,
        breadcrumbs,
        renderLink,
        actions: head,
        loading
      }
    ),
    /* @__PURE__ */ jsx(
      DataState,
      {
        status,
        what: p.what ?? "az adatokat",
        error: p.error,
        onRetry: p.onRetry,
        skeleton: /* @__PURE__ */ jsxs("div", { className: "bc-sablon-skel", children: [
          /* @__PURE__ */ jsx("span", { className: "bc-skeleton" }),
          /* @__PURE__ */ jsx("span", { className: "bc-skeleton" }),
          /* @__PURE__ */ jsx("span", { className: "bc-skeleton" })
        ] }),
        children: /* @__PURE__ */ jsxs("div", { className: cx("bc-sablon-cols", Boolean(side) && "has-side"), children: [
          /* @__PURE__ */ jsxs("div", { className: "bc-sablon-primary", children: [
            summary && /* @__PURE__ */ jsx("section", { className: "bc-card bc-sablon-summary-block", "aria-label": "\xD6sszegz\xE9s", children: summary }),
            tabs && tabs.length > 0 && /* @__PURE__ */ jsx(Tabs, { items: tabs, label: p.tabsLabel ?? `${subject} r\xE9szei`, value: p.tab, onValueChange: p.onTabChange }),
            p.children
          ] }),
          side && /* @__PURE__ */ jsx("aside", { className: "bc-sablon-side", "aria-label": p.sideLabel ?? "Adatok \xE9s tev\xE9kenys\xE9g", children: side })
        ] })
      }
    )
  ] });
}

export {
  DetailPage
};
