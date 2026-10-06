/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  MonthAgenda,
  MonthLegend
} from "./chunk-QOOSSQ25.js";
import {
  CAL_KINDS,
  dayTitle,
  eventsByDay,
  kindLabel,
  kindTone
} from "./chunk-3WMHMUU3.js";
import {
  IcLeft,
  IcRight
} from "./chunk-LBZU5PSY.js";
import {
  MONTHS,
  WEEKDAYS,
  WEEKDAYS_LONG,
  addDays,
  addMonths,
  fromIso,
  monthGrid,
  toIso,
  todayIso
} from "./chunk-YGFEDREK.js";
import {
  Button,
  IconButton
} from "./chunk-DNKGFO3X.js";
import {
  cx
} from "./chunk-KBQVEJSX.js";

// react/src/media/MonthCalendar.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function MonthCalendar({ events, initialDate, onMonthChange, onSelectDay, maxPerDay = 3, loading, error, onRetry, hidden = [], onHiddenChange, labels, kinds, kindDefs }) {
  const [focus, setFocus] = useState(initialDate ?? todayIso());
  const [selected, setSelected] = useState(focus);
  const grid = useRef(null);
  const moved = useRef(false);
  const f = fromIso(focus);
  const monthKey = `${f.getFullYear()}-${f.getMonth()}`;
  const days = useMemo(() => monthGrid(f.getFullYear(), f.getMonth()).map(toIso), [monthKey]);
  const hid = useMemo(() => new Set(hidden), [hidden]);
  const kindList = useMemo(
    () => kinds ?? [...CAL_KINDS, ...Object.keys(kindDefs ?? {}).filter((k) => !CAL_KINDS.includes(k))],
    [kinds, kindDefs]
  );
  const byDay = useMemo(() => eventsByDay(events, days, hid, kindList), [events, days, hid, kindList]);
  const view = (k) => ({ label: kindLabel(k, labels, kindDefs), tone: kindTone(k, kindDefs), icon: kindDefs?.[k]?.icon });
  const today = todayIso();
  const title = `${f.getFullYear()}. ${MONTHS[f.getMonth()]}`;
  const monthCount = days.filter((d) => fromIso(d).getMonth() === f.getMonth()).reduce((n, d) => n + (byDay.get(d)?.length ?? 0), 0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onMonthChange?.(`${focus.slice(0, 7)}-01`);
  }, [monthKey]);
  useEffect(() => {
    if (moved.current) {
      grid.current?.querySelector(`[data-iso="${focus}"]`)?.focus({ preventScroll: true });
      moved.current = false;
    }
  }, [focus]);
  const go = (iso, kb = false) => {
    moved.current = kb;
    setFocus(iso);
  };
  const pick = (iso) => {
    setFocus(iso);
    setSelected(iso);
    onSelectDay?.(iso, byDay.get(iso) ?? []);
  };
  const onKey = (e) => {
    const dow = (f.getDay() + 6) % 7;
    const map = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1),
      PageDown: () => addMonths(focus, 1),
      Home: () => addDays(focus, -dow),
      End: () => addDays(focus, 6 - dow)
    };
    if (map[e.key]) {
      e.preventDefault();
      go(map[e.key](), true);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bc-mcal", "aria-busy": loading || void 0, children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-mcal-head", children: [
      /* @__PURE__ */ jsx(IconButton, { "aria-label": "El\u0151z\u0151 h\xF3nap", onClick: () => go(addMonths(focus, -1)), children: /* @__PURE__ */ jsx(IcLeft, {}) }),
      /* @__PURE__ */ jsx("h2", { className: "bc-mcal-title", "aria-live": "polite", children: title }),
      /* @__PURE__ */ jsx(IconButton, { "aria-label": "K\xF6vetkez\u0151 h\xF3nap", onClick: () => go(addMonths(focus, 1)), children: /* @__PURE__ */ jsx(IcRight, {}) }),
      /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => {
        go(today);
        setSelected(today);
      }, disabled: focus.slice(0, 7) === today.slice(0, 7), children: "Ma" })
    ] }),
    /* @__PURE__ */ jsx(MonthLegend, { kinds: kindList, view, hidden: hid, onHiddenChange }),
    loading && /* @__PURE__ */ jsxs("p", { className: "bc-mcal-note", role: "status", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-spinner", "aria-hidden": "true" }),
      " T\xF6lt\xF6m a h\xF3nap tartalm\xE1t\u2026"
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "bc-alert is-danger", role: "alert", children: [
      /* @__PURE__ */ jsx("p", { children: error }),
      onRetry && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
    ] }),
    !error && !loading && monthCount === 0 && /* @__PURE__ */ jsx("p", { className: "bc-mcal-note", role: "status", children: kindList.every((k) => hid.has(k)) ? "Minden tartalomfajta ki van kapcsolva \u2013 kapcsolj be egyet a jelmagyar\xE1zatban." : `${title}: ebben a h\xF3napban m\xE9g nincs tartalom.` }),
    /* @__PURE__ */ jsx("div", { className: "bc-mcal-scroll", children: /* @__PURE__ */ jsxs("table", { className: "bc-mcal-grid", role: "grid", ref: grid, onKeyDown: onKey, "aria-label": `${title} \u2013 tartalmi napt\xE1r`, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { children: WEEKDAYS.map((w, i) => /* @__PURE__ */ jsx("th", { scope: "col", abbr: WEEKDAYS_LONG[i], children: w }, w)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: Array.from({ length: 6 }, (_, w) => /* @__PURE__ */ jsx("tr", { children: days.slice(w * 7, w * 7 + 7).map((iso) => {
        const list = byDay.get(iso) ?? [];
        const out = fromIso(iso).getMonth() !== f.getMonth();
        const more = list.length - maxPerDay;
        const summary = list.length ? `, ${list.length} tartalom: ${list.map((e) => `${e.title} (${view(e.kind).label})`).join("; ")}` : ", nincs tartalom";
        return /* @__PURE__ */ jsx("td", { role: "gridcell", "aria-selected": iso === selected, children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            "data-iso": iso,
            tabIndex: iso === focus ? 0 : -1,
            onClick: () => pick(iso),
            className: cx("bc-mcal-day", out && "is-outside", iso === today && "is-today", iso === selected && "is-selected"),
            "aria-label": `${iso === today ? "Ma, " : ""}${dayTitle(iso)}${summary}`,
            children: [
              /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: fromIso(iso).getDate() }),
              /* @__PURE__ */ jsxs("span", { className: "bc-mcal-evs", "aria-hidden": "true", children: [
                list.slice(0, more > 0 ? maxPerDay - 1 : maxPerDay).map((e) => {
                  const v = view(e.kind);
                  return /* @__PURE__ */ jsxs("span", { className: `bc-mcal-ev is-${v.tone}`, children: [
                    v.icon && /* @__PURE__ */ jsx("span", { className: "bc-mcal-ic", children: v.icon }),
                    e.title
                  ] }, e.id);
                }),
                more > 0 && /* @__PURE__ */ jsxs("span", { className: "bc-mcal-more", children: [
                  "+",
                  more + 1,
                  " tov\xE1bbi"
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "bc-mcal-dots", "aria-hidden": "true", children: [...new Set(list.map((e) => e.kind))].map((k) => /* @__PURE__ */ jsx("i", { className: `is-${kindTone(k, kindDefs)}` }, k)) })
            ]
          }
        ) }, iso);
      }) }, w)) })
    ] }) }),
    /* @__PURE__ */ jsx(MonthAgenda, { iso: selected, events: byDay.get(selected) ?? eventsByDay(events, [selected], hid, kindList).get(selected) ?? [], view })
  ] });
}

export {
  MonthCalendar
};
