/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Modal
} from "./chunk-HIMZGN3D.js";
import {
  ImageCropper
} from "./chunk-6PT3NFCR.js";
import {
  Button
} from "./chunk-PAKWALHM.js";

// react/src/media/CropDialog.tsx
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var KIMENET = { "image/png": "image/png", "image/webp": "image/webp" };
async function cropToFile(file, src, area) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(area.width));
  c.height = Math.max(1, Math.round(area.height));
  c.getContext("2d").drawImage(img, area.x, area.y, area.width, area.height, 0, 0, c.width, c.height);
  const type = KIMENET[file.type] ?? "image/jpeg";
  const blob = await new Promise((ok) => c.toBlob(ok, type, 0.9));
  if (!blob) throw new Error("A kiv\xE1g\xE1s nem siker\xFClt \u2013 pr\xF3b\xE1ld \xFAjra, vagy v\xE1lassz m\xE1sik k\xE9pet.");
  return new File([blob], file.name, { type, lastModified: Date.now() });
}
function CropDialog({ file, crop, position, onDone, onSkip }) {
  const [src, setSrc] = useState(null);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState();
  useEffect(() => {
    if (!file) {
      setSrc(null);
      return;
    }
    const u = URL.createObjectURL(file);
    setSrc(u);
    setArea(null);
    setErr(void 0);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  const kesz = async () => {
    if (!file || !src || !area) return;
    setBusy(true);
    try {
      onDone(await cropToFile(file, src, area));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "A kiv\xE1g\xE1s nem siker\xFClt.");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    Modal,
    {
      open: file !== null,
      onOpenChange: (o) => {
        if (!o && file && !busy) onSkip(file);
      },
      size: "wide",
      busy,
      title: `K\xE9p kiv\xE1g\xE1sa (${crop.aspectLabel})${position ? ` \u2013 ${position}` : ""}`,
      description: /* @__PURE__ */ jsxs(Fragment, { children: [
        file?.name,
        crop.why ? ` \xB7 ${crop.why}` : ""
      ] }),
      footer: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => file && onSkip(file), disabled: busy, children: "Ezt kihagyom" }),
        /* @__PURE__ */ jsx(Button, { onClick: () => void kesz(), busy, disabled: !area, children: "Kiv\xE1g\xE1s \xE9s felt\xF6lt\xE9s" })
      ] }),
      children: [
        src && /* @__PURE__ */ jsx(ImageCropper, { src, aspects: [{ label: crop.aspectLabel, value: crop.aspect }], minOutputWidth: crop.minOutputWidth, onCrop: (a) => setArea(a) }),
        err && /* @__PURE__ */ jsx("p", { className: "bc-error", role: "alert", children: err })
      ]
    }
  );
}

export {
  cropToFile,
  CropDialog
};
