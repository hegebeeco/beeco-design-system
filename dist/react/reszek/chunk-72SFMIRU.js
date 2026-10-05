/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  defaultBig,
  keyValue,
  pctOf,
  snap,
  valueAt
} from "./chunk-W3RAW4GW.js";
import {
  FieldInput
} from "./chunk-T22YAXFX.js";
import {
  Field
} from "./chunk-76V4IW5G.js";
import {
  formatHu
} from "./chunk-IG2VMPIK.js";

// react/src/kieg/Slider.tsx
import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var fmt = (unit, step) => (v) => `${formatHu(v, (String(step).split(".")[1] ?? "").length)}${unit ? ` ${unit}` : ""}`;
function Track({ values, onChange, spec, labels, format, disabled, minGap, describedBy, invalid }) {
  const track = useRef(null);
  const drag = useRef(null);
  const set = (i, raw) => {
    let x = snap(raw, spec);
    if (values.length === 2) x = i === 0 ? Math.min(x, values[1] - minGap) : Math.max(x, values[0] + minGap);
    if (x === values[i]) return;
    const next = [...values];
    next[i] = x;
    onChange(next);
  };
  const thumbs = () => track.current?.querySelectorAll("[role=slider]");
  const onDown = (e) => {
    if (disabled || e.button !== 0) return;
    const v = valueAt(e.clientX, e.currentTarget.getBoundingClientRect(), spec);
    const i = values.length === 1 ? 0 : Math.abs(v - values[0]) < Math.abs(v - values[1]) || v < values[0] ? 0 : 1;
    set(i, v);
    drag.current = i;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
    thumbs()?.[i]?.focus();
  };
  const onMove = (e) => {
    if (drag.current !== null) set(drag.current, valueAt(e.clientX, e.currentTarget.getBoundingClientRect(), spec));
  };
  const onKey = (i) => (e) => {
    const v = keyValue(e.key, values[i], spec);
    if (v === null || disabled) return;
    e.preventDefault();
    set(i, v);
  };
  const lo = values.length === 2 ? pctOf(values[0], spec) : 0;
  const hi = pctOf(values[values.length - 1], spec);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: track,
      className: "bc-slider-track",
      "data-disabled": disabled || void 0,
      onPointerDown: onDown,
      onPointerMove: onMove,
      onPointerUp: () => {
        drag.current = null;
      },
      onPointerCancel: () => {
        drag.current = null;
      },
      children: [
        /* @__PURE__ */ jsx("span", { className: "bc-slider-rail", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "bc-slider-fill", style: { left: `${lo}%`, width: `${hi - lo}%` } }) }),
        values.map((v, i) => /* @__PURE__ */ jsx(
          "span",
          {
            role: "slider",
            tabIndex: disabled ? -1 : 0,
            className: "bc-slider-thumb",
            style: { left: `${pctOf(v, spec)}%` },
            "aria-label": labels[i],
            "aria-valuemin": i === 1 ? values[0] + minGap : spec.min,
            "aria-valuemax": i === 0 && values.length === 2 ? values[1] - minGap : spec.max,
            "aria-valuenow": v,
            "aria-valuetext": format(v),
            "aria-disabled": disabled || void 0,
            "aria-describedby": describedBy,
            "aria-invalid": invalid || void 0,
            "aria-orientation": "horizontal",
            onKeyDown: onKey(i)
          },
          i
        ))
      ]
    }
  );
}
function Frame(p) {
  const step = p.step ?? 1;
  const spec = { min: p.min, max: p.max, step, bigStep: p.bigStep ?? defaultBig(p.min, p.max, step) };
  const format = p.format ?? fmt(p.unit, step);
  const shown = p.values.map(format).join(" \u2013 ");
  return /* @__PURE__ */ jsx(
    Field,
    {
      label: p.label,
      help: p.help,
      range: p.range ?? `${format(p.min)} \u2013 ${format(p.max)} \xB7 l\xE9p\xE9s: ${format(step)}`,
      error: p.error,
      notice: p.notice,
      required: p.required,
      disabled: p.disabled,
      className: p.className,
      labelFor: false,
      children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs("div", { className: "bc-slider", children: [
        /* @__PURE__ */ jsx("output", { className: "bc-slider-out", "aria-hidden": "true", children: shown }),
        /* @__PURE__ */ jsx(
          Track,
          {
            values: p.values,
            onChange: p.onValues,
            spec,
            labels: p.thumbLabels(p.label),
            format,
            disabled: p.disabled,
            minGap: p.minGap ?? 0,
            describedBy: f.describedBy,
            invalid: f.invalid
          }
        ),
        p.name && /* @__PURE__ */ jsx("input", { type: "hidden", name: p.name, value: p.values.join("\u2013"), "aria-labelledby": `${f.id}-label` })
      ] }) })
    }
  );
}
function Slider({ value, onChange, ...rest }) {
  return /* @__PURE__ */ jsx(Frame, { ...rest, values: [value], onValues: (v) => onChange(v[0]), thumbLabels: (l) => [l] });
}
function RangeSlider({ value, onChange, minGap, ...rest }) {
  return /* @__PURE__ */ jsx(Frame, { ...rest, values: value, minGap, onValues: (v) => onChange([v[0], v[1]]), thumbLabels: (l) => [`${l}: als\xF3 hat\xE1r`, `${l}: fels\u0151 hat\xE1r`] });
}

export {
  Slider,
  RangeSlider
};
