/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-4NETF2NE.js";

// react/src/kieg/KiegDialog.tsx
import { useEffect, useId, useRef } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function KiegDialog({ open, onCancel, title, children, actions, className }) {
  const ref = useRef(null);
  const back = useRef(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      back.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      d.showModal();
      d.querySelector("[data-autofocus]")?.focus();
    } else if (!open && d.open) {
      d.close();
      back.current?.focus();
    }
  }, [open]);
  useEffect(() => () => {
    if (ref.current?.open) back.current?.focus();
  }, []);
  return /* @__PURE__ */ jsx(
    "dialog",
    {
      ref,
      role: "alertdialog",
      "aria-modal": "true",
      "aria-labelledby": `${id}-t`,
      "aria-describedby": children ? `${id}-d` : void 0,
      className: cx("bc-modal bc-kdialog", className),
      onCancel: (e) => {
        e.preventDefault();
        onCancel();
      },
      children: open && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "bc-modal-head", children: /* @__PURE__ */ jsx("h2", { id: `${id}-t`, children: title }) }),
        children && /* @__PURE__ */ jsx("div", { className: "bc-modal-body", id: `${id}-d`, children }),
        /* @__PURE__ */ jsx("div", { className: "bc-modal-foot", children: actions })
      ] })
    }
  );
}

export {
  KiegDialog
};
