/* beeco design system 1.51.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Progress,
  Stepper,
  stepsFrom
} from "./chunk-XGEJ27VZ.js";
import {
  checkFiles,
  errorText,
  isAbort,
  sizePair
} from "./chunk-6XDZVDWZ.js";
import {
  IcFile
} from "./chunk-LGGDWQQM.js";
import {
  FieldInput
} from "./chunk-R3M3HYHK.js";
import {
  Field
} from "./chunk-M4KE4BK6.js";
import {
  formatHu
} from "./chunk-HDFSCYBK.js";
import {
  Button
} from "./chunk-RRMQQIT4.js";

// react/src/media/VideoUpload.tsx
import { useEffect, useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var STEPS = [{ id: "file", label: "F\xE1jl" }, { id: "up", label: "Felt\xF6lt\xE9s" }, { id: "proc", label: "Feldolgoz\xE1s" }, { id: "done", label: "K\xE9sz" }];
function VideoUpload({ label, help, upload, process, onDone, maxSizeMB = 25, disabled }) {
  const [phase, setPhase] = useState("file");
  const [file, setFile] = useState(null);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(null);
  const [rej, setRej] = useState(null);
  const [eta, setEta] = useState();
  const ctrl = useRef(null);
  const rejId = useId();
  useEffect(() => {
    if (phase !== "up") return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [phase]);
  useEffect(() => () => ctrl.current?.abort(), []);
  const runProcess = async (f) => {
    setPhase("proc");
    setFailed(null);
    try {
      await process?.();
      setPhase("done");
      onDone?.(f);
    } catch (e) {
      setFailed(`${errorText(e)} A vide\xF3 fent van, csak a feldolgoz\xE1st kell \xFAjrakezdeni.`);
    }
  };
  const runUpload = async (f) => {
    setPhase("up");
    setLoaded(0);
    setFailed(null);
    setEta(void 0);
    const c = new AbortController();
    ctrl.current = c;
    const t0 = performance.now();
    try {
      await upload(f, { signal: c.signal, onProgress: (n) => {
        setLoaded(n);
        const rate = n / Math.max(1, performance.now() - t0);
        if (n > 0 && rate > 0) setEta(`kb. ${Math.max(1, Math.round((f.size - n) / rate / 1e3))} mp van h\xE1tra`);
      } });
      await runProcess(f);
    } catch (e) {
      if (isAbort(e)) {
        setPhase("file");
        setFile(null);
        setRej({ file: f.name, reason: "a felt\xF6lt\xE9st megszak\xEDtottad", next: "Ha m\xE9gis kell, v\xE1laszd ki \xFAjra." });
        return;
      }
      setFailed(errorText(e));
    }
  };
  const pick = async (list) => {
    if (!list?.length) return;
    const r = await checkFiles([list[0]], {
      accept: ["video/mp4"],
      maxSizeMB,
      unit: "vide\xF3",
      typeHint: "Alak\xEDtsd \xE1t MP4-re (pl. egy vide\xF3szerkeszt\u0151vel vagy a telefon exportj\xE1val), \xE9s t\xF6ltsd fel \xFAjra.",
      sizeHint: "R\xF6vid\xEDtsd vagy t\xF6m\xF6r\xEDtsd a vide\xF3t, \xE9s pr\xF3b\xE1ld \xFAjra.",
      unreadable: { reason: "ezt a vide\xF3t nem tudjuk beolvasni", next: "Pr\xF3b\xE1ld \xFAjra export\xE1lni MP4-k\xE9nt." }
    });
    setRej(r.rejected[0] ?? null);
    if (r.ok[0]) {
      setFile(r.ok[0]);
      void runUpload(r.ok[0]);
    }
  };
  const reset = () => {
    setPhase("file");
    setFile(null);
    setFailed(null);
    setRej(null);
    setLoaded(0);
  };
  const cur = { file: 0, up: 1, proc: 2, done: 3 }[phase];
  const sizeText = file ? sizePair(loaded, file.size) : "";
  return /* @__PURE__ */ jsxs("div", { className: "bc-video", children: [
    /* @__PURE__ */ jsx(Stepper, { label: "A vide\xF3felt\xF6lt\xE9s l\xE9p\xE9sei", steps: stepsFrom(STEPS, phase === "done" ? 4 : cur, Boolean(failed)) }),
    /* @__PURE__ */ jsx(
      Field,
      {
        label,
        help,
        disabled,
        range: `MP4 \xB7 legfeljebb ${formatHu(maxSizeMB, 1)} MB \xB7 1 vide\xF3`,
        count: { value: file && phase !== "file" ? 1 : 0, max: 1, unit: "vide\xF3" },
        children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => phase === "file" ? /* @__PURE__ */ jsxs("label", { className: "bc-dropzone", onDragOver: (e) => {
          if (!disabled) e.preventDefault();
        }, onDrop: (e) => {
          e.preventDefault();
          if (!disabled) void pick(e.dataTransfer.files);
        }, children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: f.id,
              type: "file",
              accept: "video/mp4",
              className: "bc-upload-input",
              disabled,
              "aria-describedby": [f.describedBy, rej && rejId].filter(Boolean).join(" ") || void 0,
              "aria-invalid": rej ? true : void 0,
              onChange: (e) => {
                void pick(e.currentTarget.files);
                e.currentTarget.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsx(IcFile, {}),
          /* @__PURE__ */ jsx("strong", { children: "Vide\xF3 kiv\xE1laszt\xE1sa" }),
          /* @__PURE__ */ jsx("span", { children: "vagy h\xFAzd ide a f\xE1jlt" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "bc-filecard", "aria-busy": phase === "up" || phase === "proc", children: [
          /* @__PURE__ */ jsxs("div", { className: "bc-filecard-row", children: [
            /* @__PURE__ */ jsx("b", { children: file?.name }),
            /* @__PURE__ */ jsx("span", { className: "bc-filecard-size", children: sizeText })
          ] }),
          phase === "up" && /* @__PURE__ */ jsx(Progress, { value: loaded, max: file?.size ?? 1, label: `${file?.name} felt\xF6lt\xE9se`, valueText: sizeText }),
          /* @__PURE__ */ jsxs("div", { className: "bc-filecard-row", role: "status", children: [
            /* @__PURE__ */ jsx("span", { children: failed ? /* @__PURE__ */ jsx("span", { className: "bc-error", children: failed }) : phase === "up" ? `${Math.round(loaded / (file?.size || 1) * 100)}%${eta ? ` \xB7 ${eta}` : ""}` : phase === "proc" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "bc-spinner", "aria-hidden": "true" }),
              " Feldolgoz\xE1s\u2026 ez eltarthat p\xE1r percig."
            ] }) : "K\xE9sz \u2013 a vide\xF3 fent van." }),
            /* @__PURE__ */ jsxs("span", { className: "bc-row", children: [
              phase === "up" && !failed && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => ctrl.current?.abort(), children: "Megszak\xEDt\xE1s" }),
              failed && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => file && (phase === "proc" ? void runProcess(file) : void runUpload(file)), children: "\xDAjrapr\xF3b\xE1l\xE1s" }),
              (failed || phase === "done") && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: reset, children: phase === "done" ? "M\xE1sik vide\xF3" : "M\xE9gse" })
            ] })
          ] })
        ] }) })
      }
    ),
    rej && /* @__PURE__ */ jsxs("p", { className: "bc-error", id: rejId, role: "alert", children: [
      /* @__PURE__ */ jsx("b", { children: rej.file }),
      " \u2013 ",
      rej.reason,
      ". ",
      rej.next
    ] })
  ] });
}

export {
  VideoUpload
};
