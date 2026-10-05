/* beeco design system 1.42.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  say
} from "./chunk-ZDRRSBPO.js";
import {
  HexLoader,
  ProgressBar
} from "./chunk-DKBMMSDR.js";
import {
  CheckIcon,
  DownloadIcon,
  RetryIcon
} from "./chunk-J4CMSMSG.js";
import {
  formatHu
} from "./chunk-TCIED7PA.js";
import {
  Button
} from "./chunk-6VNFKTEP.js";
import {
  cx
} from "./chunk-ULBUX4AD.js";

// react/src/kieg/DownloadButton.tsx
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${formatHu(n / 1024, 1)} KB`;
  return `${formatHu(n / 1024 / 1024, 1)} MB`;
}
function save(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function DownloadButton({ label, fileName, sizeHint, onDownload, variant = "secondary", disabled, className }) {
  const [state, setState] = useState("idle");
  const [progress, setProgress] = useState(null);
  const [size, setSize] = useState(null);
  const [slow, setSlow] = useState(false);
  const [stopped, setStopped] = useState(false);
  const ctrl = useRef(null);
  useEffect(() => () => ctrl.current?.abort(), []);
  useEffect(() => {
    if (state !== "busy") return;
    const t = window.setTimeout(() => setSlow(true), 1e4);
    return () => window.clearTimeout(t);
  }, [state]);
  const run = async () => {
    if (state === "busy") return;
    const c = new AbortController();
    ctrl.current = c;
    setState("busy");
    setProgress(null);
    setSlow(false);
    setStopped(false);
    try {
      const blob = await onDownload({ progress: (v) => !c.signal.aborted && setProgress(Math.max(0, Math.min(1, v))), signal: c.signal });
      if (c.signal.aborted) return;
      if (blob) {
        save(blob, fileName);
        setSize(blob.size);
      } else setSize(null);
      setState("done");
    } catch {
      if (!c.signal.aborted) setState("error");
    }
  };
  const cancel = () => {
    ctrl.current?.abort();
    setState("idle");
    setStopped(true);
  };
  const pct = progress === null ? null : Math.round(progress * 100);
  const text = state === "busy" ? "K\xE9sz\xFCl" : state === "done" ? "Let\xF6ltve" : state === "error" ? "\xDAjra" : label;
  const icon = state === "done" ? /* @__PURE__ */ jsx("span", { className: "bc-anim-tick bc-copy-tick", children: /* @__PURE__ */ jsx(CheckIcon, {}) }) : state === "error" ? /* @__PURE__ */ jsx(RetryIcon, {}) : /* @__PURE__ */ jsx(DownloadIcon, {});
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-download", className), "data-state": state, children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-row", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          variant,
          icon,
          busy: state === "busy",
          disabled,
          onClick: run,
          "aria-label": `${text}: ${fileName}`,
          children: text
        }
      ),
      state === "busy" && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: cancel, children: "Megszak\xEDt\xE1s" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bc-download-meta", role: "status", children: [
      state === "idle" && /* @__PURE__ */ jsxs("span", { children: [
        fileName,
        sizeHint ? ` \xB7 ${sizeHint}` : "",
        stopped ? " \xB7 megszak\xEDtottad, b\xE1rmikor \xFAjrakezdheted" : ""
      ] }),
      state === "busy" && /* @__PURE__ */ jsxs(Fragment, { children: [
        pct === null ? /* @__PURE__ */ jsx(HexLoader, { label: `K\xE9sz\xFCl: ${fileName}` }) : /* @__PURE__ */ jsx(ProgressBar, { value: progress ?? 0, label: `K\xE9sz\xFCl: ${fileName}`, moving: true }),
        /* @__PURE__ */ jsxs("span", { children: [
          "K\xE9sz\xFCl: ",
          fileName,
          pct === null ? "\u2026" : ` \xB7 ${pct}%`
        ] }),
        slow && /* @__PURE__ */ jsx("span", { className: "bc-download-slow", children: say("toltes-hosszu").sima })
      ] }),
      state === "done" && /* @__PURE__ */ jsxs("span", { children: [
        "Let\xF6ltve: ",
        fileName,
        size !== null ? ` \xB7 ${formatBytes(size)}` : ""
      ] }),
      state === "error" && /* @__PURE__ */ jsxs("span", { className: "bc-error", role: "alert", children: [
        "Nem siker\xFClt elk\xE9sz\xEDteni a f\xE1jlt (",
        fileName,
        "). Ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra."
      ] })
    ] })
  ] });
}

export {
  formatBytes,
  DownloadButton
};
