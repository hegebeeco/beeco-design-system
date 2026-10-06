/* beeco design system 1.46.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  KiegDialog
} from "./chunk-BS6ZVP2Z.js";
import {
  MergeFieldChoice
} from "./chunk-KEHJLKB7.js";
import {
  differing,
  isBlank,
  mergedValues,
  showValue,
  suggest
} from "./chunk-3PF6MXBW.js";
import {
  ProgressBar
} from "./chunk-UZFN2TEW.js";
import {
  RadioGroup
} from "./chunk-4GJ6ID6R.js";
import {
  HelpButton
} from "./chunk-NX4AZ7H3.js";
import {
  Button
} from "./chunk-YZUSUFMW.js";
import {
  cx
} from "./chunk-4HTA5F62.js";

// react/src/kieg/CompareMerge.tsx
import { useId, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function CompareMerge({ records, fields, choices, onChoicesChange, survivor, onSurvivorChange, onMerge, consequence, className }) {
  const uid = useId();
  const [showSame, setShowSame] = useState(false);
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState();
  const diff = differing(records, fields);
  const diffKeys = new Set(diff.map((f) => f.key));
  const same = fields.filter((f) => !diffKeys.has(f.key));
  const decided = diff.filter((f) => choices[f.key]).length;
  const result = mergedValues(records, fields, choices);
  const reqErr = (f) => f.required && choices[f.key] && isBlank(result[f.key]) ? `A(z) \u201E${f.label}\u201D nem lehet \xFCres \u2013 v\xE1lassz kit\xF6lt\xF6tt \xE9rt\xE9ket.` : void 0;
  const blocked = diff.some(reqErr);
  const needSurvivor = Boolean(onSurvivorChange) && !survivor;
  const ready = decided === diff.length && !blocked && !needSurvivor;
  const missing = [diff.length - decided > 0 && `${diff.length - decided} mez\u0151`, needSurvivor && "a megmarad\xF3 rekord", blocked && "egy k\xF6telez\u0151 mez\u0151 \xFCres"].filter(Boolean).join(", ");
  const run = async () => {
    if (busy) return;
    setErr(void 0);
    try {
      const r = onMerge(result, choices);
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      setAsking(false);
    } catch (e) {
      setBusy(false);
      setErr(`Nem siker\xFClt az \xF6sszef\xE9s\xFCl\xE9s${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra.`);
    }
  };
  const survivorLabel = records.find((r) => r.id === survivor)?.label;
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-merge", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-merge-head", children: [
      /* @__PURE__ */ jsxs("div", { className: "bc-merge-intro", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          /* @__PURE__ */ jsxs("strong", { children: [
            diff.length,
            " mez\u0151 t\xE9r el"
          ] }),
          ", ",
          same.length,
          " egyezik. Mez\u0151nk\xE9nt v\xE1laszd ki, melyik \xE9rt\xE9k maradjon."
        ] }),
        /* @__PURE__ */ jsx(HelpButton, { label: "\xD6sszef\xE9s\xFCl\xE9s", children: "Az egyez\u0151 mez\u0151k maradnak, ahogy vannak. Az elt\xE9r\u0151kn\xE9l te d\xF6nt\xF6d el, melyik rekord \xE9rt\xE9ke ker\xFCl az eredm\xE9nybe. A \u201EJavaslat\u201D csak ott d\xF6nt, ahol egyetlen rekordban van kit\xF6ltve az adat." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bc-row", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => onChoicesChange(suggest(records, fields, choices)), children: "Javaslat: a kit\xF6lt\xF6tt \xE9rt\xE9kek" }),
        records.map((r) => /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", onClick: () => onChoicesChange(Object.fromEntries(diff.map((f) => [f.key, r.id]))), children: [
          "Mind innen: ",
          r.label
        ] }, r.id))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bc-merge-progress", children: [
        /* @__PURE__ */ jsx(ProgressBar, { value: diff.length ? decided / diff.length : 1, label: "Eld\xF6nt\xF6tt mez\u0151k" }),
        /* @__PURE__ */ jsxs("span", { className: "bc-count", role: "status", children: [
          decided,
          "/",
          diff.length,
          " elt\xE9r\u0151 mez\u0151 eld\xF6ntve"
        ] })
      ] })
    ] }),
    onSurvivorChange && /* @__PURE__ */ jsx(
      RadioGroup,
      {
        label: "Melyik rekord maradjon meg?",
        name: `${uid}-survivor`,
        value: survivor,
        onChange: onSurvivorChange,
        help: "A megmarad\xF3 rekord azonos\xEDt\xF3ja, \xE9rt\xE9kel\xE9sei \xE9s kapcsolatai maradnak; a m\xE1sik t\xF6rl\u0151dik. A mez\u0151k \xE9rt\xE9k\xE9t lent v\xE1lasztod.",
        options: records.map((r) => ({ value: r.id, label: r.label }))
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bc-merge-fields", children: [
      diff.map((f) => /* @__PURE__ */ jsx(
        MergeFieldChoice,
        {
          field: f,
          records,
          chosen: choices[f.key],
          error: reqErr(f),
          onChoose: (id) => onChoicesChange({ ...choices, [f.key]: id })
        },
        f.key
      )),
      diff.length === 0 && /* @__PURE__ */ jsx("div", { className: "bc-alert is-info", children: /* @__PURE__ */ jsxs("p", { children: [
        "Minden mez\u0151 egyezik",
        onSurvivorChange ? " \u2013 csak a megmarad\xF3 rekordot kell kiv\xE1lasztanod." : ": az \xF6sszef\xE9s\xFCl\xE9s csak a duplik\xE1tumot sz\xFCnteti meg."
      ] }) })
    ] }),
    same.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bc-merge-same", children: [
      /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", "aria-expanded": showSame, onClick: () => setShowSame(!showSame), children: showSame ? "Egyez\u0151 mez\u0151k elrejt\xE9se" : `Egyez\u0151 mez\u0151k mutat\xE1sa (${same.length})` }),
      showSame && /* @__PURE__ */ jsx("dl", { className: "bc-merge-result", children: same.map((f) => /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("dt", { children: f.label }),
        /* @__PURE__ */ jsxs("dd", { children: [
          isBlank(result[f.key]) ? "(\xFCres)" : (f.format ?? showValue)(result[f.key]),
          " ",
          /* @__PURE__ */ jsx("span", { className: "bc-badge is-muted", children: "egyezik" })
        ] })
      ] }, f.key)) })
    ] }),
    diff.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bc-card bc-merge-preview", children: [
      /* @__PURE__ */ jsx("h3", { className: "bc-card-title", children: "Az eredm\xE9ny" }),
      /* @__PURE__ */ jsx("dl", { className: "bc-merge-result", children: diff.map((f) => /* @__PURE__ */ jsxs("div", { "data-result": f.key, children: [
        /* @__PURE__ */ jsx("dt", { children: f.label }),
        /* @__PURE__ */ jsx("dd", { children: choices[f.key] ? isBlank(result[f.key]) ? "(\xFCres)" : (f.format ?? showValue)(result[f.key]) : /* @__PURE__ */ jsx("em", { className: "bc-merge-todo", children: "m\xE9g nem v\xE1lasztott\xE1l" }) })
      ] }, f.key)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-form-actions bc-merge-actions", children: [
      !ready && /* @__PURE__ */ jsxs("span", { className: "bc-merge-missing", children: [
        "Hi\xE1nyzik: ",
        missing,
        "."
      ] }),
      /* @__PURE__ */ jsx(Button, { disabled: !ready, onClick: () => setAsking(true), children: "\xD6sszef\xE9s\xFCl\xE9s" })
    ] }),
    /* @__PURE__ */ jsxs(
      KiegDialog,
      {
        open: asking,
        onCancel: () => {
          if (!busy) setAsking(false);
        },
        title: "\xD6sszef\xE9s\xFCl\xF6d a rekordokat?",
        actions: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", "data-autofocus": true, disabled: busy, onClick: () => setAsking(false), children: "M\xE9gse" }),
          /* @__PURE__ */ jsx(Button, { variant: "danger", busy, onClick: () => void run(), children: "V\xE9gleges \xF6sszef\xE9s\xFCl\xE9s" })
        ] }),
        children: [
          /* @__PURE__ */ jsx("p", { children: consequence ?? `${survivorLabel ? `Megmarad: ${survivorLabel}. ` : ""}A t\xF6bbi rekord t\xF6rl\u0151dik, a v\xE1lasztott \xE9rt\xE9kek a megmarad\xF3ba ker\xFClnek. Ez nem vonhat\xF3 vissza.` }),
          err && /* @__PURE__ */ jsx("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx("p", { children: err }) })
        ]
      }
    )
  ] });
}

export {
  CompareMerge
};
