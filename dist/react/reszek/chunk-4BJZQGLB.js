/* beeco design system 1.47.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  CheckIcon,
  CopyIcon
} from "./chunk-I2TSS2M2.js";
import {
  Button,
  IconButton
} from "./chunk-EYUU5TDK.js";
import {
  cx
} from "./chunk-BM5TW7LS.js";

// react/src/kieg/CopyButton.tsx
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
function CopyButton({ value, what, variant = "button", showValue, disabled, className }) {
  const [state, setState] = useState("idle");
  const [msg, setMsg] = useState("");
  const fallback = useRef(null);
  const timer = useRef(void 0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (state === "failed") fallback.current?.select();
  }, [state]);
  const run = async () => {
    window.clearTimeout(timer.current);
    if (await copyText(value)) {
      setState("done");
      setMsg(`Kim\xE1soltam: ${what}.`);
      timer.current = window.setTimeout(() => setState("idle"), 1500);
    } else {
      setState("failed");
      setMsg(`Nem siker\xFClt a m\xE1sol\xE1s (${what}) \u2013 jel\xF6ld ki, \xE9s m\xE1sold k\xE9zzel.`);
    }
  };
  const done = state === "done";
  const icon = done ? /* @__PURE__ */ jsx("span", { className: "bc-anim-tick bc-copy-tick", children: /* @__PURE__ */ jsx(CheckIcon, {}) }) : /* @__PURE__ */ jsx(CopyIcon, {});
  return /* @__PURE__ */ jsxs("span", { className: cx("bc-copy", className), "data-state": state, children: [
    showValue && /* @__PURE__ */ jsx("code", { className: "bc-copy-value", children: value }),
    variant === "icon" ? /* @__PURE__ */ jsx(IconButton, { "aria-label": done ? `M\xE1solva: ${what}` : `M\xE1sol\xE1s: ${what}`, onClick: run, disabled, children: icon }) : /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", icon, onClick: run, disabled, "aria-label": `${done ? "M\xE1solva" : "M\xE1sol\xE1s"}: ${what}`, children: done ? "M\xE1solva" : "M\xE1sol\xE1s" }),
    /* @__PURE__ */ jsx("span", { className: "bc-sr", role: "status", children: msg }),
    state === "failed" && /* @__PURE__ */ jsxs("span", { className: "bc-copy-fallback", children: [
      /* @__PURE__ */ jsx("input", { ref: fallback, className: "bc-input", readOnly: true, value, "aria-label": `${what} \u2013 jel\xF6ld ki \xE9s m\xE1sold`, onFocus: (e) => e.currentTarget.select() }),
      /* @__PURE__ */ jsx("span", { className: "bc-error", children: "Nem siker\xFClt a m\xE1sol\xE1s. Jel\xF6ld ki, \xE9s m\xE1sold: Ctrl+C (Macen \u2318C), telefonon hosszan nyomva." })
    ] })
  ] });
}

export {
  copyText,
  CopyButton
};
