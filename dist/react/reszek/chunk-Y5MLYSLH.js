/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  DropdownMenu
} from "./chunk-LI526W4A.js";
import {
  useShellNav
} from "./chunk-I6DFSXEU.js";
import {
  Avatar
} from "./chunk-RTYYBFBJ.js";

// react/src/sablon/ShellAccount.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function ShellAccount({ name, detail, avatarSrc, items, menuLabel = (n) => `Felhaszn\xE1l\xF3i men\xFC: ${n}`, loadingLabel = "Bet\xF6lt\xE9s\u2026" }) {
  const nev = name ?? loadingLabel;
  const { closeNav } = useShellNav();
  const zaro = items.map((it) => typeof it === "object" && "label" in it && it.onSelect ? { ...it, onSelect: () => {
    closeNav();
    it.onSelect?.();
  } } : it);
  return /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      label: menuLabel(nev),
      align: "start",
      header: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("strong", { children: nev }),
        detail && /* @__PURE__ */ jsx("span", { className: "bc-muted", children: detail })
      ] }),
      trigger: /* @__PURE__ */ jsxs("button", { type: "button", className: "bc-account", "aria-label": menuLabel(nev), title: nev, children: [
        /* @__PURE__ */ jsx(Avatar, { name: name ?? "?", src: avatarSrc, size: 32, decorative: true }),
        /* @__PURE__ */ jsxs("span", { className: "bc-account-text", children: [
          /* @__PURE__ */ jsx("span", { className: "bc-account-name", children: nev }),
          detail && /* @__PURE__ */ jsx("span", { className: "bc-account-detail", children: detail })
        ] }),
        /* @__PURE__ */ jsx("svg", { className: "bc-account-chev", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 10l4-4 4 4M8 14l4 4 4-4" }) })
      ] }),
      items: zaro
    }
  );
}

export {
  ShellAccount
};
