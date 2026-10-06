/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  BeeMoment
} from "./chunk-TEKE2TRB.js";
import {
  say
} from "./chunk-X3B7G27H.js";
import {
  Button
} from "./chunk-CVRNQZIF.js";
import {
  cx
} from "./chunk-PG2ADDWU.js";

// react/src/kieg/OfflineBanner.tsx
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function useOnline() {
  const [on, setOn] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  useEffect(() => {
    const up = () => setOn(true), down = () => setOn(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    setOn(navigator.onLine);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return on;
}
function OfflineBanner({ online, pending = 0, saveText, onRetry, bee = true, backMs = 2500, className }) {
  const browser = useOnline();
  const on = online ?? browser;
  const [back, setBack] = useState(false);
  const was = useRef(on);
  useEffect(() => {
    if (on && !was.current) {
      setBack(true);
      const t = window.setTimeout(() => setBack(false), backMs);
      was.current = on;
      return () => window.clearTimeout(t);
    }
    if (!on) setBack(false);
    was.current = on;
  }, [on, backMs]);
  const sima = saveText ?? say("offline").sima;
  const waiting = pending > 0 ? `${pending} m\xF3dos\xEDt\xE1s v\xE1r ment\xE9sre.` : null;
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-offline", className), role: "status", "data-state": on ? back ? "back" : "online" : "offline", children: [
    !on && /* @__PURE__ */ jsxs("div", { className: "bc-alert is-warning bc-offline-bar", children: [
      bee ? /* @__PURE__ */ jsx(BeeMoment, { pillanat: "offline", inline: true, sima: /* @__PURE__ */ jsxs(Fragment, { children: [
        sima,
        " ",
        waiting
      ] }) }) : /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsx("strong", { children: "Nincs internetkapcsolat." }),
        " ",
        sima,
        " ",
        waiting
      ] }),
      onRetry && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: onRetry, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
    ] }),
    on && back && /* @__PURE__ */ jsx("div", { className: "bc-alert is-success bc-offline-bar bc-anim-rise", children: /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("strong", { children: "\xDAjra van kapcsolat." }),
      " ",
      pending > 0 ? "Mentj\xFCk a v\xE1rakoz\xF3 m\xF3dos\xEDt\xE1sokat." : "Minden a hely\xE9n."
    ] }) })
  ] });
}

export {
  useOnline,
  OfflineBanner
};
