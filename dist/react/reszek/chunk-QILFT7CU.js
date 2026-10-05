/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  AltDialog,
  DeleteDialog
} from "./chunk-CUNPC34I.js";
import {
  GalleryTile
} from "./chunk-XDH2WI6Q.js";
import {
  Lightbox
} from "./chunk-ANLZLNQF.js";
import {
  cx
} from "./chunk-BVA4MWWR.js";

// react/src/media/Gallery.tsx
import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var MIME = "application/x-bc-gallery";
function Gallery({ images, onChange, ordering = true, confirmDelete, altHelp, altEditable = true, label = "K\xE9pek", children, className, onFileDrag }) {
  const [zoom, setZoom] = useState(null);
  const [altFor, setAltFor] = useState(null);
  const [delFor, setDelFor] = useState(null);
  const [drag, setDrag] = useState(null);
  const [said, setSaid] = useState("");
  const editable = Boolean(onChange);
  const root = useRef(null);
  const opener = useRef(null);
  const trigger = () => opener.current && root.current?.querySelector(`[data-tile="${opener.current}"] .bc-tile-menu`) || root.current?.querySelector(".bc-tile-menu, .bc-tile-open, input");
  const move = (from, to) => {
    if (!onChange || from === to || to < 0 || to >= images.length) return;
    const next = [...images];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
    setSaid(`\xC1thelyezve: ${x.alt || "k\xE9p"} \u2013 ${to + 1}. hely a ${images.length}-b\u0151l${to === 0 ? ", ez most a bor\xEDt\xF3" : ""}.`);
  };
  const remove = async (img) => {
    if (confirmDelete && !await confirmDelete(img)) return;
    onChange?.(images.filter((x) => x.id !== img.id));
    setSaid(`T\xF6r\xF6lve: ${img.alt || "k\xE9p"}. ${images.length - 1} k\xE9p maradt.`);
  };
  const act = (i) => (a) => {
    const img = images[i];
    opener.current = img.id;
    if (a === "open") setZoom(i);
    else if (a === "cover") move(i, 0);
    else if (a === "back") move(i, i - 1);
    else if (a === "forward") move(i, i + 1);
    else if (a === "alt") setAltFor(img);
    else if (a === "delete") {
      if (confirmDelete) void remove(img);
      else setDelFor(img);
    }
  };
  const own = (e) => e.dataTransfer.types.includes(MIME);
  const tileDrag = (i) => ({
    onDragStart: (e) => {
      e.dataTransfer.setData(MIME, String(i));
      e.dataTransfer.effectAllowed = "move";
      setDrag({ from: i, over: null });
    },
    onDragEnd: () => setDrag(null),
    onDragOver: (e) => {
      if (!own(e) || !drag) return;
      e.preventDefault();
      e.stopPropagation();
      if (drag.over !== i) setDrag({ ...drag, over: i });
    },
    onDrop: (e) => {
      if (!own(e) || !drag) return;
      e.preventDefault();
      e.stopPropagation();
      move(drag.from, i);
      setDrag(null);
    }
  });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: root,
      className: cx("bc-gallery", className),
      onDragOver: (e) => {
        if (!own(e)) onFileDrag?.over(e);
      },
      onDragLeave: (e) => onFileDrag?.leave(e),
      onDrop: (e) => {
        if (!own(e)) onFileDrag?.drop(e);
      },
      children: [
        /* @__PURE__ */ jsxs("ul", { className: "bc-gallery-grid", "aria-label": `${label}: ${images.length} k\xE9p`, children: [
          images.map((img, i) => /* @__PURE__ */ jsx(
            GalleryTile,
            {
              img,
              index: i,
              count: images.length,
              ordering,
              editable,
              altEditable,
              dragging: drag?.from === i,
              dropTarget: drag?.over === i && drag.from !== i,
              onAction: act(i),
              ...tileDrag(i)
            },
            img.id
          )),
          children
        ] }),
        images.length === 0 && !children && /* @__PURE__ */ jsx("p", { className: "bc-gallery-empty", children: "M\xE9g nincs k\xE9p ebben a gal\xE9ri\xE1ban." }),
        /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", "aria-live": "polite", children: said }),
        /* @__PURE__ */ jsx(Lightbox, { images, index: zoom, onIndexChange: setZoom, returnFocus: trigger }),
        /* @__PURE__ */ jsx(
          AltDialog,
          {
            fallback: trigger,
            img: altFor,
            help: altHelp,
            onClose: () => setAltFor(null),
            onSave: (alt) => {
              if (altFor) {
                onChange?.(images.map((x) => x.id === altFor.id ? { ...x, alt } : x));
                setSaid("A le\xEDr\xE1st elmentettem.");
              }
            }
          }
        ),
        /* @__PURE__ */ jsx(DeleteDialog, { fallback: trigger, img: delFor, onClose: () => setDelFor(null), onConfirm: () => {
          if (delFor) void remove(delFor);
        } })
      ]
    }
  );
}

export {
  Gallery
};
