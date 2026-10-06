/* beeco design system 1.48.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useReturnFocus
} from "./chunk-5EODRNBB.js";
import {
  IcClose,
  IcLeft,
  IcRight
} from "./chunk-TRPWTMLI.js";

// react/src/media/Lightbox.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Lightbox({ images, index, onIndexChange, returnFocus }) {
  const open = index !== null && images.length > 0;
  const i = Math.min(index ?? 0, Math.max(0, images.length - 1));
  const img = images[i];
  const go = (d) => onIndexChange((i + d + images.length) % images.length);
  const startX = useRef(null);
  const back = useReturnFocus(open, returnFocus);
  const onKey = (e) => {
    if (images.length < 2) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };
  const onDown = (e) => {
    startX.current = e.clientX;
  };
  const onUp = (e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 40 && images.length > 1) go(dx < 0 ? 1 : -1);
  };
  return /* @__PURE__ */ jsx(Dialog.Root, { open, onOpenChange: (o) => {
    if (!o) onIndexChange(null);
  }, children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [
    /* @__PURE__ */ jsx(Dialog.Overlay, { className: "bc-lightbox-scrim" }),
    /* @__PURE__ */ jsxs(Dialog.Content, { className: "bc-lightbox", onKeyDown: onKey, "aria-describedby": void 0, onCloseAutoFocus: back, children: [
      /* @__PURE__ */ jsxs("div", { className: "bc-lightbox-top", children: [
        /* @__PURE__ */ jsxs("span", { className: "bc-lightbox-pill", "aria-live": "polite", "data-lightbox-count": true, children: [
          i + 1,
          "/",
          images.length
        ] }),
        /* @__PURE__ */ jsxs(Dialog.Title, { className: "bc-sr", children: [
          "K\xE9p nagy\xEDtva: ",
          img?.alt || "nincs le\xEDr\xE1sa"
        ] }),
        /* @__PURE__ */ jsx(Dialog.Close, { className: "bc-icon-btn bc-lightbox-btn", "aria-label": "Bez\xE1r\xE1s (Esc)", children: /* @__PURE__ */ jsx(IcClose, {}) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bc-lightbox-mid", children: [
        images.length > 1 && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn bc-lightbox-btn", "aria-label": "El\u0151z\u0151 k\xE9p (\u2190)", onClick: () => go(-1), children: /* @__PURE__ */ jsx(IcLeft, {}) }),
        /* @__PURE__ */ jsx("div", { className: "bc-lightbox-stage", onPointerDown: onDown, onPointerUp: onUp, onPointerCancel: () => {
          startX.current = null;
        }, children: img && /* @__PURE__ */ jsx("img", { src: img.src, alt: img.alt, draggable: false }, img.id) }),
        images.length > 1 && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn bc-lightbox-btn", "aria-label": "K\xF6vetkez\u0151 k\xE9p (\u2192)", onClick: () => go(1), children: /* @__PURE__ */ jsx(IcRight, {}) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "bc-lightbox-cap", children: img?.alt || /* @__PURE__ */ jsx("em", { children: "Ennek a k\xE9pnek m\xE9g nincs le\xEDr\xE1sa." }) })
    ] })
  ] }) });
}

export {
  Lightbox
};
