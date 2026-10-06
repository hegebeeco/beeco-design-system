/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Modal
} from "./chunk-J3CVOCWY.js";
import {
  SearchBox
} from "./chunk-CED6AIKD.js";
import {
  Button
} from "./chunk-DNKGFO3X.js";
import {
  cx
} from "./chunk-KBQVEJSX.js";

// react/src/reteg/CommandPalette.tsx
import { useEffect, useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var COMMAND_PALETTE_LABELS_HU = {
  title: "Keres\xE9s",
  search: "Keres\xE9s",
  placeholder: "Keres\xE9s\u2026",
  results: "Tal\xE1latok",
  loading: "Keresem\u2026",
  retry: "\xDAjrapr\xF3b\xE1l\xE1s",
  count: (n) => n ? `${n} tal\xE1lat` : "Nincs tal\xE1lat",
  tipMove: "l\xE9ptet\xE9s",
  tipOpen: "megnyit\xE1s",
  tipClose: "bez\xE1r\xE1s"
};
var isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
var commandHotkeyLabel = () => isMac() ? "\u2318K" : "Ctrl+K";
function useCommandHotkey(onHotkey, enabled = true) {
  const cb = useRef(onHotkey);
  useEffect(() => {
    cb.current = onHotkey;
  });
  useEffect(() => {
    if (!enabled) return;
    const h = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey || e.isComposing || e.key.toLowerCase() !== "k") return;
      e.preventDefault();
      cb.current();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [enabled]);
}
function Marked({ text, q }) {
  const n = q.trim().toLocaleLowerCase("hu");
  if (!n) return /* @__PURE__ */ jsx(Fragment, { children: text });
  const low = text.toLocaleLowerCase("hu");
  if (low.length !== text.length) return /* @__PURE__ */ jsx(Fragment, { children: text });
  const out = [];
  let i = 0;
  for (let at = low.indexOf(n); at >= 0 && out.length < 20; at = low.indexOf(n, i)) {
    if (at > i) out.push(text.slice(i, at));
    out.push(/* @__PURE__ */ jsx("mark", { children: text.slice(at, at + n.length) }, at));
    i = at + n.length;
  }
  out.push(text.slice(i));
  return /* @__PURE__ */ jsx(Fragment, { children: out });
}
function CommandPalette({
  open,
  onOpenChange,
  query,
  onQueryChange,
  groups,
  onSelect,
  description,
  status = "ready",
  error,
  onRetry,
  minChars = 0,
  hint,
  emptyText,
  hotkey = true,
  highlight = true,
  tips = true,
  labels,
  className
}) {
  const l = { ...COMMAND_PALETTE_LABELS_HU, ...labels };
  const listId = useId();
  const input = useRef(null);
  const [active, setActive] = useState(0);
  const toggle = useRef(() => {
  });
  toggle.current = () => onOpenChange(!open);
  useCommandHotkey(() => toggle.current(), hotkey);
  const q = query.trim();
  const short = q.length < minChars;
  const shown = groups.filter((g) => g.items.length > 0);
  const items = shown.flatMap((g) => g.items);
  const enabled = items.map((it, i) => it.disabled ? -1 : i).filter((i) => i >= 0);
  const act = enabled.length ? enabled.includes(active) ? active : enabled[0] : -1;
  const optId = (i) => `${listId}-o${i}`;
  const itemsKey = items.map((it) => it.id).join("|");
  useEffect(() => {
    if (!open) setActive(0);
  }, [open]);
  useEffect(() => {
    setActive(enabled[0] ?? 0);
  }, [itemsKey]);
  useEffect(() => {
    if (act >= 0) document.getElementById(optId(act))?.scrollIntoView?.({ block: "nearest" });
  }, [act]);
  const pick = (it, newTab) => {
    if (!it || it.disabled) return;
    if (!newTab) onOpenChange(false);
    onSelect(it, { newTab });
  };
  const step = (d) => {
    if (!enabled.length) return;
    const at = Math.max(0, enabled.indexOf(act));
    setActive(enabled[(at + d + enabled.length) % enabled.length]);
  };
  const onKey = (e) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      step(-1);
    } else if ((e.key === "Home" || e.key === "End") && (e.ctrlKey || e.metaKey) && enabled.length) {
      e.preventDefault();
      setActive(e.key === "Home" ? enabled[0] : enabled[enabled.length - 1]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (act >= 0) pick(items[act], e.metaKey || e.ctrlKey);
    }
  };
  const loading = status === "loading" && !short;
  const failed = status === "error" && !short;
  const live = short ? items.length ? l.count(items.length) : "" : loading ? l.loading : l.count(items.length);
  let n = 0;
  return /* @__PURE__ */ jsxs(Modal, { open, onOpenChange, title: l.title, description, className: cx("bc-cmdk", className), initialFocus: () => input.current, children: [
    /* @__PURE__ */ jsx(
      SearchBox,
      {
        ref: input,
        label: l.search,
        placeholder: l.placeholder,
        value: query,
        onChange: onQueryChange,
        autoComplete: "off",
        spellCheck: false,
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-expanded": items.length > 0,
        "aria-controls": listId,
        "aria-activedescendant": act >= 0 ? optId(act) : void 0,
        onKeyDown: onKey
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", "aria-live": "polite", children: live }),
    /* @__PURE__ */ jsx("div", { className: "bc-cmdk-list", role: "listbox", id: listId, "aria-label": l.results, "aria-busy": loading || void 0, children: shown.map((g) => /* @__PURE__ */ jsxs("div", { role: "group", "aria-labelledby": `${listId}-g-${g.id}`, className: "bc-cmdk-group", children: [
      /* @__PURE__ */ jsx("div", { role: "presentation", id: `${listId}-g-${g.id}`, className: "bc-cmdk-group-title", children: g.label }),
      g.items.map((it) => {
        const i = n++;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            id: optId(i),
            role: "option",
            "aria-selected": i === act,
            "aria-disabled": it.disabled || void 0,
            "data-active": i === act,
            className: "bc-option bc-cmdk-item",
            onMouseDown: (e) => e.preventDefault(),
            onMouseMove: () => {
              if (i !== act && !it.disabled) setActive(i);
            },
            onClick: (e) => pick(it, e.metaKey || e.ctrlKey),
            children: [
              it.icon && /* @__PURE__ */ jsx("span", { className: "bc-cmdk-icon", "aria-hidden": "true", children: it.icon }),
              /* @__PURE__ */ jsx("span", { className: "bc-cmdk-label", children: highlight && !short ? /* @__PURE__ */ jsx(Marked, { text: it.label, q }) : it.label }),
              it.description && /* @__PURE__ */ jsx("span", { className: "bc-cmdk-desc", children: it.description })
            ]
          },
          it.id
        );
      })
    ] }, g.id)) }),
    short && hint && /* @__PURE__ */ jsx("p", { className: "bc-cmdk-note", children: hint }),
    loading && !items.length && /* @__PURE__ */ jsxs("p", { className: "bc-cmdk-note", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-spinner", "aria-hidden": "true" }),
      " ",
      l.loading
    ] }),
    !short && !loading && !failed && !items.length && /* @__PURE__ */ jsx("p", { className: "bc-cmdk-note", children: emptyText ? emptyText(q) : /* @__PURE__ */ jsxs(Fragment, { children: [
      "Nincs tal\xE1lat erre: \u201E",
      q,
      "\u201D. Pr\xF3b\xE1lj r\xF6videbb sz\xF3t."
    ] }) }),
    failed && /* @__PURE__ */ jsxs("div", { className: "bc-cmdk-note bc-cmdk-error", role: "alert", children: [
      /* @__PURE__ */ jsx("span", { children: error ?? "Nem siker\xFClt keresni \u2013 pr\xF3b\xE1ld \xFAjra p\xE1r m\xE1sodperc m\xFAlva." }),
      onRetry && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: onRetry, children: l.retry })
    ] }),
    tips && /* @__PURE__ */ jsxs("p", { className: "bc-cmdk-tips", children: [
      /* @__PURE__ */ jsx("kbd", { className: "bc-kbd", children: "\u2191" }),
      " ",
      /* @__PURE__ */ jsx("kbd", { className: "bc-kbd", children: "\u2193" }),
      " ",
      l.tipMove,
      " \xB7 ",
      /* @__PURE__ */ jsx("kbd", { className: "bc-kbd", children: "Enter" }),
      " ",
      l.tipOpen,
      " \xB7 ",
      /* @__PURE__ */ jsx("kbd", { className: "bc-kbd", children: "Esc" }),
      " ",
      l.tipClose
    ] })
  ] });
}

export {
  COMMAND_PALETTE_LABELS_HU,
  commandHotkeyLabel,
  useCommandHotkey,
  CommandPalette
};
