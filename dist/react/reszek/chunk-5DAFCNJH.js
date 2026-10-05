/* beeco design system 1.44.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  shake
} from "./chunk-BJZ2IGIO.js";
import {
  RadioGroup
} from "./chunk-YYTTRAIJ.js";
import {
  TextArea
} from "./chunk-ZCABWFQ6.js";
import {
  Button
} from "./chunk-OH6YOEFY.js";

// react/src/kieg/ReviewReject.tsx
import { useEffect, useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var MIN = 10;
var MAX = 300;
function ReviewReject({ reasons = [], busy, onSubmit, onCancel }) {
  const uid = useId();
  const [preset, setPreset] = useState();
  const [text, setText] = useState("");
  const [err, setErr] = useState();
  const box = useRef(null);
  useEffect(() => {
    box.current?.querySelector("input[type=radio], textarea")?.focus();
  }, []);
  const submit = () => {
    if (busy) return;
    const t = text.trim();
    if (!preset && t.length < MIN) {
      setErr(reasons.length ? `V\xE1lassz okot, vagy \xEDrd le legal\xE1bb ${MIN} karakterben \u2013 a bek\xFCld\u0151 ebb\u0151l tudja, mit jav\xEDtson.` : `\xCDrd le legal\xE1bb ${MIN} karakterben, mi\xE9rt utas\xEDtod el \u2013 most ${t.length}.`);
      shake(box.current);
      return;
    }
    onSubmit(preset ? t ? `${preset}: ${t}` : preset : t);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: box,
      className: "bc-review-reject bc-anim-rise",
      role: "group",
      "aria-label": "Elutas\xEDt\xE1s indokkal",
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onCancel();
        }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          submit();
        }
      },
      children: [
        reasons.length > 0 && /* @__PURE__ */ jsx(
          RadioGroup,
          {
            label: "Mi\xE9rt utas\xEDtod el?",
            name: `${uid}-ok`,
            value: preset ?? "",
            onChange: (v) => {
              setPreset(v);
              setErr(void 0);
            },
            help: "A v\xE1lasztott ok a bek\xFCld\u0151h\xF6z \xE9s a napl\xF3ba ker\xFCl. Ha egyik sem illik, \xEDrd le saj\xE1t szavaiddal lent.",
            options: reasons.map((r) => ({ value: r, label: r }))
          }
        ),
        /* @__PURE__ */ jsx(
          TextArea,
          {
            label: reasons.length ? "Kieg\xE9sz\xEDt\xE9s (ha egyik ok sem illik: k\xF6telez\u0151)" : "Indokl\xE1s",
            rows: 3,
            maxLength: MAX,
            help: "P\xE1r sz\xF3 arr\xF3l, mi a baj \xE9s mit kellene jav\xEDtani. Ez a napl\xF3ba ker\xFCl, \xE9s a bek\xFCld\u0151 is l\xE1tja.",
            range: reasons.length ? `ok v\xE1laszt\xE1s\xE1val nem k\xF6telez\u0151 \xB7 k\xFCl\xF6nben ${MIN}\u2013${MAX} karakter` : `${MIN}\u2013${MAX} karakter`,
            value: text,
            error: err,
            required: !preset,
            onChange: (e) => {
              setText(e.target.value);
              if (err) setErr(void 0);
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "bc-row is-end", children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: onCancel, disabled: busy, children: "M\xE9gse (Esc)" }),
          /* @__PURE__ */ jsx(Button, { variant: "danger", size: "sm", busy, onClick: submit, children: "Elutas\xEDt\xE1s" })
        ] })
      ]
    }
  );
}

export {
  ReviewReject
};
