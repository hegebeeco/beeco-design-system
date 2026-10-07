/* beeco design system 1.51.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useUploads
} from "./chunk-OX5KWGDH.js";
import {
  UploadTile
} from "./chunk-RGEU7N54.js";
import {
  CropDialog
} from "./chunk-WWLV7Y5S.js";
import {
  checkFiles,
  fileKey,
  typeNames
} from "./chunk-6XDZVDWZ.js";
import {
  Gallery
} from "./chunk-5QSHKJLW.js";
import {
  IcClose,
  IcPlus
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
  cx
} from "./chunk-HJFOG57B.js";

// react/src/media/ImageUploader.tsx
import { useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function ImageUploader({
  label,
  help,
  images,
  onChange,
  upload,
  accept = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = 5,
  maxCount = 10,
  ordering,
  confirmDelete,
  altHelp,
  sizeHint = "Kicsiny\xEDtsd le, pl. 2000 px sz\xE9lesre, \xE9s pr\xF3b\xE1ld \xFAjra.",
  required,
  disabled,
  readOnly,
  error,
  crop,
  altEditable = true
}) {
  const [rejected, setRejected] = useState([]);
  const [note, setNote] = useState();
  const [over, setOver] = useState(false);
  const input = useRef(null);
  const rejId = useId();
  const latest = useRef(images);
  latest.current = images;
  const fromFile = useRef(/* @__PURE__ */ new Map());
  const origKey = useRef(/* @__PURE__ */ new WeakMap());
  const [queue, setQueue] = useState({ files: [], total: 0 });
  const up = useUploads(
    upload,
    (img, file) => {
      fromFile.current.set(img.id, origKey.current.get(file) ?? fileKey(file));
      const next2 = [...latest.current, img];
      latest.current = next2;
      onChange(next2);
    },
    (f) => setNote(`Megszak\xEDtottad: ${f.name}. Ha m\xE9gis kell, v\xE1laszd ki \xFAjra.`)
  );
  const used = images.length + up.items.length + queue.files.length;
  const full = used >= maxCount;
  const locked = disabled || readOnly;
  const failed = up.items.filter((i) => i.status === "error");
  const noAlt = altEditable ? images.filter((i) => !i.alt).length : 0;
  const add = async (list) => {
    if (!list || locked) return;
    setNote(void 0);
    const r = await checkFiles([...list], {
      accept,
      maxSizeMB,
      room: maxCount - used,
      max: maxCount,
      known: /* @__PURE__ */ new Set([...up.keys, ...images.flatMap((i) => fromFile.current.get(i.id) ?? [])]),
      sizeHint,
      unit: "k\xE9p",
      typeHint: `Mentsd el ${typeNames(accept).split(", ")[0]}-k\xE9nt (pl. a telefonon: Megoszt\xE1s \u2192 Ment\xE9s k\xE9pk\xE9nt), \xE9s t\xF6ltsd fel \xFAjra.`
    });
    setRejected(r.rejected);
    if (!r.ok.length) return;
    if (crop) setQueue((q) => ({ files: [...q.files, ...r.ok], total: q.total + r.ok.length }));
    else up.start(r.ok);
  };
  const next = () => setQueue((q) => q.files.length <= 1 ? { files: [], total: 0 } : { ...q, files: q.files.slice(1) });
  const cropped = (f) => {
    const o = queue.files[0];
    if (o) origKey.current.set(f, fileKey(o));
    up.start([f]);
    next();
  };
  const skipped = (f) => {
    setNote(`Kihagytad: ${f.name}. Ha m\xE9gis kell, v\xE1laszd ki \xFAjra.`);
    next();
  };
  const fileDrag = {
    over: (e) => {
      if (locked || !e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = full ? "none" : "copy";
      setOver(true);
    },
    leave: (e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setOver(false);
    },
    drop: (e) => {
      if (locked) return;
      e.preventDefault();
      setOver(false);
      void add(e.dataTransfer.files);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-upload", over && "is-over", locked && "is-locked"), children: [
    /* @__PURE__ */ jsx(
      Field,
      {
        label,
        help,
        required,
        disabled,
        error,
        range: `${typeNames(accept)} \xB7 legfeljebb ${formatHu(maxSizeMB, 1)} MB/k\xE9p \xB7 legfeljebb ${maxCount} k\xE9p`,
        count: { value: used, max: maxCount, unit: "k\xE9p" },
        children: /* @__PURE__ */ jsx(FieldInput, { children: (f) => /* @__PURE__ */ jsxs(Gallery, { images, onChange: readOnly || disabled ? void 0 : onChange, ordering, confirmDelete, altHelp, altEditable, label, onFileDrag: fileDrag, children: [
          up.items.map((it) => /* @__PURE__ */ jsx(UploadTile, { item: it, onCancel: () => up.cancel(it.id), onRetry: () => up.retry(it.id) }, it.id)),
          !readOnly && /* @__PURE__ */ jsx("li", { className: cx("bc-tile is-add", (full || disabled) && "is-disabled", used === 0 && "is-empty"), children: /* @__PURE__ */ jsxs("label", { children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: input,
                id: f.id,
                type: "file",
                className: "bc-upload-input",
                multiple: true,
                accept: accept.join(","),
                disabled: full || disabled,
                "aria-describedby": [f.describedBy, rejected.length || failed.length ? rejId : ""].filter(Boolean).join(" ") || void 0,
                "aria-invalid": f.invalid || rejected.length > 0 || void 0,
                required: required && images.length === 0,
                onChange: (e) => {
                  void add(e.currentTarget.files);
                  e.currentTarget.value = "";
                }
              }
            ),
            /* @__PURE__ */ jsx(IcPlus, {}),
            /* @__PURE__ */ jsx("span", { className: "bc-tile-add-t", children: full ? "Tele" : "K\xE9p" }),
            /* @__PURE__ */ jsx("span", { className: "bc-tile-add-s", children: full ? `${maxCount}/${maxCount} \u2013 t\xF6r\xF6lj egyet, ha \xFAjat tenn\xE9l fel` : used === 0 ? "H\xFAzd ide a k\xE9peket, vagy koppints" : "h\xFAzd ide vagy v\xE1laszd ki" })
          ] }) })
        ] }) })
      }
    ),
    (rejected.length > 0 || failed.length > 0) && /* @__PURE__ */ jsxs("div", { className: "bc-upload-errors", id: rejId, children: [
      /* @__PURE__ */ jsxs("ul", { role: "alert", children: [
        rejected.map((r, i) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("b", { children: r.file }),
          " \u2013 ",
          r.reason,
          ". ",
          r.next
        ] }, `r${i}`)),
        failed.map((it) => /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("b", { children: it.file.name }),
          " \u2013 ",
          it.error,
          " A csemp\xE9n az \u201E\xDAjra\u201D gombbal folytathatod."
        ] }, it.id))
      ] }),
      rejected.length > 0 && /* @__PURE__ */ jsx("button", { type: "button", className: "bc-icon-btn", "aria-label": "\xDCzenetek bez\xE1r\xE1sa", onClick: () => setRejected([]), children: /* @__PURE__ */ jsx(IcClose, {}) })
    ] }),
    note && /* @__PURE__ */ jsx("p", { className: "bc-notice", role: "status", children: note }),
    crop && /* @__PURE__ */ jsx(
      CropDialog,
      {
        file: queue.files[0] ?? null,
        crop,
        position: queue.total > 1 ? `${queue.total - queue.files.length + 1}/${queue.total}` : void 0,
        onDone: cropped,
        onSkip: skipped
      }
    ),
    noAlt > 0 && !readOnly && /* @__PURE__ */ jsxs("p", { className: "bc-upload-alt", role: "status", children: [
      noAlt,
      " k\xE9pnek m\xE9g nincs le\xEDr\xE1sa \u2013 a csempe \u22EF men\xFCj\xE9ben add meg (\u201ELe\xEDr\xE1s\u201D)."
    ] })
  ] });
}

export {
  ImageUploader
};
