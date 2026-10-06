/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-PG2ADDWU.js";

// react/src/reteg/DropdownMenu.tsx
import * as DM from "@radix-ui/react-dropdown-menu";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DropdownMenu({ trigger, items, label, align = "end", header }) {
  return /* @__PURE__ */ jsxs(DM.Root, { children: [
    /* @__PURE__ */ jsx(DM.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsx(DM.Portal, { children: /* @__PURE__ */ jsxs(DM.Content, { className: "bc-menu", align, sideOffset: 6, collisionPadding: 16, loop: true, "aria-label": label, children: [
      header && /* @__PURE__ */ jsx("div", { className: "bc-menu-header", children: header }),
      /* @__PURE__ */ jsx(Entries, { items })
    ] }) })
  ] });
}
function Entries({ items }) {
  return /* @__PURE__ */ jsx(Fragment, { children: items.map((it, i) => {
    if (it === "separator") return /* @__PURE__ */ jsx(DM.Separator, { className: "bc-menu-sep" }, `s${i}`);
    if ("group" in it) return /* @__PURE__ */ jsx(DM.Label, { className: "bc-menu-label", children: it.group }, `g${i}`);
    if (it.items) {
      return /* @__PURE__ */ jsxs(DM.Sub, { children: [
        /* @__PURE__ */ jsxs(DM.SubTrigger, { className: "bc-menu-item", disabled: it.disabled, children: [
          it.icon && /* @__PURE__ */ jsx("span", { className: "bc-menu-icon", "aria-hidden": "true", children: it.icon }),
          /* @__PURE__ */ jsx("span", { className: "bc-menu-text", children: it.label }),
          /* @__PURE__ */ jsx("span", { className: "bc-menu-right", "aria-hidden": "true", children: "\u203A" })
        ] }),
        /* @__PURE__ */ jsx(DM.Portal, { children: /* @__PURE__ */ jsx(DM.SubContent, { className: "bc-menu", sideOffset: 4, collisionPadding: 16, loop: true, children: /* @__PURE__ */ jsx(Entries, { items: it.items }) }) })
      ] }, it.label);
    }
    return /* @__PURE__ */ jsxs(DM.Item, { className: cx("bc-menu-item", it.danger && "is-danger"), disabled: it.disabled, onSelect: it.onSelect, children: [
      it.icon && /* @__PURE__ */ jsx("span", { className: "bc-menu-icon", "aria-hidden": "true", children: it.icon }),
      /* @__PURE__ */ jsxs("span", { className: "bc-menu-text", children: [
        it.label,
        it.disabled && it.disabledReason && /* @__PURE__ */ jsx("small", { className: "bc-menu-reason", children: it.disabledReason })
      ] }),
      it.shortcut && /* @__PURE__ */ jsx("kbd", { className: "bc-menu-right", children: it.shortcut })
    ] }, it.label);
  }) });
}

export {
  DropdownMenu
};
