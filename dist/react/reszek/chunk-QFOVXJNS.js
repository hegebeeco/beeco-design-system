/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  DatePicker
} from "./chunk-PYH6XRB7.js";
import {
  todayIso
} from "./chunk-NPO7X7CS.js";
import {
  SegmentedControl
} from "./chunk-X2THRGGM.js";

// react/src/form/ScheduleField.tsx
import { useEffect, useId, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var helyi = (date, time) => date ? /* @__PURE__ */ new Date(`${date}T${time || "00:00"}:00`) : null;
function scheduleIssues(v, now = /* @__PURE__ */ new Date()) {
  const kezd = helyi(v.date, v.time), veg = helyi(v.endDate, v.endTime);
  const r = {};
  if (kezd && kezd.getTime() <= now.getTime()) r.start = "Ez az id\u0151pont m\xE1r elm\xFAlt. Adj meg j\xF6v\u0151beli id\u0151pontot, vagy v\xE1laszd az \u201EAzonnal\u201D-t.";
  const viszonyitas = kezd ?? now;
  if (veg && veg.getTime() <= viszonyitas.getTime()) r.end = kezd ? "A v\xE9ge a kezd\xE9s el\u0151tt (vagy vele egy id\u0151ben) van. Adj meg k\xE9s\u0151bbi id\u0151pontot." : "A v\xE9ge m\xE1r elm\xFAlt. Adj meg j\xF6v\u0151beli id\u0151pontot, vagy hagyd \xFCresen.";
  return r;
}
function ScheduleField({ value, onChange, label = "Kezd\xE9s", help, withEnd, endLabel = "V\xE9ge", endHelp, nowLabel = "Azonnal", laterLabel = "Id\u0151z\xEDtve", error, endError, silent }) {
  const id = useId();
  const [mod, setMod] = useState(value.date ? "later" : "now");
  useEffect(() => {
    if (value.date) setMod("later");
  }, [value.date]);
  const hibak = silent ? {} : scheduleIssues(value);
  return /* @__PURE__ */ jsxs("div", { className: "bc-schedule", role: "group", "aria-labelledby": `${id}-l`, children: [
    /* @__PURE__ */ jsx("p", { className: "bc-label bc-schedule-label", id: `${id}-l`, children: label }),
    /* @__PURE__ */ jsx(
      SegmentedControl,
      {
        label,
        value: mod,
        items: [{ value: "now", label: nowLabel }, { value: "later", label: laterLabel }],
        onChange: (m) => {
          setMod(m);
          if (m === "now") onChange({ ...value, date: null, time: null });
        }
      }
    ),
    mod === "later" && /* @__PURE__ */ jsx(
      DatePicker,
      {
        label: `${label} napja`,
        help: help ?? "J\xF6v\u0151beli nap \xE9s id\u0151pont.",
        required: true,
        min: todayIso(),
        value: value.date,
        onChange: (d) => onChange({ ...value, date: d }),
        time: { value: value.time, onChange: (t) => onChange({ ...value, time: t }), label: "Id\u0151pont" },
        error: error ?? (value.date ? hibak.start : void 0)
      }
    ),
    withEnd && /* @__PURE__ */ jsx(
      DatePicker,
      {
        label: endLabel,
        help: endHelp ?? "Elhagyhat\xF3. Ezut\xE1n m\xE1r nem l\xE1tszik.",
        min: value.date ?? todayIso(),
        value: value.endDate ?? null,
        onChange: (d) => onChange({ ...value, endDate: d }),
        time: { value: value.endTime ?? null, onChange: (t) => onChange({ ...value, endTime: t }), label: "Id\u0151pont" },
        error: endError ?? (value.endDate ? hibak.end : void 0)
      }
    )
  ] });
}

export {
  scheduleIssues,
  ScheduleField
};
