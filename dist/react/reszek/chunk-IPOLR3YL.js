/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  SegmentedControl
} from "./chunk-YUMMGPIQ.js";
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

// react/src/media/ImageCropper.tsx
import { useState } from "react";
import Cropper from "react-easy-crop";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_ASPECTS = [{ label: "16:9", value: 16 / 9 }, { label: "1:1", value: 1 }];
function ImageCropper({ src, aspects = DEFAULT_ASPECTS, minZoom = 1, maxZoom = 8, onCrop, minOutputWidth, zoomHelp, aspectHelp }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(minZoom);
  const [aspect, setAspect] = useState(aspects[0]);
  const [small, setSmall] = useState(null);
  const clampZoom = (z) => Math.min(maxZoom, Math.max(minZoom, Math.round(z * 10) / 10));
  const zoomText = `${formatHu(zoom, 1)}\xD7`;
  const onKey = (e) => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      setZoom((z) => clampZoom(z + 0.2));
    }
    if (e.key === "-" || e.key === "_") {
      e.preventDefault();
      setZoom((z) => clampZoom(z - 0.2));
    }
  };
  const reset = () => {
    setZoom(minZoom);
    setCrop({ x: 0, y: 0 });
  };
  return /* @__PURE__ */ jsxs("div", { className: "bc-cropper", onKeyDown: onKey, children: [
    aspects.length > 1 && /* @__PURE__ */ jsxs("div", { className: "bc-cropper-row", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-label", id: "bc-crop-aspect", children: "K\xE9par\xE1ny" }),
      /* @__PURE__ */ jsx(
        SegmentedControl,
        {
          label: "K\xE9par\xE1ny",
          value: aspect.label,
          onChange: (l) => setAspect(aspects.find((a) => a.label === l) ?? aspects[0]),
          items: aspects.map((a) => ({ value: a.label, label: a.label }))
        }
      ),
      aspectHelp && /* @__PURE__ */ jsx("span", { className: "bc-help", children: aspectHelp })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bc-cropper-stage", children: /* @__PURE__ */ jsx(
      Cropper,
      {
        image: src,
        crop,
        zoom,
        aspect: aspect.value,
        minZoom,
        maxZoom,
        zoomSpeed: 0.5,
        keyboardStep: 10,
        onCropChange: setCrop,
        onZoomChange: (z) => setZoom(clampZoom(z)),
        objectFit: "contain",
        showGrid: true,
        classes: { containerClassName: "bc-cropper-box", cropAreaClassName: "bc-cropper-area" },
        cropperProps: { "aria-label": `Kiv\xE1g\xE1s helye (${aspect.label}) \u2013 a nyilakkal mozgatod, a + \xE9s \u2212 gombbal nagy\xEDtasz`, role: "group" },
        onCropComplete: (_, px) => {
          setSmall(minOutputWidth && px.width < minOutputWidth ? Math.round(px.width) : null);
          onCrop(px, { zoom, aspect });
        }
      }
    ) }),
    /* @__PURE__ */ jsx(
      Field,
      {
        label: "Nagy\xEDt\xE1s",
        help: zoomHelp ?? "H\xFAzd a cs\xFAszk\xE1t, vagy nyomd a + \xE9s \u2212 gombot, hogy a l\xE9nyeg kit\xF6ltse a keretet. Egyes k\xE9perny\u0151k\xF6n kisebben jelenik meg a k\xE9p, ez\xE9rt ne v\xE1gd t\xFAl szorosra.",
        range: `${formatHu(minZoom, 0)}\u2013${formatHu(maxZoom, 0)}\xD7`,
        notice: small ? `A kiv\xE1g\xE1s csak ${small} px sz\xE9les (legal\xE1bb ${minOutputWidth} px kell) \u2013 a k\xE9p hom\xE1lyos lehet. Nagy\xEDts kev\xE9sb\xE9, vagy v\xE1lassz nagyobb k\xE9pet.` : void 0,
        children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs("div", { className: "bc-cropper-zoom", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: f.id,
              type: "range",
              className: "bc-range",
              min: minZoom,
              max: maxZoom,
              step: 0.1,
              value: zoom,
              "aria-describedby": f.describedBy,
              "aria-valuetext": zoomText,
              onChange: (e) => setZoom(clampZoom(Number(e.target.value)))
            }
          ),
          /* @__PURE__ */ jsx("output", { htmlFor: f.id, className: "bc-cropper-out", "data-zoom": true, children: zoomText }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: reset, disabled: zoom === minZoom && crop.x === 0 && crop.y === 0, children: "Alaphelyzet" })
        ] }) })
      }
    )
  ] });
}

export {
  ImageCropper
};
