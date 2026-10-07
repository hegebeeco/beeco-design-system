/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/pickers/normalize.ts
import { createElement, Fragment } from "react";
var norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function highlight(label, query) {
  const q = norm(query.trim());
  if (!q) return label;
  const i = norm(label).indexOf(q);
  if (i < 0) return label;
  return createElement(Fragment, null, label.slice(0, i), createElement("mark", null, label.slice(i, i + q.length)), label.slice(i + q.length));
}
var createError = (e) => e instanceof Error && e.name === "AbortError" ? void 0 : e instanceof Error && e.message ? e.message : "Nem siker\xFClt l\xE9trehozni. Pr\xF3b\xE1ld \xFAjra.";

export {
  norm,
  highlight,
  createError
};
