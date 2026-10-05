/* beeco design system 1.43.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  MONTHS,
  WEEKDAYS,
  WEEKDAYS_LONG,
  addDays,
  addMonths,
  fromIso,
  inRange,
  monthGrid,
  toIso,
  todayIso
} from "./chunk-C745NLXQ.js";
import {
  cx
} from "./chunk-TXOE2PSE.js";

// react/src/pickers/Calendar.tsx
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Calendar({ selected, onPick, min, max }) {
  const [focus, setFocus] = useState(selected.start ?? (inRange(todayIso(), min, max) ? todayIso() : min ?? max ?? todayIso()));
  const grid = useRef(null);
  const f = fromIso(focus);
  const days = monthGrid(f.getFullYear(), f.getMonth());
  const today = todayIso();
  useEffect(() => {
    grid.current?.querySelector(`[data-iso="${focus}"]`)?.focus({ preventScroll: true });
  }, [focus]);
  const move = (e) => {
    const map = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1),
      PageDown: () => addMonths(focus, 1),
      Home: () => addDays(focus, -((f.getDay() + 6) % 7)),
      End: () => addDays(focus, 6 - (f.getDay() + 6) % 7)
    };
    if (map[e.key]) {
      e.preventDefault();
      setFocus(map[e.key]());
    }
  };
  const isSel = (iso) => iso === selected.start || iso === selected.end;
  const inSel = (iso) => Boolean(selected.start && selected.end && iso > selected.start && iso < selected.end);
  return /* @__PURE__ */ jsxs("div", { className: "bc-cal", children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-cal-head", children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", "aria-label": "El\u0151z\u0151 h\xF3nap", onClick: () => setFocus(addMonths(focus, -1)), children: "\u2039" }),
      /* @__PURE__ */ jsxs("strong", { "aria-live": "polite", children: [
        f.getFullYear(),
        ". ",
        MONTHS[f.getMonth()]
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", "aria-label": "K\xF6vetkez\u0151 h\xF3nap", onClick: () => setFocus(addMonths(focus, 1)), children: "\u203A" })
    ] }),
    /* @__PURE__ */ jsxs("table", { className: "bc-cal-grid", role: "grid", ref: grid, onKeyDown: move, "aria-label": `${f.getFullYear()}. ${MONTHS[f.getMonth()]}`, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: WEEKDAYS.map((w, i) => /* @__PURE__ */ jsx("th", { scope: "col", abbr: WEEKDAYS_LONG[i], children: w }, w)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: Array.from({ length: 6 }, (_, w) => /* @__PURE__ */ jsx("tr", { children: days.slice(w * 7, w * 7 + 7).map((d) => {
        const iso = toIso(d);
        const off = !inRange(iso, min, max);
        return /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "data-iso": iso,
            tabIndex: iso === focus ? 0 : -1,
            disabled: off,
            "aria-selected": isSel(iso),
            "aria-label": `${d.getFullYear()}. ${MONTHS[d.getMonth()]} ${d.getDate()}., ${WEEKDAYS_LONG[(d.getDay() + 6) % 7]}${off ? ", nem v\xE1laszthat\xF3" : ""}`,
            className: cx("bc-day", d.getMonth() !== f.getMonth() && "is-outside", iso === today && "is-today", inSel(iso) && "is-in-range"),
            onClick: () => onPick(iso),
            children: d.getDate()
          }
        ) }, iso);
      }) }, w)) })
    ] })
  ] });
}

export {
  Calendar
};
