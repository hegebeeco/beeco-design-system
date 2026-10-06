/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  FieldInput
} from "./chunk-MORMOGJG.js";
import {
  Field
} from "./chunk-BJBVHBAN.js";
import {
  createError,
  highlight,
  norm
} from "./chunk-CHGC2PIS.js";
import {
  cx
} from "./chunk-4HTA5F62.js";

// react/src/pickers/Combobox.tsx
import * as Popover from "@radix-ui/react-popover";
import { useId, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var RENDER_LIMIT = 100;
function Combobox(props) {
  const { options, placeholder, onCreate, loading, loadError, onRetry, maxChips = 3, filter = true, onQueryChange, minChars = 0, disabled, ...field } = props;
  const multi = props.multiple === true;
  const selected = multi ? props.value : props.value ? [props.value] : [];
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const input = useRef(null);
  const listId = useId();
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const full = multi && props.max !== void 0 && selected.length >= props.max;
  const filtered = useMemo(() => {
    const q2 = norm(query.trim());
    return q2 && filter ? options.filter((o) => norm(o.label).includes(q2)) : options;
  }, [options, query, filter]);
  const shown = filtered.slice(0, RENDER_LIMIT);
  const q = query.trim();
  const canCreate = Boolean(onCreate) && q.length > 0 && !full && !options.some((o) => norm(o.label) === norm(q));
  const rows = shown.length + (canCreate ? 1 : 0);
  const commit = (v) => multi ? props.onChange(v) : props.onChange(v[0] ?? null);
  const toggle = (value) => {
    if (!multi) {
      commit([value]);
      setOpen(false);
      setQuery("");
      return;
    }
    if (selected.includes(value)) commit(selected.filter((s) => s !== value));
    else if (!full) commit([...selected, value]);
    setQuery("");
  };
  const [createErr, setCreateErr] = useState();
  const create = async () => {
    if (!onCreate) return;
    try {
      const v = await onCreate(q);
      setCreateErr(void 0);
      toggle(v);
    } catch (e) {
      setCreateErr(createError(e));
    }
  };
  const pick = (i) => {
    if (i < shown.length) {
      const o = shown[i];
      if (!o.disabled && !(full && !selected.includes(o.value))) toggle(o.value);
    } else if (canCreate) void create();
  };
  const onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((a) => rows ? (a + (e.key === "ArrowDown" ? 1 : rows - 1)) % rows : 0);
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
      } else if (query) setQuery("");
    } else if (e.key === "Backspace" && !query && multi && selected.length) commit(selected.slice(0, -1));
  };
  const chips = multi ? showAll ? selected : selected.slice(0, maxChips) : [];
  const singleLabel = !multi && selected[0] ? byValue.get(selected[0])?.label ?? selected[0] : "";
  const count = multi && props.max !== void 0 ? { value: selected.length, max: props.max } : void 0;
  const range = field.range ?? (multi && props.max !== void 0 ? `legfeljebb ${props.max} elem` : void 0);
  return /* @__PURE__ */ jsx(Field, { ...field, error: field.error ?? createErr, range, count, disabled, children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs(Popover.Root, { open: open && !disabled, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(Popover.Anchor, { asChild: true, children: /* @__PURE__ */ jsxs("div", { className: cx("bc-combo", f.invalid && "is-invalid", disabled && "is-disabled"), onClick: () => !disabled && input.current?.focus(), children: [
      chips.map((v) => /* @__PURE__ */ jsxs("span", { className: "bc-chip", children: [
        /* @__PURE__ */ jsx("span", { children: byValue.get(v)?.label ?? v }),
        !disabled && /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `${byValue.get(v)?.label ?? v} elt\xE1vol\xEDt\xE1sa`, onClick: (e) => {
          e.stopPropagation();
          commit(selected.filter((s) => s !== v));
        }, children: "\xD7" })
      ] }, v)),
      multi && !showAll && selected.length > maxChips && /* @__PURE__ */ jsxs("button", { type: "button", className: "bc-chip is-more", "aria-label": `M\xE9g ${selected.length - maxChips} kiv\xE1lasztott elem megjelen\xEDt\xE9se`, onClick: (e) => {
        e.stopPropagation();
        setShowAll(true);
      }, children: [
        "+",
        selected.length - maxChips
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: input,
          id: f.id,
          role: "combobox",
          "aria-expanded": open,
          "aria-controls": listId,
          "aria-autocomplete": "list",
          "aria-activedescendant": open && rows ? `${listId}-${active}` : void 0,
          "aria-describedby": f.describedBy,
          "aria-invalid": f.invalid || void 0,
          disabled,
          autoComplete: "off",
          placeholder: loading ? "T\xF6lt\xF6m a list\xE1t\u2026" : loadError ? "A lista nem t\xF6lt\xF6tt be \u2013 nyisd le az \xFAjrapr\xF3b\xE1l\xE1shoz" : selected.length && multi ? "" : placeholder,
          value: open || multi ? query : singleLabel,
          onChange: (e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            onQueryChange?.(e.target.value);
          },
          onFocus: () => setQuery(""),
          onKeyDown: onKey
        }
      ),
      loading && /* @__PURE__ */ jsx("span", { className: "bc-spinner", role: "status", "aria-label": "T\xF6lt\xF6m a list\xE1t", style: { width: 18, height: 18, borderWidth: 2 } }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "bc-combo-toggle", tabIndex: -1, "aria-hidden": "true", "aria-expanded": open, disabled, onClick: (e) => {
        e.stopPropagation();
        setOpen(!open);
        input.current?.focus();
      }, children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("path", { d: "M6 9l6 6 6-6" }) }) })
    ] }) }),
    /* @__PURE__ */ jsx(Popover.Portal, { children: /* @__PURE__ */ jsx(
      Popover.Content,
      {
        className: "bc-listbox",
        align: "start",
        sideOffset: 4,
        collisionPadding: 16,
        onOpenAutoFocus: (e) => e.preventDefault(),
        onInteractOutside: (e) => {
          if (e.target instanceof Node && input.current?.parentElement?.contains(e.target)) e.preventDefault();
        },
        children: /* @__PURE__ */ jsxs("div", { role: "listbox", id: listId, "aria-multiselectable": multi || void 0, "aria-label": field.label, children: [
          loading && /* @__PURE__ */ jsx("div", { className: "bc-list-note", role: "status", children: "T\xF6lt\xF6m a list\xE1t\u2026" }),
          loadError && /* @__PURE__ */ jsxs("div", { className: "bc-list-note", role: "alert", children: [
            loadError,
            " ",
            onRetry && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-btn is-sm is-secondary", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
          ] }),
          !loading && !loadError && shown.map((o, i) => {
            const isSel = selected.includes(o.value);
            const blocked = o.disabled || full && !isSel;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                id: `${listId}-${i}`,
                role: "option",
                "aria-selected": isSel,
                "aria-disabled": blocked || void 0,
                "data-active": i === active,
                className: "bc-option",
                onMouseDown: (e) => e.preventDefault(),
                onMouseEnter: () => setActive(i),
                onClick: () => pick(i),
                children: [
                  multi && /* @__PURE__ */ jsx("span", { className: "bc-ck", "aria-hidden": "true", children: isSel ? "\u2713" : "" }),
                  /* @__PURE__ */ jsx("span", { children: highlight(o.label, query) })
                ]
              },
              o.value
            );
          }),
          canCreate && /* @__PURE__ */ jsxs(
            "div",
            {
              id: `${listId}-${shown.length}`,
              role: "option",
              "aria-selected": false,
              "data-active": active === shown.length,
              className: "bc-option is-create",
              onMouseDown: (e) => e.preventDefault(),
              onMouseEnter: () => setActive(shown.length),
              onClick: () => void create(),
              children: [
                "+ \xDAj: \u201E",
                q,
                "\u201D"
              ]
            }
          ),
          !loading && !loadError && q.length < minChars && /* @__PURE__ */ jsxs("div", { className: "bc-list-note", children: [
            "\xCDrj m\xE9g legal\xE1bb ",
            minChars - q.length,
            " bet\u0171t."
          ] }),
          !loading && !loadError && !rows && q.length >= minChars && /* @__PURE__ */ jsxs("div", { className: "bc-list-note", children: [
            "Nincs tal\xE1lat",
            q ? ` erre: \u201E${q}\u201D` : "",
            "."
          ] }),
          filtered.length > RENDER_LIMIT && /* @__PURE__ */ jsxs("div", { className: "bc-list-note", children: [
            "M\xE9g ",
            filtered.length - RENDER_LIMIT,
            " tal\xE1lat \u2013 sz\u0171k\xEDtsd a keres\xE9st."
          ] }),
          full && /* @__PURE__ */ jsxs("div", { className: "bc-list-note", children: [
            "El\xE9rted a legfeljebb ",
            props.max,
            " elemet \u2013 el\u0151bb vegy\xE9l ki egyet."
          ] })
        ] })
      }
    ) })
  ] }) }) });
}

export {
  Combobox
};
