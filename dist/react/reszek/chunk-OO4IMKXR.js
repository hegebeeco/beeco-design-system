/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  ShellNavContext
} from "./chunk-E7MRS2ZZ.js";
import {
  defaultLink
} from "./chunk-JXGXR4JO.js";
import {
  CloseIcon
} from "./chunk-TZV67NPC.js";
import {
  useReturnFocus
} from "./chunk-NUNQTNKR.js";
import {
  useMedia
} from "./chunk-Z7B3MBLJ.js";
import {
  evszak
} from "./chunk-FZN32GDX.js";
import {
  IconButton
} from "./chunk-FYLKJ6X5.js";
import {
  cx
} from "./chunk-UHO66ITM.js";

// react/src/reteg/AppShell.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Fragment as Fragment2, jsx, jsxs } from "react/jsx-runtime";
var APP_SHELL_LABELS_HU = {
  openMenu: "Men\xFC megnyit\xE1sa",
  closeMenu: "Men\xFC bez\xE1r\xE1sa",
  menuTitle: "Men\xFC",
  expand: "Men\xFC kinyit\xE1sa",
  collapse: "Men\xFC becsuk\xE1sa"
};
var NARROW = "(max-width: 900px)";
var KEY = (k) => `bc-shell:${k}`;
var readCollapsed = (k) => {
  try {
    return localStorage.getItem(KEY(k)) === "1";
  } catch {
    return false;
  }
};
var Chevron = ({ left }) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
  /* @__PURE__ */ jsx("path", { d: left ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6" }),
  /* @__PURE__ */ jsx("path", { d: left ? "M20 4v16" : "M4 4v16" })
] });
function AppShell({
  brand,
  brandCompact,
  nav,
  topbar,
  account,
  collapsible = false,
  collapseKey = "nav",
  renderLink = defaultLink,
  skipLabel = "Ugr\xE1s a tartalomra",
  navLabel = "F\u0151 navig\xE1ci\xF3",
  labels,
  pattern,
  season,
  density = "default",
  children
}) {
  const compact = density === "compact";
  const ev = pattern === "honeycomb" && season ? season === "auto" ? evszak() : season : void 0;
  const l = { ...APP_SHELL_LABELS_HU, ...labels };
  const narrow = useMedia(NARROW);
  const [open, setOpen] = useState(false);
  const [collapsedPref, setCollapsedPref] = useState(() => collapsible && readCollapsed(collapseKey));
  const collapsed = collapsible && !narrow && collapsedPref;
  const focus = useReturnFocus();
  const drawer = useRef(null);
  const linkek = useRef(null);
  const aktivHref = useMemo(() => nav.flatMap((g) => g.items).find((i) => i.current)?.href, [nav]);
  useEffect(() => {
    const c = linkek.current;
    const el = c?.querySelector('[aria-current="page"]');
    if (!c || !el) return;
    const d = el.getBoundingClientRect().top - c.getBoundingClientRect().top;
    if (d < 0 || d + el.offsetHeight > c.clientHeight) c.scrollTop += d - (c.clientHeight - el.offsetHeight) / 2;
  }, [aktivHref]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      const t = e.target;
      if (t?.closest?.("a[href]") && drawer.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [open]);
  const toggle = () => {
    const v = !collapsedPref;
    setCollapsedPref(v);
    try {
      localStorage.setItem(KEY(collapseKey), v ? "1" : "0");
    } catch {
    }
  };
  const links = (onPick) => nav.map((g, gi) => /* @__PURE__ */ jsxs(Fragment, { children: [
    g.label && /* @__PURE__ */ jsx("p", { className: "bc-nav-group", id: `bc-nav-g${gi}`, children: g.label }),
    /* @__PURE__ */ jsx("ul", { className: "bc-nav-list", "aria-labelledby": g.label ? `bc-nav-g${gi}` : void 0, children: g.items.map((it) => /* @__PURE__ */ jsx("li", { title: collapsed ? it.label : void 0, children: renderLink({
      href: it.href,
      className: "bc-nav-link",
      "aria-current": it.current ? "page" : void 0,
      onClick: onPick,
      children: /* @__PURE__ */ jsxs(Fragment2, { children: [
        it.icon && /* @__PURE__ */ jsx("span", { className: "bc-nav-icon", "aria-hidden": "true", children: it.icon }),
        /* @__PURE__ */ jsx("span", { className: "bc-nav-text", children: it.label })
      ] })
    }) }, it.href)) })
  ] }, gi));
  const hasHeader = narrow || Boolean(topbar);
  const navCtx = useMemo(
    () => ({ closeNav: () => setOpen(false), openNav: () => setOpen(true), navOpen: narrow && open, narrow, collapsed, inShell: true }),
    [narrow, open, collapsed]
  );
  return /* @__PURE__ */ jsx(ShellNavContext.Provider, { value: navCtx, children: /* @__PURE__ */ jsxs("div", { className: cx("bc-shell", collapsed && "is-collapsed", compact && "is-compact", !hasHeader && "no-topbar"), children: [
    /* @__PURE__ */ jsx("a", { className: "bc-skip", href: "#bc-content", children: skipLabel }),
    !narrow && /* @__PURE__ */ jsxs("nav", { className: "bc-sidebar", "aria-label": navLabel, children: [
      /* @__PURE__ */ jsxs("div", { className: "bc-sidebar-head", children: [
        collapsed && brandCompact ? brandCompact : brand,
        collapsible && /* @__PURE__ */ jsx(IconButton, { className: "bc-sidebar-toggle", "aria-label": collapsed ? l.expand : l.collapse, "aria-expanded": !collapsed, onClick: toggle, children: /* @__PURE__ */ jsx(Chevron, { left: !collapsed }) })
      ] }),
      /* @__PURE__ */ jsx("div", { ref: linkek, className: "bc-sidebar-links", children: links() }),
      account && /* @__PURE__ */ jsx("div", { className: "bc-sidebar-foot", children: account })
    ] }),
    narrow && /* @__PURE__ */ jsx(Dialog.Root, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [
      /* @__PURE__ */ jsx(Dialog.Overlay, { className: "bc-scrim is-nav" }),
      /* @__PURE__ */ jsxs(
        Dialog.Content,
        {
          ref: drawer,
          className: cx("bc-sidebar is-open", compact && "is-compact"),
          "aria-describedby": void 0,
          onOpenAutoFocus: focus.remember,
          onCloseAutoFocus: focus.restore,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "bc-nav-head", children: [
              /* @__PURE__ */ jsx(Dialog.Title, { className: "bc-sr", children: l.menuTitle }),
              /* @__PURE__ */ jsx(IconButton, { "aria-label": l.closeMenu, onClick: () => setOpen(false), children: /* @__PURE__ */ jsx(CloseIcon, {}) })
            ] }),
            /* @__PURE__ */ jsxs("nav", { "aria-label": navLabel, className: "bc-sidebar-links", children: [
              brand,
              links(() => setOpen(false))
            ] }),
            account && /* @__PURE__ */ jsx("div", { className: "bc-sidebar-foot", children: account })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: cx("bc-main", pattern === "honeycomb" && "bc-honeycomb"), "data-evszak": ev, children: [
      hasHeader && /* @__PURE__ */ jsxs("header", { className: cx("bc-topbar", "bc-topbar-thin"), children: [
        narrow && /* @__PURE__ */ jsx(IconButton, { "aria-label": l.openMenu, "aria-expanded": open, "aria-haspopup": "dialog", onClick: () => setOpen(true), children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) }) }),
        narrow && !topbar && /* @__PURE__ */ jsx("div", { className: "bc-topbar-brand", children: brandCompact ?? brand }),
        /* @__PURE__ */ jsx("div", { className: "bc-topbar-end", children: topbar })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "bc-content", id: "bc-content", tabIndex: -1, children })
    ] })
  ] }) });
}

export {
  APP_SHELL_LABELS_HU,
  AppShell
};
