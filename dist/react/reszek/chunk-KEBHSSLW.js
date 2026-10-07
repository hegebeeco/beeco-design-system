/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  checkFiles,
  mbText
} from "./chunk-QCEK6ZQX.js";
import {
  IcFile
} from "./chunk-T4T6BK53.js";
import {
  Field
} from "./chunk-K4WGO4RX.js";
import {
  FieldInput
} from "./chunk-5M3UQKCL.js";
import {
  formatHu
} from "./chunk-4BN3XTQS.js";
import {
  Button
} from "./chunk-FYLKJ6X5.js";

// react/src/media/FilePicker.tsx
import { useId, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var MB = 1024 * 1024;
var fileSizeText = (bytes) => bytes < 0.1 * MB ? `${formatHu(Math.max(1, Math.round(bytes / 1024)), 0)} kB` : `${mbText(bytes)} MB`;
function FilePicker({
  label,
  help,
  value,
  onChange,
  accept,
  acceptAttr,
  maxSizeMB,
  warnSizeMB,
  formatText,
  typeHint,
  sizeHint,
  error,
  required,
  disabled,
  busy
}) {
  const [rej, setRej] = useState(null);
  const rejId = useId();
  const pick = async (list) => {
    const f = list?.[0];
    if (!f) return;
    const r = await checkFiles([f], { accept, maxSizeMB, unit: "f\xE1jl", typeHint, sizeHint });
    const elutasitva = r.rejected[0] ?? null;
    setRej(elutasitva);
    onChange(elutasitva ? null : r.ok[0] ?? null);
  };
  const nagy = Boolean(value && warnSizeMB && value.size > warnSizeMB * MB);
  const hiba = error ?? (rej ? `${rej.file} \u2013 ${rej.reason}. ${rej.next}` : void 0);
  return /* @__PURE__ */ jsx(
    Field,
    {
      label,
      help,
      required,
      disabled,
      error: hiba,
      range: `${formatText} \xB7 legfeljebb ${formatHu(maxSizeMB, 1)} MB \xB7 1 f\xE1jl`,
      notice: nagy ? `A f\xE1jl ${formatHu(warnSizeMB ?? 0, 1)} MB-n\xE1l nagyobb \u2013 a szerver elutas\xEDthatja. Ha nem megy, bontsd kisebb r\xE9szekre.` : void 0,
      children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => !value ? /* @__PURE__ */ jsxs(
        "label",
        {
          className: "bc-dropzone",
          onDragOver: (e) => {
            if (!disabled) e.preventDefault();
          },
          onDrop: (e) => {
            e.preventDefault();
            if (!disabled) void pick(e.dataTransfer.files);
          },
          children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: f.id,
                type: "file",
                className: "bc-upload-input",
                disabled,
                required,
                accept: acceptAttr ?? accept.join(","),
                "aria-describedby": [f.describedBy, rej && rejId].filter(Boolean).join(" ") || void 0,
                "aria-invalid": f.invalid || void 0,
                onChange: (e) => {
                  void pick(e.currentTarget.files);
                  e.currentTarget.value = "";
                }
              }
            ),
            /* @__PURE__ */ jsx(IcFile, {}),
            /* @__PURE__ */ jsx("strong", { children: "F\xE1jl kiv\xE1laszt\xE1sa" }),
            /* @__PURE__ */ jsx("span", { children: "vagy h\xFAzd ide" })
          ]
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "bc-filecard", "aria-busy": busy || void 0, children: [
        /* @__PURE__ */ jsxs("div", { className: "bc-filecard-row", children: [
          /* @__PURE__ */ jsx("b", { children: value.name }),
          /* @__PURE__ */ jsx("span", { className: "bc-filecard-size", children: fileSizeText(value.size) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bc-filecard-row", role: "status", children: [
          /* @__PURE__ */ jsx("span", { children: busy ? "Felt\xF6lt\xE9s\u2026" : "Felt\xF6lt\xE9sre k\xE9sz." }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", disabled: busy || disabled, onClick: () => {
            setRej(null);
            onChange(null);
          }, children: "M\xE1sik f\xE1jl" })
        ] })
      ] }) })
    }
  );
}

export {
  fileSizeText,
  FilePicker
};
