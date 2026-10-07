/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  formatNational,
  parsePhone,
  phoneInfo,
  phoneProblem,
  toE164,
  typedDigits
} from "./chunk-HTQWCXJG.js";
import {
  mergeRefs
} from "./chunk-2OVUAIP6.js";
import {
  FieldInput
} from "./chunk-AXT3NV5V.js";
import {
  Field
} from "./chunk-TUR5VE7W.js";

// react/src/kieg/PhoneField.tsx
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var RANGE = { barmely: "mobil: 9 sz\xE1mjegy \xB7 vezet\xE9kes: 8", mobil: "mobil: 20, 30, 31, 50, 70 + 7 sz\xE1mjegy", vezetekes: "vezet\xE9kes: 8 sz\xE1mjegy (Budapest: 1 + 7)" };
var KIND = { mobil: "mobilsz\xE1m", vezetekes: "vezet\xE9kes sz\xE1m", ismeretlen: "" };
var caretAfter = (text, n) => {
  if (n <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) if (/\d/.test(text[i]) && ++seen === n) return i + 1;
  return text.length;
};
var PhoneField = forwardRef(function PhoneField2({ label, help, range, error, notice, required, disabled, className, value, onChange, kind = "barmely", onBlur, onFocus, ...rest }, ref) {
  const inner = useRef(null);
  const [text, setText] = useState(() => formatNational(parsePhone(value).digits));
  const [note, setNote] = useState();
  const [touched, setTouched] = useState(false);
  const focused = useRef(false);
  const caret = useRef(null);
  useEffect(() => {
    if (!focused.current) setText(formatNational(parsePhone(value).digits));
  }, [value]);
  useLayoutEffect(() => {
    const el = inner.current;
    if (el && caret.current !== null && document.activeElement === el) el.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [text]);
  const digits = typedDigits(text).digits;
  const info = phoneInfo(digits);
  const apply = (d, digitsBeforeCaret, msg) => {
    const i0 = phoneInfo(d);
    let m = msg;
    if (d.length > i0.need) {
      d = d.slice(0, i0.need);
      m = m ?? `Legfeljebb ${i0.need} sz\xE1mjegy lehet \u2013 a t\xF6bbit nem \xEDrtam be.`;
    }
    const i = phoneInfo(d);
    const t = formatNational(d);
    caret.current = caretAfter(t, Math.min(digitsBeforeCaret, d.length));
    setText(t);
    setNote(m);
    onChange(toE164(i.digits), i);
  };
  const onKeyDown = (e) => {
    const el = e.currentTarget, s = el.selectionStart ?? 0;
    if (s !== el.selectionEnd) return;
    const back = e.key === "Backspace" && el.value[s - 1] === " ";
    const fwd = e.key === "Delete" && el.value[s] === " ";
    if (!back && !fwd) return;
    e.preventDefault();
    const raw = back ? el.value.slice(0, s - 2) + el.value.slice(s - 1) : el.value.slice(0, s + 1) + el.value.slice(s + 2);
    const before = (back ? el.value.slice(0, s - 2) : el.value.slice(0, s)).replace(/\D/g, "").length;
    apply(raw.replace(/\D/g, ""), before);
  };
  const onPaste = (e) => {
    e.preventDefault();
    const el = e.currentTarget;
    const clip = e.clipboardData.getData("text");
    const p = parsePhone(clip);
    if (p.foreign) {
      setNote("Csak magyar (+36) sz\xE1m adhat\xF3 meg \u2013 a beilleszt\xE9st kihagytam.");
      return;
    }
    const s = el.selectionStart ?? el.value.length, en = el.selectionEnd ?? s;
    const whole = /^\s*(\+|00|06)/.test(clip) || p.digits.length >= 8;
    const head = whole ? "" : el.value.slice(0, s).replace(/\D/g, "");
    const tail = whole ? "" : el.value.slice(en).replace(/\D/g, "");
    const d = head + p.digits + tail;
    const msg = p.cropped || d.length > phoneInfo(d).need ? `A beillesztett sz\xE1m v\xE9g\xE9t lev\xE1gtam: legfeljebb ${phoneInfo(d).need} sz\xE1mjegy lehet.` : p.letters ? "A beillesztett sz\xF6vegb\u0151l csak a sz\xE1mjegyeket tartottam meg." : void 0;
    apply(d, head.length + p.digits.length, msg);
  };
  const problem = touched ? required && !digits ? "Add meg a telefonsz\xE1mot \u2013 pl. 30 123 4567." : phoneProblem(info, kind) : void 0;
  const kindText = info.kind !== "ismeretlen" ? `${KIND[info.kind]} \xB7 ${info.need} sz\xE1mjegy` : RANGE[kind];
  return (
    // Az állapot (7/9) a tartomány-sorban: a teljes szám jó dolog, ezért nem kapja a számláló „határon” hibaszínét
    /* @__PURE__ */ jsx(
      Field,
      {
        label,
        help,
        range: `${range ?? kindText} \xB7 ${digits.length}/${info.need}${info.valid ? " \u2713" : ""}`,
        error: error ?? problem,
        notice: notice ?? note,
        required,
        disabled,
        className,
        children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs("div", { className: "bc-phone", children: [
          /* @__PURE__ */ jsx("span", { className: "bc-phone-cc", "aria-hidden": "true", children: "+36" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: mergeRefs(ref, inner),
              id: f.id,
              "aria-describedby": f.describedBy,
              "aria-invalid": f.invalid || void 0,
              className: "bc-input",
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel-national",
              placeholder: "30 123 4567",
              required,
              disabled,
              value: text,
              "aria-label": `${label} (+36 ut\xE1n)`,
              onFocus: (e) => {
                focused.current = true;
                onFocus?.(e);
              },
              onBlur: (e) => {
                focused.current = false;
                setTouched(true);
                onBlur?.(e);
              },
              onKeyDown,
              onPaste,
              onChange: (e) => {
                const raw = e.target.value, at = e.target.selectionStart ?? raw.length;
                const t = typedDigits(raw);
                apply(t.digits, typedDigits(raw.slice(0, at)).digits.length, t.letters ? "Csak sz\xE1mjegyet \xEDrhatsz be \u2013 a bet\u0171t kihagytam." : void 0);
              },
              ...rest
            }
          )
        ] }) })
      }
    )
  );
});

export {
  PhoneField
};
