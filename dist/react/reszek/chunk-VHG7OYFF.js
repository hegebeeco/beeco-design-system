/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Progress
} from "./chunk-7RS46X7G.js";
import {
  ImportResult
} from "./chunk-CEDUHWUD.js";
import {
  checkFiles,
  errorText,
  fileKey,
  isAbort,
  sizePair
} from "./chunk-FRIE5ONO.js";
import {
  IcFile
} from "./chunk-YFTXXZ6K.js";
import {
  Field
} from "./chunk-U5OFI6TE.js";
import {
  FieldInput
} from "./chunk-B6IOV2EK.js";
import {
  formatHu
} from "./chunk-ODKPT4AU.js";
import {
  Button
} from "./chunk-ERIU5VPQ.js";

// react/src/media/FileImport.tsx
import { useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
var XLS = "application/vnd.ms-excel";
function FileImport({ label, help, importFile, maxSizeMB = 10, allowXls = true, template, disabled }) {
  const [file, setFile] = useState(null);
  const [loaded, setLoaded] = useState(0);
  const [result, setResult] = useState(null);
  const [rej, setRej] = useState(null);
  const [failed, setFailed] = useState(null);
  const ctrl = useRef(null);
  const lastKey = useRef(null);
  const [dup, setDup] = useState(null);
  const rejId = useId();
  const accept = allowXls ? [XLSX, XLS] : [XLSX];
  const busy = Boolean(file) && !result && !failed;
  const run = async (f) => {
    setFile(f);
    setLoaded(0);
    setResult(null);
    setFailed(null);
    setDup(null);
    lastKey.current = fileKey(f);
    const c = new AbortController();
    ctrl.current = c;
    try {
      setResult(await importFile(f, { signal: c.signal, onProgress: setLoaded }));
    } catch (e) {
      if (isAbort(e)) {
        setFile(null);
        setRej({ file: f.name, reason: "az importot megszak\xEDtottad", next: "Semmi nem ker\xFClt be. Ha kell, kezdd \xFAjra." });
        return;
      }
      setFailed(errorText(e));
    }
  };
  const pick = async (list) => {
    if (!list?.length) return;
    const r = await checkFiles([list[0]], {
      accept,
      maxSizeMB,
      unit: "f\xE1jl",
      typeHint: "Nyisd meg az Excelben, \xE9s mentsd el \u201EExcel-munkaf\xFCzet (.xlsx)\u201D form\xE1tumban \u2013 a CSV \xE9s a Numbers nem j\xF3.",
      sizeHint: "Bontsd k\xE9t f\xE1jlra (pl. 5 000 soronk\xE9nt), \xE9s t\xF6ltsd fel egym\xE1s ut\xE1n."
    });
    setRej(r.rejected[0] ?? null);
    if (r.ok[0] && fileKey(r.ok[0]) === lastKey.current) {
      setFile(null);
      setResult(null);
      setDup(r.ok[0]);
      return;
    }
    if (r.ok[0]) void run(r.ok[0]);
  };
  const reset = () => {
    setFile(null);
    setResult(null);
    setFailed(null);
    setRej(null);
  };
  const sizeText = file ? sizePair(loaded, file.size) : "";
  return /* @__PURE__ */ jsxs("div", { className: "bc-import", children: [
    /* @__PURE__ */ jsx(
      Field,
      {
        label,
        help,
        disabled,
        range: `${allowXls ? ".xlsx vagy .xls" : ".xlsx"} \xB7 legfeljebb ${formatHu(maxSizeMB, 1)} MB \xB7 1 f\xE1jl`,
        count: { value: file ? 1 : 0, max: 1, unit: "f\xE1jl" },
        children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => !file ? /* @__PURE__ */ jsxs("label", { className: "bc-dropzone", onDragOver: (e) => {
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
              className: "bc-upload-input",
              disabled,
              accept: `.xlsx${allowXls ? ",.xls" : ""},${accept.join(",")}`,
              "aria-describedby": [f.describedBy, rej && rejId].filter(Boolean).join(" ") || void 0,
              "aria-invalid": rej ? true : void 0,
              onChange: (e) => {
                void pick(e.currentTarget.files);
                e.currentTarget.value = "";
              }
            }
          ),
          /* @__PURE__ */ jsx(IcFile, {}),
          /* @__PURE__ */ jsx("strong", { children: "Excel-f\xE1jl kiv\xE1laszt\xE1sa" }),
          /* @__PURE__ */ jsx("span", { children: "vagy h\xFAzd ide" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "bc-filecard", "aria-busy": busy, children: [
          /* @__PURE__ */ jsxs("div", { className: "bc-filecard-row", children: [
            /* @__PURE__ */ jsx("b", { children: file.name }),
            /* @__PURE__ */ jsx("span", { className: "bc-filecard-size", children: sizeText })
          ] }),
          busy && /* @__PURE__ */ jsx(Progress, { value: loaded, max: file.size, label: `${file.name} import\xE1l\xE1sa`, valueText: sizeText }),
          /* @__PURE__ */ jsxs("div", { className: "bc-filecard-row", role: "status", children: [
            /* @__PURE__ */ jsx("span", { children: failed ? /* @__PURE__ */ jsx("span", { className: "bc-error", children: failed }) : busy ? loaded >= file.size ? "Feldolgoz\xE1s \u2013 a sorokat ellen\u0151rz\xF6m\u2026" : "Felt\xF6lt\xE9s\u2026" : "K\xE9sz." }),
            /* @__PURE__ */ jsxs("span", { className: "bc-row", children: [
              busy && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => ctrl.current?.abort(), children: "Megszak\xEDt\xE1s" }),
              failed && /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => void run(file), children: "\xDAjrapr\xF3b\xE1l\xE1s" }),
              !busy && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: reset, children: "M\xE1sik f\xE1jl" })
            ] })
          ] })
        ] }) })
      }
    ),
    dup && /* @__PURE__ */ jsx("div", { className: "bc-alert is-warning", role: "alert", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { children: [
        /* @__PURE__ */ jsxs("strong", { children: [
          "Ezt a f\xE1jlt (",
          dup.name,
          ") az im\xE9nt m\xE1r import\xE1ltad."
        ] }),
        " Ha \xFAjra bek\xFCld\xF6d, a sorok k\xE9tszer ker\xFClhetnek be."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bc-row", children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => void run(dup), children: "M\xE9gis import\xE1lom" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setDup(null), children: "M\xE9gse" })
      ] })
    ] }) }),
    rej && /* @__PURE__ */ jsxs("p", { className: "bc-error", id: rejId, role: "alert", children: [
      /* @__PURE__ */ jsx("b", { children: rej.file }),
      " \u2013 ",
      rej.reason,
      ". ",
      rej.next
    ] }),
    template && !file && /* @__PURE__ */ jsxs("p", { className: "bc-help", children: [
      /* @__PURE__ */ jsx("a", { href: template.href, download: true, children: template.label ?? "Sablon let\xF6lt\xE9se (.xlsx)" }),
      " \u2013 ebbe \xEDrd az adatokat, a fejl\xE9cet ne m\xF3dos\xEDtsd."
    ] }),
    result && /* @__PURE__ */ jsx(ImportResult, { result, fileName: `${file?.name.replace(/\.[^.]+$/, "") ?? "import"}-hibalista.csv` })
  ] });
}

export {
  FileImport
};
