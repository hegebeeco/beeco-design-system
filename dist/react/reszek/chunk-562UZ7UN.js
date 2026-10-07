/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  IcDots,
  IcWarn
} from "./chunk-T4T6BK53.js";
import {
  cx
} from "./chunk-UHO66ITM.js";

// react/src/media/GalleryTile.tsx
import * as Menu from "@radix-ui/react-dropdown-menu";
import { jsx, jsxs } from "react/jsx-runtime";
function GalleryTile({ img, index, count, ordering, editable, altEditable = true, dragging, dropTarget, onAction, onDragStart, onDragEnd, onDragOver, onDrop }) {
  const name = img.alt || (altEditable ? `${index + 1}. k\xE9p (nincs le\xEDr\xE1sa)` : `${index + 1}. k\xE9p`);
  const canMove = ordering && editable;
  return /* @__PURE__ */ jsxs(
    "li",
    {
      "data-tile": img.id,
      className: cx("bc-tile", dragging && "is-dragging", dropTarget && "is-drop"),
      draggable: canMove,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDrop,
      children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "bc-tile-open", onClick: () => onAction("open"), "aria-label": `Nagy\xEDt\xE1s: ${name}${ordering && index === 0 ? " (bor\xEDt\xF3)" : ""}`, children: /* @__PURE__ */ jsx("img", { src: img.src, alt: "", draggable: false, loading: "lazy", decoding: "async" }) }),
        ordering && index === 0 && /* @__PURE__ */ jsx("span", { className: "bc-badge is-accent bc-tile-cover", children: "Bor\xEDt\xF3" }),
        !img.alt && altEditable && /* @__PURE__ */ jsxs("span", { className: "bc-badge is-warning bc-tile-noalt", children: [
          /* @__PURE__ */ jsx(IcWarn, {}),
          "Le\xEDr\xE1s kell"
        ] }),
        editable && /* @__PURE__ */ jsxs(Menu.Root, { modal: false, children: [
          /* @__PURE__ */ jsx(Menu.Trigger, { className: "bc-icon-btn bc-tile-menu", "aria-label": `M\u0171veletek: ${name}`, children: /* @__PURE__ */ jsx(IcDots, {}) }),
          /* @__PURE__ */ jsx(Menu.Portal, { children: /* @__PURE__ */ jsxs(Menu.Content, { className: "bc-gmenu", align: "end", sideOffset: 4, collisionPadding: 12, children: [
            /* @__PURE__ */ jsx(Menu.Item, { className: "bc-gmenu-item", onSelect: () => onAction("open"), children: "Megnyit\xE1s" }),
            canMove && /* @__PURE__ */ jsx(Menu.Item, { className: "bc-gmenu-item", disabled: index === 0, onSelect: () => onAction("cover"), children: "Legyen a bor\xEDt\xF3" }),
            canMove && /* @__PURE__ */ jsx(Menu.Item, { className: "bc-gmenu-item", disabled: index === 0, onSelect: () => onAction("back"), children: "El\u0151re (balra)" }),
            canMove && /* @__PURE__ */ jsx(Menu.Item, { className: "bc-gmenu-item", disabled: index === count - 1, onSelect: () => onAction("forward"), children: "H\xE1tra (jobbra)" }),
            altEditable && /* @__PURE__ */ jsx(Menu.Item, { className: "bc-gmenu-item", onSelect: () => onAction("alt"), children: img.alt ? "Le\xEDr\xE1s (alt) szerkeszt\xE9se\u2026" : "Le\xEDr\xE1s (alt) megad\xE1sa\u2026" }),
            /* @__PURE__ */ jsx(Menu.Separator, { className: "bc-gmenu-sep" }),
            /* @__PURE__ */ jsx(Menu.Item, { className: "bc-gmenu-item is-danger", onSelect: () => onAction("delete"), children: "T\xF6rl\xE9s\u2026" })
          ] }) })
        ] })
      ]
    }
  );
}

export {
  GalleryTile
};
