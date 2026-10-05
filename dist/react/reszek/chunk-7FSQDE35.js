/* beeco design system 1.43.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  useReturnFocus
} from "./chunk-EUX23WO6.js";
import {
  TextField
} from "./chunk-V656YXRP.js";
import {
  Button
} from "./chunk-THJ4H4S4.js";

// react/src/media/GalleryDialogs.tsx
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Small({ open, onClose, title, children, foot, fallback }) {
  const back = useReturnFocus(open, fallback);
  return /* @__PURE__ */ jsx(Dialog.Root, { open, onOpenChange: (o) => {
    if (!o) onClose();
  }, children: /* @__PURE__ */ jsx(Dialog.Portal, { children: /* @__PURE__ */ jsx(Dialog.Overlay, { className: "bc-scrim", children: /* @__PURE__ */ jsxs(Dialog.Content, { className: "bc-modal", "aria-describedby": void 0, onCloseAutoFocus: back, children: [
    /* @__PURE__ */ jsx("div", { className: "bc-modal-head", children: /* @__PURE__ */ jsx(Dialog.Title, { children: title }) }),
    /* @__PURE__ */ jsx("div", { className: "bc-modal-body", children }),
    /* @__PURE__ */ jsx("div", { className: "bc-modal-foot", children: foot })
  ] }) }) }) });
}
var ALT_MAX = 150;
var ALT_HELP = "Mondd el egy mondatban, mi l\xE1tszik a k\xE9pen \u2013 ezt olvassa fel a k\xE9perny\u0151olvas\xF3, \xE9s ez jelenik meg, ha a k\xE9p nem t\xF6lt be. Pl. \u201EA k\xE1v\xE9z\xF3 terasza ny\xE1ron, vir\xE1gl\xE1d\xE1kkal\u201D. Ne a f\xE1jlnevet \xEDrd.";
function AltDialog({ img, help = ALT_HELP, onSave, onClose, fallback }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState();
  useEffect(() => {
    setText(img?.alt ?? "");
    setErr(void 0);
  }, [img]);
  const save = (e) => {
    e.preventDefault();
    const t = text.trim().replace(/\s+/g, " ");
    if (t.length < 3) {
      setErr(t ? `Legal\xE1bb 3 karakter kell \u2013 most ${t.length}.` : "A le\xEDr\xE1s k\xF6telez\u0151 \u2013 \xEDrd le egy mondatban, mi l\xE1tszik a k\xE9pen.");
      return;
    }
    onSave(t);
    onClose();
  };
  return /* @__PURE__ */ jsx(
    Small,
    {
      open: !!img,
      onClose,
      title: "K\xE9ple\xEDr\xE1s (alt)",
      fallback,
      foot: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onClose, children: "M\xE9gse" }),
        /* @__PURE__ */ jsx(Button, { type: "submit", form: "bc-alt-form", children: "Ment\xE9s" })
      ] }),
      children: /* @__PURE__ */ jsxs("form", { id: "bc-alt-form", onSubmit: save, noValidate: true, children: [
        img && /* @__PURE__ */ jsx("img", { className: "bc-alt-thumb", src: img.src, alt: "" }),
        /* @__PURE__ */ jsx(
          TextField,
          {
            label: "Mi l\xE1tszik a k\xE9pen?",
            help,
            required: true,
            minLength: 3,
            maxLength: ALT_MAX,
            value: text,
            onChange: (e) => {
              setText(e.target.value);
              setErr(void 0);
            },
            error: err,
            autoFocus: true
          }
        )
      ] })
    }
  );
}
function DeleteDialog({ img, onConfirm, onClose, fallback }) {
  return /* @__PURE__ */ jsxs(
    Small,
    {
      open: !!img,
      onClose,
      title: "T\xF6rl\xF6d ezt a k\xE9pet?",
      fallback,
      foot: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onClose, autoFocus: true, children: "M\xE9gse" }),
        /* @__PURE__ */ jsx(Button, { variant: "danger", onClick: () => {
          onConfirm();
          onClose();
        }, children: "T\xF6rl\xE9s" })
      ] }),
      children: [
        img && /* @__PURE__ */ jsx("img", { className: "bc-alt-thumb", src: img.src, alt: "" }),
        /* @__PURE__ */ jsxs("p", { children: [
          img?.alt ? `\u201E${img.alt}\u201D` : "A le\xEDr\xE1s n\xE9lk\xFCli k\xE9p",
          " leker\xFCl a gal\xE9ri\xE1b\xF3l. Ha kell, k\xE9s\u0151bb \xFAjra felt\xF6ltheted."
        ] })
      ]
    }
  );
}

export {
  ALT_MAX,
  ALT_HELP,
  AltDialog,
  DeleteDialog
};
