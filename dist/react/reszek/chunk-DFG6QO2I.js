/* beeco design system 1.47.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  shake
} from "./chunk-IULI4MVX.js";
import {
  TextArea
} from "./chunk-5YEFLFGC.js";
import {
  Button
} from "./chunk-3RAKH2ZV.js";

// react/src/kieg2/RerollForm.tsx
import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function RerollForm({ previous, minLength, maxLength = 200, onConfirm, onCancel }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState();
  const form = useRef(null);
  const area = useRef(null);
  const submit = (e) => {
    e.preventDefault();
    const r = reason.trim();
    if (r.length < minLength) {
      setError(r.length === 0 ? `\xCDrd le r\xF6viden, mi\xE9rt sorsolsz \xFAjra (legal\xE1bb ${minLength} karakter) \u2013 a jegyz\u0151k\xF6nyvbe ker\xFCl.` : `Legal\xE1bb ${minLength} karakter kell \u2013 most ${r.length}. \xCDrj egy kicsit t\xF6bbet.`);
      shake(form.current);
      area.current?.focus();
      return;
    }
    onConfirm(r);
  };
  return /* @__PURE__ */ jsxs("form", { ref: form, className: "bc-draw-reroll", onSubmit: submit, noValidate: true, "aria-label": "\xDAjrasorsol\xE1s", children: [
    /* @__PURE__ */ jsxs("p", { className: "bc-draw-reroll-q", children: [
      "\xDAjrasorsol\xE1s \u2013 ",
      previous,
      " kimarad a k\xF6vetkez\u0151 h\xFAz\xE1sb\xF3l."
    ] }),
    /* @__PURE__ */ jsx(
      TextArea,
      {
        ref: area,
        label: "Az \xFAjrasorsol\xE1s oka",
        required: true,
        minLength,
        maxLength,
        rows: 2,
        value: reason,
        error,
        help: "Mi\xE9rt kell \xFAj nyertes? Pl. \u201ENem v\xE1laszolt 7 napig\u201D, \u201ELemondott a nyerem\xE9nyr\u0151l\u201D. A jegyz\u0151k\xF6nyvbe ker\xFCl, a nyertes nem l\xE1tja.",
        onChange: (e) => {
          setReason(e.target.value);
          if (error) setError(void 0);
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bc-draw-actions", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", children: "\xDAjrasorsolom" }),
      /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: onCancel, children: "M\xE9gse" })
    ] })
  ] });
}

export {
  RerollForm
};
