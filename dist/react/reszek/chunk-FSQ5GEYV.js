/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/reteg/focus.ts
import { useRef } from "react";
var TABBABLE = 'input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
function firstTabbable(root) {
  return root ? [...root.querySelectorAll(TABBABLE)].find((el) => el.offsetParent !== null || el.getClientRects().length > 0) ?? null : null;
}
function firstField(root) {
  const fields = root ? [...root.querySelectorAll("input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled])")] : [];
  return fields.find((el) => el.getClientRects().length > 0) ?? firstTabbable(root);
}
function useReturnFocus() {
  const opener = useRef(null);
  return {
    remember() {
      let el = document.activeElement;
      const menu = el?.closest("[role=menu]");
      if (menu?.id) el = document.querySelector(`[aria-controls="${menu.id}"]`) ?? el;
      if (el && el !== document.body) opener.current = el;
    },
    restore(e) {
      const el = opener.current;
      if (el && el.isConnected) {
        e.preventDefault();
        el.focus();
      }
    }
  };
}

export {
  firstTabbable,
  firstField,
  useReturnFocus
};
