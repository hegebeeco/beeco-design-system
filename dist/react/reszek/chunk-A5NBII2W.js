/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  AudienceRuleRow
} from "./chunk-SE77THLS.js";
import {
  audienceProblems,
  describeAudience,
  newRule
} from "./chunk-NFGOYOYH.js";
import {
  HexLoader
} from "./chunk-T2RTDYPW.js";
import {
  PlusIcon
} from "./chunk-AA4EKKTM.js";
import {
  SegmentedControl
} from "./chunk-TXDG274V.js";
import {
  HelpButton
} from "./chunk-UT76A3TH.js";
import {
  formatHu
} from "./chunk-IG2VMPIK.js";
import {
  Button
} from "./chunk-Z655PA3P.js";
import {
  cx
} from "./chunk-4NETF2NE.js";

// react/src/kieg/AudienceBuilder.tsx
import { Fragment, useEffect, useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function AudienceBuilder({
  fields,
  value,
  onChange,
  estimate,
  maxRules = 10,
  showErrors,
  label = "C\xE9lcsoport",
  help = "Kik kapj\xE1k meg az \xFCzenetet. Felt\xE9tel n\xE9lk\xFCl mindenki; minden felt\xE9tel sz\u0171k\xEDt (\xC9S) vagy b\u0151v\xEDt (VAGY). A l\xE9tsz\xE1m becsl\xE9s \u2013 a k\xFCld\xE9s pillanat\xE1ban elt\xE9rhet.",
  disabled,
  className
}) {
  const uid = useId();
  const [touched, setTouched] = useState(() => /* @__PURE__ */ new Set());
  const focusRule = useRef(null);
  const addBtn = useRef(null);
  const root = useRef(null);
  const problems = audienceProblems(value, fields);
  const bad = Object.keys(problems).length;
  const full = value.rules.length >= maxRules;
  useEffect(() => {
    if (!focusRule.current) return;
    root.current?.querySelector(`[data-rule="${focusRule.current}"] select`)?.focus();
    focusRule.current = null;
  });
  const add = () => {
    if (full) return;
    const r = newRule();
    focusRule.current = r.id;
    onChange({ ...value, rules: [...value.rules, r] });
  };
  const remove = (id) => {
    onChange({ ...value, rules: value.rules.filter((r) => r.id !== id) });
    addBtn.current?.focus();
  };
  return /* @__PURE__ */ jsxs("fieldset", { ref: root, className: cx("bc-aud", className), disabled, "aria-labelledby": `${uid}-l`, children: [
    /* @__PURE__ */ jsxs("legend", { className: "bc-label-row bc-aud-legend", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-label", id: `${uid}-l`, children: label }),
      /* @__PURE__ */ jsx(HelpButton, { label, children: help })
    ] }),
    value.rules.length >= 2 && /* @__PURE__ */ jsxs("div", { className: "bc-aud-join", children: [
      /* @__PURE__ */ jsxs("span", { className: "bc-aud-join-label", children: [
        "Kik kapj\xE1k meg? ",
        /* @__PURE__ */ jsx("span", { className: "bc-muted", children: "\xC9S: akikre minden felt\xE9tel igaz \xB7 VAGY: akikre legal\xE1bb egy." })
      ] }),
      /* @__PURE__ */ jsx(
        SegmentedControl,
        {
          label: "A felt\xE9telek kapcsolata",
          value: value.join,
          onChange: (join) => onChange({ ...value, join }),
          items: [{ value: "and", label: "\xC9S" }, { value: "or", label: "VAGY" }]
        }
      )
    ] }),
    value.rules.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bc-alert is-info", children: /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("strong", { children: "Nincs felt\xE9tel:" }),
      " az \xFCzenetet mindenki megkapja. Sz\u0171k\xEDt\xE9shez adj hozz\xE1 felt\xE9telt."
    ] }) }) : /* @__PURE__ */ jsx("ol", { className: "bc-aud-rules", children: value.rules.map((r, i) => /* @__PURE__ */ jsxs(Fragment, { children: [
      i > 0 && /* @__PURE__ */ jsx("li", { className: "bc-aud-joiner", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "bc-badge is-muted", children: value.join === "and" ? "\xC9S" : "VAGY" }) }),
      /* @__PURE__ */ jsx(
        AudienceRuleRow,
        {
          rule: r,
          n: i + 1,
          fields,
          disabled,
          error: showErrors || touched.has(r.id) ? problems[r.id] : void 0,
          onBlur: () => setTouched((t) => t.has(r.id) ? t : new Set(t).add(r.id)),
          onChange: (nr) => onChange({ ...value, rules: value.rules.map((x) => x.id === r.id ? nr : x) }),
          onRemove: () => remove(r.id)
        }
      )
    ] }, r.id)) }),
    /* @__PURE__ */ jsxs("div", { className: "bc-row bc-aud-add", children: [
      /* @__PURE__ */ jsx(Button, { ref: addBtn, variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx(PlusIcon, {}), onClick: add, disabled: full || disabled, children: "Felt\xE9tel hozz\xE1ad\xE1sa" }),
      /* @__PURE__ */ jsxs("span", { className: cx("bc-count", full ? "is-full" : value.rules.length >= maxRules * 0.9 && "is-near"), children: [
        value.rules.length,
        "/",
        maxRules,
        " felt\xE9tel",
        full ? " \u2013 el\xE9rted a hat\xE1rt" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-aud-estimate", role: "status", "aria-live": "polite", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-aud-estimate-label", children: "Becs\xFClt c\xEDmzettek" }),
      estimate?.loading ? /* @__PURE__ */ jsxs("span", { className: "bc-row", children: [
        /* @__PURE__ */ jsx(HexLoader, { label: "Sz\xE1moljuk a c\xEDmzetteket" }),
        " Sz\xE1moljuk\u2026"
      ] }) : estimate?.error ? /* @__PURE__ */ jsx("span", { className: "bc-error", children: estimate.error }) : /* @__PURE__ */ jsx("strong", { className: "bc-num bc-aud-count", children: estimate?.count == null ? "\u2013" : `${formatHu(estimate.count, 0)} f\u0151` }),
      /* @__PURE__ */ jsxs("span", { className: "bc-aud-summary", children: [
        "Kik: ",
        describeAudience(value, fields)
      ] }),
      bad > 0 && /* @__PURE__ */ jsxs("span", { className: "bc-aud-warn", children: [
        bad,
        " hib\xE1s felt\xE9tel kimaradt a becsl\xE9sb\u0151l \u2013 jav\xEDtsd vagy t\xF6r\xF6ld."
      ] })
    ] })
  ] });
}

export {
  AudienceBuilder
};
