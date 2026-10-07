/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  headerText
} from "./chunk-Y76GFFTT.js";

// react/src/adat/SortSelect.tsx
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SortSelect({ table }) {
  const id = useId();
  const cols = table.getAllLeafColumns().filter((c) => c.getCanSort());
  const s = table.getState().sorting[0];
  const value = s ? `${s.id}:${s.desc ? "desc" : "asc"}` : "";
  if (!cols.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bc-dt-sortsel", children: [
    /* @__PURE__ */ jsx("label", { className: "bc-label", htmlFor: id, children: "Rendez\xE9s" }),
    /* @__PURE__ */ jsxs(
      "select",
      {
        id,
        className: "bc-select",
        value,
        onChange: (e) => {
          const [cid, dir] = e.target.value.split(":");
          table.setSorting(cid ? [{ id: cid, desc: dir === "desc" }] : []);
        },
        children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Nincs rendez\xE9s" }),
          cols.flatMap((c) => [
            /* @__PURE__ */ jsxs("option", { value: `${c.id}:asc`, children: [
              headerText(c),
              " \u2013 n\xF6vekv\u0151"
            ] }, `${c.id}a`),
            /* @__PURE__ */ jsxs("option", { value: `${c.id}:desc`, children: [
              headerText(c),
              " \u2013 cs\xF6kken\u0151"
            ] }, `${c.id}d`)
          ])
        ]
      }
    )
  ] });
}

export {
  SortSelect
};
