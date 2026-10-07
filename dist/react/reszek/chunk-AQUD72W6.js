/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  MoreIcon
} from "./chunk-67WBBXRS.js";
import {
  DropdownMenu
} from "./chunk-DNNXNHOT.js";
import {
  ConfirmDialog
} from "./chunk-25EL4YNB.js";
import {
  Button,
  IconButton
} from "./chunk-E5CUZH7I.js";

// react/src/sablon/DetailActions.tsx
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function DetailActions({ actions, subject }) {
  const [pending, setPending] = useState(null);
  const [open, setOpen] = useState(false);
  const run = (a) => {
    if (a.confirm) {
      setPending(a);
      setOpen(true);
      return;
    }
    void a.onSelect();
  };
  const main = actions.find((a) => a.primary) ?? actions.find((a) => !a.danger);
  const rest = actions.filter((a) => a !== main);
  const safe = rest.filter((a) => !a.danger), risky = rest.filter((a) => a.danger);
  const entry = (a) => ({
    label: a.confirm && !a.label.endsWith("\u2026") ? `${a.label}\u2026` : a.label,
    icon: a.icon,
    danger: a.danger,
    disabled: a.disabled,
    disabledReason: a.disabledReason,
    onSelect: () => run(a)
  });
  const items = [...safe.map(entry), ...safe.length && risky.length ? ["separator"] : [], ...risky.map(entry)];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    main && /* @__PURE__ */ jsx(
      Button,
      {
        variant: main.danger ? "danger" : "primary",
        icon: main.icon,
        disabled: main.disabled,
        title: main.disabled ? main.disabledReason : void 0,
        onClick: () => run(main),
        children: main.label
      }
    ),
    items.length > 0 && /* @__PURE__ */ jsx(
      DropdownMenu,
      {
        items,
        label: `M\u0171veletek: ${subject}`,
        trigger: /* @__PURE__ */ jsx(IconButton, { "aria-label": `Tov\xE1bbi m\u0171veletek: ${subject}`, children: /* @__PURE__ */ jsx(MoreIcon, {}) })
      }
    ),
    pending?.confirm && /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        open,
        onOpenChange: setOpen,
        title: pending.confirm.title,
        confirmLabel: pending.confirm.confirmLabel,
        danger: pending.danger,
        onConfirm: pending.onSelect,
        children: pending.confirm.body
      }
    )
  ] });
}

export {
  DetailActions
};
