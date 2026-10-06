/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  TooltipIconButton
} from "./chunk-LNEZGNVD.js";
import {
  DropdownMenu
} from "./chunk-PE4H4IUE.js";
import {
  IconButton
} from "./chunk-LQIZVHIZ.js";

// react/src/reteg/RowActions.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function RowActions({ actions, rowLabel }) {
  const inline = (a) => /* @__PURE__ */ jsx(
    TooltipIconButton,
    {
      label: a.label,
      danger: a.danger,
      disabled: a.disabled,
      title: a.disabled ? a.disabledReason : void 0,
      onClick: a.onSelect,
      children: a.icon
    },
    a.label
  );
  if (actions.length <= 2) return /* @__PURE__ */ jsx("div", { className: "bc-row-actions", children: actions.map(inline) });
  const main = actions.find((a) => a.primary) ?? actions.find((a) => !a.danger) ?? actions[0];
  const rest = actions.filter((a) => a !== main);
  const safe = rest.filter((a) => !a.danger), risky = rest.filter((a) => a.danger);
  const entry = (a) => ({ label: a.label, icon: a.icon, onSelect: a.onSelect, danger: a.danger, disabled: a.disabled, disabledReason: a.disabledReason });
  const items = [...safe.map(entry), ...safe.length && risky.length ? ["separator"] : [], ...risky.map(entry)];
  return /* @__PURE__ */ jsxs("div", { className: "bc-row-actions", children: [
    inline(main),
    /* @__PURE__ */ jsx(
      DropdownMenu,
      {
        items,
        label: `M\u0171veletek: ${rowLabel}`,
        trigger: /* @__PURE__ */ jsx(IconButton, { "aria-label": `Tov\xE1bbi m\u0171veletek: ${rowLabel}`, children: /* @__PURE__ */ jsx(MoreIcon, {}) })
      }
    )
  ] });
}
function MoreIcon() {
  return /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { cx: "5", cy: "12", r: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "19", cy: "12", r: "2" })
  ] });
}

export {
  RowActions,
  MoreIcon
};
