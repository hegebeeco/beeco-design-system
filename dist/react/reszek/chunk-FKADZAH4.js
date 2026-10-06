/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Combobox
} from "./chunk-7HDENUFJ.js";
import {
  Field
} from "./chunk-SVRCBHAN.js";
import {
  createError,
  norm
} from "./chunk-V52HX25J.js";

// react/src/pickers/TagPicker.tsx
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function TagPicker({ options, value, onChange, max, onCreate, cloudLimit = 20, ...field }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [err, setErr] = useState();
  if (options.length > cloudLimit) return /* @__PURE__ */ jsx(Combobox, { ...field, multiple: true, options, value, onChange, max, onCreate });
  const full = max !== void 0 && value.length >= max;
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : full ? value : [...value, v]);
  const save = async () => {
    const t = draft.trim();
    if (!t) {
      setErr("Adj nevet az \xFAj c\xEDmk\xE9nek.");
      return;
    }
    if (options.some((o) => norm(o.label) === norm(t))) {
      setErr(`\u201E${t}\u201D m\xE1r l\xE9tezik \u2013 v\xE1laszd ki a list\xE1b\xF3l.`);
      return;
    }
    let v;
    try {
      v = await onCreate(t);
    } catch (e) {
      setErr(createError(e));
      return;
    }
    onChange([...value, v]);
    setDraft("");
    setAdding(false);
    setErr(void 0);
  };
  return /* @__PURE__ */ jsx(
    Field,
    {
      ...field,
      labelFor: false,
      range: field.range ?? (max !== void 0 ? `legfeljebb ${max} c\xEDmke` : void 0),
      count: max !== void 0 ? { value: value.length, max } : void 0,
      error: field.error ?? err,
      children: /* @__PURE__ */ jsxs("div", { className: "bc-tagcloud", role: "group", "aria-label": field.label, children: [
        options.length === 0 && !onCreate && /* @__PURE__ */ jsx("span", { className: "bc-muted", children: "M\xE9g nincs c\xEDmke." }),
        options.map((o) => {
          const on = value.includes(o.value);
          return /* @__PURE__ */ jsx("button", { type: "button", className: "bc-tag", "aria-pressed": on, disabled: field.disabled || o.disabled || full && !on, onClick: () => toggle(o.value), children: o.label }, o.value);
        }),
        onCreate && !adding && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-tag is-add", disabled: field.disabled || full, onClick: () => setAdding(true), children: "+ \xDAj c\xEDmke" }),
        adding && /* @__PURE__ */ jsxs("span", { className: "bc-row", style: { gap: "var(--bc-sp-1)" }, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "bc-input",
              style: { width: 180, margin: 0 },
              "aria-label": "\xDAj c\xEDmke neve",
              maxLength: 40,
              autoFocus: true,
              value: draft,
              onChange: (e) => {
                setDraft(e.target.value);
                setErr(void 0);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void save();
                }
                if (e.key === "Escape") setAdding(false);
              }
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "button", className: "bc-btn is-sm", onClick: () => void save(), children: "Hozz\xE1ad\xE1s" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "bc-btn is-sm is-ghost", onClick: () => {
            setAdding(false);
            setErr(void 0);
          }, children: "M\xE9gse" })
        ] })
      ] })
    }
  );
}

export {
  TagPicker
};
