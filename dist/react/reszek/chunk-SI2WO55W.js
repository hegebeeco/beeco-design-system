/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  SearchBox
} from "./chunk-TMP52CNF.js";
import {
  useWidth
} from "./chunk-6737ZM66.js";
import {
  FilterChip,
  FilterControl,
  chipText
} from "./chunk-GT6Q7WAT.js";
import {
  fmt
} from "./chunk-DY3GZMZQ.js";
import {
  Button
} from "./chunk-YZUSUFMW.js";
import {
  cx
} from "./chunk-4HTA5F62.js";

// react/src/adat/FilterBar.tsx
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var vals = (v) => Array.isArray(v) ? v : v ? [v] : [];
function FilterBar({ search, filters, values, onChange, resultCount, itemLabel = "tal\xE1lat", extra, narrowBelow = 640, className }) {
  const root = useRef(null);
  const width = useWidth(root, typeof window === "undefined" ? 1024 : window.innerWidth);
  const narrow = width > 0 && width < narrowBelow;
  const [q, setQ] = useState(search?.value ?? "");
  const [open, setOpen] = useState(false);
  const [tobbNyitva, setTobbNyitva] = useState(false);
  const [notice, setNotice] = useState();
  const searchInput = useRef(null);
  useEffect(() => {
    searchInput.current?.closest("[role=search]")?.setAttribute("aria-label", search?.label ?? "Keres\xE9s");
  }, [search?.label]);
  useEffect(() => {
    if (search && search.value !== q.trim()) setQ(search.value);
  }, [search?.value]);
  useEffect(() => {
    const bad = [];
    const next = { ...values };
    for (const f of filters) {
      if (f.loading || f.loadError || !f.options.length) continue;
      const ok = vals(values[f.id]).filter((v) => f.options.some((o) => o.value === v));
      if (ok.length !== vals(values[f.id]).length) {
        bad.push(f.label);
        next[f.id] = f.multiple ? ok.length ? ok : null : ok[0] ?? null;
      }
    }
    if (bad.length) {
      setNotice(`A linkben l\xE9v\u0151 ${bad.join(", ")} sz\u0171r\u0151\xE9rt\xE9k m\xE1r nem l\xE9tezik \u2013 kihagytam.`);
      onChange(next);
    }
  }, [values, filters]);
  const set = (id, v) => {
    const next = { ...values, [id]: v };
    const drop = (pid) => filters.filter((f) => f.parent === pid).forEach((f) => {
      next[f.id] = null;
      drop(f.id);
    });
    drop(id);
    setNotice(void 0);
    onChange(next);
  };
  const active = filters.map((f) => ({ f, text: chipText(f, values[f.id]) })).filter((a) => a.text);
  const any = active.length > 0 || Boolean(q.trim());
  const clearAll = () => {
    const next = {};
    filters.forEach((f) => {
      next[f.id] = null;
    });
    onChange(next);
    setQ("");
    search?.onChange("");
    setNotice(void 0);
  };
  const count = resultCount === void 0 ? null : /* @__PURE__ */ jsx("p", { className: "bc-fb-count", role: "status", "aria-live": "polite", children: resultCount === null ? "Sz\xE1mol\xE1s\u2026" : `${fmt(resultCount)} ${itemLabel}` });
  const vezerlo = (f) => /* @__PURE__ */ jsx(FilterControl, { def: f, value: values[f.id], onChange: (v) => set(f.id, v) }, f.id);
  const controls = filters.map(vezerlo);
  const masodlagos = filters.filter((f) => f.secondary);
  const masodlagosAktiv = masodlagos.filter((f) => chipText(f, values[f.id])).length;
  return /* @__PURE__ */ jsxs("div", { ref: root, className: cx("bc-fb", narrow && "is-narrow", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-fb-row", children: [
      search && /* @__PURE__ */ jsx(SearchBox, { ref: searchInput, className: "bc-fb-search", label: search.label, placeholder: search.placeholder, value: q, onChange: setQ, onSearch: (v) => search.onChange(v) }),
      narrow ? /* @__PURE__ */ jsxs(Popover.Root, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "secondary", className: "bc-fb-toggle", "aria-haspopup": "dialog", children: [
          "Sz\u0171r\u0151k",
          active.length > 0 && /* @__PURE__ */ jsxs("span", { className: "bc-badge is-accent", children: [
            active.length,
            /* @__PURE__ */ jsx("span", { className: "bc-sr", children: " akt\xEDv" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, { className: "bc-pop bc-fb-panel", role: "dialog", "aria-label": "Sz\u0171r\u0151k", side: "bottom", align: "end", sideOffset: 8, collisionPadding: 16, children: [
          /* @__PURE__ */ jsxs("div", { className: "bc-fb-panel-body", children: [
            controls,
            extra
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bc-fb-panel-foot", children: [
            any && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: clearAll, children: "Sz\u0171r\u0151k t\xF6rl\xE9se" }),
            /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => setOpen(false), children: resultCount == null ? "K\xE9sz" : `${fmt(resultCount)} ${itemLabel} mutat\xE1sa` })
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        filters.filter((f) => !f.secondary).map(vezerlo),
        masodlagos.length > 0 && /* @__PURE__ */ jsxs(Popover.Root, { open: tobbNyitva, onOpenChange: setTobbNyitva, children: [
          /* @__PURE__ */ jsx(Popover.Trigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "secondary", className: "bc-fb-toggle bc-fb-more", "aria-haspopup": "dialog", children: [
            "Tov\xE1bbi sz\u0171r\u0151k",
            masodlagosAktiv > 0 && /* @__PURE__ */ jsxs("span", { className: "bc-badge is-accent", children: [
              masodlagosAktiv,
              /* @__PURE__ */ jsx("span", { className: "bc-sr", children: " akt\xEDv" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsxs(Popover.Content, { className: "bc-pop bc-fb-panel", role: "dialog", "aria-label": "Tov\xE1bbi sz\u0171r\u0151k", side: "bottom", align: "start", sideOffset: 8, collisionPadding: 16, children: [
            /* @__PURE__ */ jsx("div", { className: "bc-fb-panel-body", children: masodlagos.map(vezerlo) }),
            /* @__PURE__ */ jsx("div", { className: "bc-fb-panel-foot", children: /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => setTobbNyitva(false), children: resultCount == null ? "K\xE9sz" : `${fmt(resultCount)} ${itemLabel} mutat\xE1sa` }) })
          ] }) })
        ] }),
        extra
      ] }),
      !any && !narrow && count
    ] }),
    notice && /* @__PURE__ */ jsx("p", { className: "bc-notice", role: "status", children: notice }),
    (any || count && narrow) && /* @__PURE__ */ jsxs("div", { className: "bc-fb-active", children: [
      any && /* @__PURE__ */ jsxs("ul", { className: "bc-fb-chips", "aria-label": "Akt\xEDv sz\u0171r\u0151k", children: [
        q.trim() && /* @__PURE__ */ jsx(FilterChip, { text: `Keres\xE9s: ${q.trim()}`, onRemove: () => {
          setQ("");
          search?.onChange("");
        } }),
        active.map(({ f, text }) => /* @__PURE__ */ jsx(FilterChip, { text, onRemove: () => set(f.id, null) }, f.id))
      ] }),
      any && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: clearAll, children: "Sz\u0171r\u0151k t\xF6rl\xE9se" }),
      count
    ] })
  ] });
}

export {
  FilterBar
};
