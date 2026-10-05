/* beeco design system 1.44.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  IcCopy,
  IcDownload
} from "./chunk-CJR4DODQ.js";
import {
  formatHu
} from "./chunk-CMH3FNYU.js";
import {
  Button
} from "./chunk-OH6YOEFY.js";

// react/src/media/ImportResult.tsx
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var LEVEL = { error: "Hiba", warning: "Figyelmeztet\xE9s" };
var NO_REASON = "Az okot a rendszer nem adta meg \u2013 nyisd meg a sort az Excelben, \xE9s n\xE9zd \xE1t.";
var csvCell = (s) => `"${s.replace(/"/g, '""')}"`;
var issuesToCsv = (issues, sep = ";") => [["Sor", "Oszlop", "Szint", "Mi a baj", "Mit tegy\xE9l"], ...issues.map((i) => [String(i.row), i.column ?? "", LEVEL[i.level], i.reason ?? NO_REASON, i.next ?? ""])].map((r) => r.map(csvCell).join(sep)).join("\r\n");
function ImportResult({ result, fileName = "import-hibalista.csv", limit = 200 }) {
  const [said, setSaid] = useState("");
  const { total, imported, issues } = result;
  const errors = issues.filter((i) => i.level === "error").length;
  const warnings = issues.length - errors;
  const shown = [...issues].sort((a, b) => a.row - b.row).slice(0, limit);
  const kind = total === 0 ? "is-warning" : imported === 0 ? "is-danger" : issues.length ? "is-warning" : "is-success";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(issuesToCsv(issues, "	"));
      setSaid("A list\xE1t a v\xE1g\xF3lapra m\xE1soltam \u2013 beillesztheted az Excelbe.");
    } catch {
      setSaid("Nem siker\xFClt m\xE1solni \u2013 t\xF6ltsd le ink\xE1bb a list\xE1t.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob(["\uFEFF" + issuesToCsv(issues)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    setSaid(`Let\xF6ltve: ${fileName}`);
  };
  return /* @__PURE__ */ jsxs("section", { className: "bc-import-result", children: [
    /* @__PURE__ */ jsx("div", { className: `bc-alert ${kind}`, role: imported === 0 && total > 0 ? "alert" : "status", children: /* @__PURE__ */ jsx("p", { children: total === 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("strong", { children: "A f\xE1jlban nincs adatsor." }),
      " Csak a fejl\xE9c van benne? T\xF6ltsd ki a sablont, \xE9s pr\xF3b\xE1ld \xFAjra."
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("strong", { children: [
        formatHu(total, 0),
        " sorb\xF3l ",
        formatHu(imported, 0),
        " beker\xFClt."
      ] }),
      " ",
      errors > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        formatHu(errors, 0),
        " sor kimaradt (hiba). "
      ] }),
      warnings > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
        formatHu(warnings, 0),
        " sor figyelmeztet\xE9ssel ker\xFClt be. "
      ] }),
      issues.length === 0 && "Minden sor rendben volt."
    ] }) }) }),
    issues.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "bc-table-wrap bc-import-list", tabIndex: 0, role: "region", "aria-label": `Hibalista: ${issues.length} sor, ${imported}/${total} beker\xFClt`, children: /* @__PURE__ */ jsxs("table", { className: "bc-table is-dense", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("th", { scope: "col", className: "is-num", children: "Sor" }),
          /* @__PURE__ */ jsx("th", { scope: "col", children: "Oszlop" }),
          /* @__PURE__ */ jsx("th", { scope: "col", children: "Mi a baj, mit tegy\xE9l" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: shown.map((i, n) => /* @__PURE__ */ jsxs("tr", { className: `is-${i.level}`, children: [
          /* @__PURE__ */ jsxs("td", { className: "is-num", children: [
            i.row,
            "."
          ] }),
          /* @__PURE__ */ jsx("td", { children: i.column ?? "\u2013" }),
          /* @__PURE__ */ jsxs("td", { children: [
            /* @__PURE__ */ jsx("span", { className: `bc-badge ${i.level === "error" ? "is-danger" : "is-warning"}`, children: LEVEL[i.level] }),
            " ",
            i.reason ?? NO_REASON,
            i.next && /* @__PURE__ */ jsxs(Fragment, { children: [
              " ",
              /* @__PURE__ */ jsx("b", { children: i.next })
            ] })
          ] })
        ] }, `${i.row}-${i.column}-${n}`)) })
      ] }) }),
      issues.length > shown.length && /* @__PURE__ */ jsxs("p", { className: "bc-help", children: [
        "Az els\u0151 ",
        limit,
        " sort mutatom; a teljes lista (",
        formatHu(issues.length, 0),
        " sor) a let\xF6lt\xF6tt f\xE1jlban van."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bc-row", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx(IcDownload, {}), onClick: download, children: "Hibalista let\xF6lt\xE9se" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx(IcCopy, {}), onClick: () => void copy(), children: "M\xE1sol\xE1s" }),
        /* @__PURE__ */ jsx("span", { className: "bc-notice", role: "status", children: said })
      ] })
    ] })
  ] });
}

export {
  issuesToCsv,
  ImportResult
};
