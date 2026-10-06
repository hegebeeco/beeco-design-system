/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Progress
} from "./chunk-BXRDZIMD.js";
import {
  sizePair
} from "./chunk-3W7XAKKT.js";
import {
  IcClose,
  IcRetry,
  IcWarn
} from "./chunk-CMRAGUXG.js";

// react/src/media/UploadTile.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function UploadTile({ item, onCancel, onRetry }) {
  const { file, loaded, status } = item;
  const failed = status === "error";
  const sizeText = sizePair(loaded, file.size);
  return /* @__PURE__ */ jsxs("li", { className: failed ? "bc-tile is-upload is-failed" : "bc-tile is-upload", "data-upload": file.name, children: [
    /* @__PURE__ */ jsx("img", { src: item.preview, alt: "" }),
    /* @__PURE__ */ jsx("div", { className: "bc-tile-status", children: failed ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("span", { className: "bc-tile-err", children: [
        /* @__PURE__ */ jsx(IcWarn, {}),
        "Nem siker\xFClt"
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "bc-tile-actions", children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", onClick: onRetry, "aria-label": `\xDAjrapr\xF3b\xE1l\xE1s: ${file.name}`, children: /* @__PURE__ */ jsx(IcRetry, {}) }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", onClick: onCancel, "aria-label": `Elt\xE1vol\xEDt\xE1s: ${file.name}`, children: /* @__PURE__ */ jsx(IcClose, {}) })
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("span", { className: "bc-tile-size", children: sizeText }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", onClick: onCancel, "aria-label": `Felt\xF6lt\xE9s megszak\xEDt\xE1sa: ${file.name}`, children: /* @__PURE__ */ jsx(IcClose, {}) })
    ] }) }),
    !failed && /* @__PURE__ */ jsx(Progress, { value: loaded, max: file.size, label: `${file.name} felt\xF6lt\xE9se`, valueText: sizeText }),
    failed && item.error && /* @__PURE__ */ jsx("span", { className: "bc-sr", children: item.error })
  ] });
}

export {
  UploadTile
};
