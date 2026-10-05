/* beeco design system 1.44.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  WEEK,
  parseTime,
  validateHours
} from "./chunk-FPH2NBCA.js";
import {
  HelpButton
} from "./chunk-644IXS53.js";
import {
  Button
} from "./chunk-OH6YOEFY.js";
import {
  cx
} from "./chunk-DXS6AO6A.js";

// react/src/media/OpeningHoursEditor.tsx
import { useEffect, useId, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function TimeInput({ value, onCommit, label, invalid, describedBy, disabled, readOnly }) {
  const [text, setText] = useState(value ?? "");
  useEffect(() => setText(value ?? ""), [value]);
  return /* @__PURE__ */ jsx(
    "input",
    {
      className: "bc-input bc-hours-time",
      value: text,
      placeholder: "\xF3\xF3:pp",
      "aria-label": label,
      "aria-invalid": invalid || void 0,
      "aria-describedby": describedBy,
      maxLength: 7,
      disabled,
      readOnly,
      autoComplete: "off",
      onChange: (e) => setText(e.target.value.replace(/[^\d:.,apmdeu ]/gi, "")),
      onBlur: () => {
        const t = parseTime(text);
        if (t) setText(t);
        onCommit(t, Boolean(text.trim()) && !t);
      }
    }
  );
}
function OpeningHoursEditor({ label = "Nyitvatart\xE1s", help, value, onChange, disabled, readOnly }) {
  const id = useId();
  const [bad, setBad] = useState({});
  const [note, setNote] = useState();
  const errors = { ...validateHours(value), ...bad };
  const locked = disabled || readOnly;
  const set = (k, p) => {
    setNote(void 0);
    onChange({ ...value, [k]: { ...value[k], ...p } });
  };
  const commit = (k, field, t, wrong) => {
    setBad((b) => {
      const n = { ...b };
      if (wrong) n[k] = `${WEEK.find((d) => d.key === k).label}: ezt nem \xE9rtem id\u0151nek \u2013 \xEDrd \xEDgy: 08:30 (vagy 8, 830).`;
      else delete n[k];
      return n;
    });
    if (!wrong) set(k, { [field]: t });
  };
  const copyMon = () => {
    const m = value.Mon;
    onChange({ ...value, Tue: { ...m }, Wed: { ...m }, Thu: { ...m }, Fri: { ...m } });
    setNote(`\xC1tm\xE1soltam a keddt\u0151l p\xE9ntekig tart\xF3 napokra: ${m.open ? `${m.from ?? "\u2013"}\u2013${m.to ?? "\u2013"}` : "z\xE1rva"}.`);
  };
  return /* @__PURE__ */ jsxs("div", { role: "group", className: cx("bc-field bc-hours", disabled && "is-disabled"), "aria-labelledby": `${id}-l`, "aria-describedby": `${id}-meta`, children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-label-row", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-label", id: `${id}-l`, children: label }),
      /* @__PURE__ */ jsx(HelpButton, { label, children: help })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bc-hours-list", children: WEEK.map(({ key, label: day }) => {
      const d = value[key];
      const err = errors[key];
      const errId = `${id}-${key}-err`;
      return /* @__PURE__ */ jsxs("div", { className: cx("bc-hours-row", err && "is-invalid"), "data-day": key, children: [
        /* @__PURE__ */ jsx("span", { className: "bc-hours-day", id: `${id}-${key}`, children: day }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            role: "switch",
            className: "bc-switch",
            "aria-checked": d.open,
            disabled: locked,
            "aria-label": `${day}: nyitva`,
            onClick: () => set(key, d.open ? { open: false } : { open: true, from: d.from ?? "08:00", to: d.to ?? "18:00" })
          }
        ),
        d.open ? /* @__PURE__ */ jsxs("span", { className: "bc-hours-times", role: "group", "aria-labelledby": `${id}-${key}`, children: [
          /* @__PURE__ */ jsx(TimeInput, { value: d.from, label: `${day}: nyit\xE1s`, invalid: Boolean(err), describedBy: err ? errId : void 0, disabled, readOnly, onCommit: (t, w) => commit(key, "from", t, w) }),
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "\u2013" }),
          /* @__PURE__ */ jsx(TimeInput, { value: d.to, label: `${day}: z\xE1r\xE1s`, invalid: Boolean(err), describedBy: err ? errId : void 0, disabled, readOnly, onCommit: (t, w) => commit(key, "to", t, w) })
        ] }) : /* @__PURE__ */ jsx("span", { className: "bc-hours-closed", children: "Z\xE1rva" }),
        err && /* @__PURE__ */ jsx("p", { className: "bc-error", id: errId, role: "alert", children: err })
      ] }, key);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "bc-meta", id: `${id}-meta`, children: [
      /* @__PURE__ */ jsx("span", { children: "naponta egy s\xE1v \xB7 00:00\u201324:00 \xB7 a z\xE1r\xE1s a nyit\xE1s ut\xE1n" }),
      /* @__PURE__ */ jsxs("span", { className: "bc-count", children: [
        WEEK.filter((d) => value[d.key].open).length,
        "/7 nap nyitva"
      ] })
    ] }),
    !locked && /* @__PURE__ */ jsx("div", { className: "bc-row", children: /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: copyMon, children: "H\xE9tf\u0151 m\xE1sol\xE1sa a h\xE9tk\xF6znapokra" }) }),
    note && /* @__PURE__ */ jsx("p", { className: "bc-notice", role: "status", children: note })
  ] });
}

export {
  OpeningHoursEditor
};
