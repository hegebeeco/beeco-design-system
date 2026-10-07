/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  ConfirmDialog
} from "./chunk-CKJ7TVFR.js";
import {
  TextField
} from "./chunk-WBMML2HB.js";
import {
  norm
} from "./chunk-RRIC23XG.js";
import {
  Button
} from "./chunk-E5CUZH7I.js";

// react/src/reteg/TypeToConfirm.tsx
import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var same = (a, b, isCount) => isCount ? a.replace(/\s/g, "") === b : norm(a.trim().replace(/\s+/g, " ")) === norm(b.trim().replace(/\s+/g, " "));
function TypeToConfirm({ count, name, prompt, impactLoading, impactError, onRetry, open, onOpenChange, ...rest }) {
  const [typed, setTyped] = useState("");
  const input = useRef(null);
  const isCount = count !== void 0;
  const expected = isCount ? String(count) : name ?? "";
  const match = expected !== "" && same(typed, expected, isCount);
  const label = prompt ?? (isCount ? "\xCDrd be a t\xF6rlend\u0151 elemek sz\xE1m\xE1t" : "\xCDrd be a nev\xE9t");
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      size: "md",
      ...rest,
      open,
      danger: true,
      onOpenChange: (o) => {
        if (!o) setTyped("");
        onOpenChange(o);
      },
      confirmDisabled: !match || impactLoading || Boolean(impactError),
      initialFocus: () => input.current,
      extra: /* @__PURE__ */ jsxs("div", { className: "bc-stack", children: [
        impactLoading && /* @__PURE__ */ jsxs("p", { className: "bc-muted", role: "status", children: [
          /* @__PURE__ */ jsx("span", { className: "bc-spinner", "aria-hidden": "true" }),
          " \xD6sszeszedem, mi t\xF6rl\u0151dik m\xE9g vele\u2026"
        ] }),
        impactError && /* @__PURE__ */ jsxs("div", { className: "bc-alert is-danger", role: "alert", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            impactError,
            " Am\xEDg nem l\xE1tod, mi t\xF6rl\u0151dik vele, nem t\xF6r\xF6lhetsz."
          ] }),
          onRetry && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
        ] }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            ref: input,
            label,
            inputMode: isCount ? "numeric" : "text",
            autoComplete: "off",
            spellCheck: false,
            help: "\xCDgy ellen\u0151rizz\xFCk, hogy t\xE9nyleg ezt akarod. A v\xE9gleges t\xF6rl\xE9s nem vonhat\xF3 vissza.",
            range: `Ezt \xEDrd be: ${expected}`,
            value: typed,
            onChange: (e) => setTyped(e.target.value),
            notice: match ? "Egyezik \u2013 most m\xE1r t\xF6r\xF6lhetsz." : void 0
          }
        )
      ] })
    }
  );
}

export {
  TypeToConfirm
};
