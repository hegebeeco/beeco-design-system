/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useTheme
} from "./chunk-FY5E63PK.js";
import {
  TooltipIconButton
} from "./chunk-BN33ITYF.js";
import {
  SegmentedControl
} from "./chunk-MJT4ILRX.js";

// react/src/tema/ThemeToggle.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var THEME_LABELS_HU = {
  group: "Megjelen\xE9s",
  light: "Vil\xE1gos",
  dark: "S\xF6t\xE9t",
  auto: "Rendszer szerint",
  toDark: "S\xF6t\xE9t m\xF3d bekapcsol\xE1sa",
  toLight: "Vil\xE1gos m\xF3d bekapcsol\xE1sa"
};
var svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
var IcSun = () => /* @__PURE__ */ jsxs("svg", { ...svg, children: [
  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4" }),
  /* @__PURE__ */ jsx("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" })
] });
var IcMoon = () => /* @__PURE__ */ jsx("svg", { ...svg, children: /* @__PURE__ */ jsx("path", { d: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" }) });
var IcAuto = () => /* @__PURE__ */ jsxs("svg", { ...svg, children: [
  /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "12", rx: "2" }),
  /* @__PURE__ */ jsx("path", { d: "M8 20h8M12 16v4" })
] });
function ThemeToggle({ variant = "icon", labels, className }) {
  const { mode, resolved, setMode, toggle } = useTheme();
  const l = { ...THEME_LABELS_HU, ...labels };
  if (variant === "segmented") {
    return /* @__PURE__ */ jsx(
      SegmentedControl,
      {
        label: l.group,
        value: mode,
        onChange: setMode,
        className,
        items: [
          { value: "light", label: l.light, icon: /* @__PURE__ */ jsx(IcSun, {}) },
          { value: "dark", label: l.dark, icon: /* @__PURE__ */ jsx(IcMoon, {}) },
          { value: "auto", label: l.auto, icon: /* @__PURE__ */ jsx(IcAuto, {}) }
        ]
      }
    );
  }
  const toDark = resolved === "light";
  return /* @__PURE__ */ jsx(TooltipIconButton, { label: toDark ? l.toDark : l.toLight, onClick: toggle, className, "data-theme-toggle": "", children: toDark ? /* @__PURE__ */ jsx(IcMoon, {}) : /* @__PURE__ */ jsx(IcSun, {}) });
}

export {
  THEME_LABELS_HU,
  IcSun,
  IcMoon,
  IcAuto,
  ThemeToggle
};
