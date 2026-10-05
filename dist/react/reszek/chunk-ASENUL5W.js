/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  BeeMoment
} from "./chunk-RAHWQHWH.js";
import {
  ReviewReject
} from "./chunk-MRINZZQB.js";
import {
  ProgressBar
} from "./chunk-I5OXKSPT.js";
import {
  UndoIcon
} from "./chunk-D4EQ6RUQ.js";
import {
  Button
} from "./chunk-PAKWALHM.js";
import {
  cx
} from "./chunk-FXE4ZZPK.js";

// react/src/kieg/ReviewQueue.tsx
import { useEffect, useId, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var NAME = { approve: "J\xF3v\xE1hagyva", reject: "Elutas\xEDtva", skip: "Kihagyva" };
var TONE = { approve: "is-success", reject: "is-danger", skip: "is-muted" };
var typing = (t) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
function ReviewQueue({ items, getId, getTitle, render, onDecide, onUndo, reasons, label = "Ellen\u0151rz\xE9si sor", className }) {
  const [at, setAt] = useState(0);
  const [log, setLog] = useState([]);
  const [rejecting, setRejecting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState();
  const [say, setSay] = useState("");
  const head = useRef(null);
  const root = useRef(null);
  const rejectBtn = useRef(null);
  const titleId = useId();
  const item = items[at];
  const total = items.length;
  const decide = async (d) => {
    if (busy || !item) return;
    setErr(void 0);
    try {
      const r = onDecide(item, d);
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      setRejecting(false);
      setLog((l) => [...l, { index: at, d }]);
      const next = items[at + 1];
      setSay(`${NAME[d.type]}: ${getTitle(item)}. ${next ? `K\xF6vetkez\u0151: ${getTitle(next)} (${at + 2}/${total}).` : "A sor v\xE9g\xE9re \xE9rt\xE9l."}`);
      setAt(at + 1);
      focusHead.current = true;
    } catch (e) {
      setBusy(false);
      setErr(`Nem siker\xFClt menteni a d\xF6nt\xE9st${e instanceof Error && e.message ? `: ${e.message}` : ""}. Pr\xF3b\xE1ld \xFAjra.`);
    }
  };
  const undo = async () => {
    const last2 = log[log.length - 1];
    if (!last2 || busy || !onUndo) return;
    try {
      const r = onUndo(items[last2.index], last2.d);
      if (r instanceof Promise) {
        setBusy(true);
        await r;
      }
      setBusy(false);
      setLog(log.slice(0, -1));
      setAt(last2.index);
      setRejecting(false);
      setSay(`Visszavonva: ${getTitle(items[last2.index])}.`);
      focusHead.current = true;
    } catch {
      setBusy(false);
      setErr("Nem siker\xFClt visszavonni. Pr\xF3b\xE1ld \xFAjra.");
    }
  };
  const focusHead = useRef(false);
  useEffect(() => {
    if (focusHead.current) {
      focusHead.current = false;
      head.current?.focus();
    }
  });
  useEffect(() => {
    const h = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || typing(e.target) || rejecting || busy || !item || document.querySelector("dialog[open]")) return;
      const a = document.activeElement, r = root.current;
      if (!r || !(r.contains(a) || (!a || a === document.body) && document.querySelector(".bc-review") === r)) return;
      const k = e.key.toLowerCase();
      if (k === "j") {
        e.preventDefault();
        void decide({ type: "approve" });
      } else if (k === "e") {
        e.preventDefault();
        setRejecting(true);
      } else if (k === "k") {
        e.preventDefault();
        void decide({ type: "skip" });
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  });
  const count = (t) => log.filter((x) => x.d.type === t).length;
  const last = log[log.length - 1];
  return /* @__PURE__ */ jsxs("section", { ref: root, className: cx("bc-review", className), "aria-label": label, children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-review-top", children: [
      /* @__PURE__ */ jsxs("span", { className: "bc-num bc-review-pos", "aria-label": `${Math.min(at + 1, total)}. t\xE9tel, \xF6sszesen ${total}`, children: [
        Math.min(at + 1, total),
        "/",
        total
      ] }),
      /* @__PURE__ */ jsx(ProgressBar, { value: total ? at / total : 1, label: "Halad\xE1s a sorban" }),
      /* @__PURE__ */ jsxs("span", { className: "bc-review-tally", children: [
        count("approve"),
        " j\xF3v\xE1hagyva \xB7 ",
        count("reject"),
        " elutas\xEDtva \xB7 ",
        count("skip"),
        " kihagyva"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", children: say }),
    last && /* @__PURE__ */ jsxs("div", { className: "bc-review-last", children: [
      /* @__PURE__ */ jsx("span", { className: cx("bc-badge bc-anim-stamp", TONE[last.d.type]), children: NAME[last.d.type] }),
      /* @__PURE__ */ jsxs("span", { className: "bc-review-last-title", children: [
        getTitle(items[last.index]),
        last.d.reason ? ` \u2013 ${last.d.reason}` : ""
      ] }),
      onUndo && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", icon: /* @__PURE__ */ jsx(UndoIcon, {}), disabled: busy, onClick: () => void undo(), children: "Visszavon\xE1s" })
    ] }, log.length),
    item ? /* @__PURE__ */ jsxs("article", { className: "bc-card bc-review-item", "aria-labelledby": titleId, children: [
      /* @__PURE__ */ jsx("h2", { id: titleId, ref: head, tabIndex: -1, className: "bc-review-title", children: getTitle(item) }),
      render(item)
    ] }, getId(item)) : total === 0 ? /* @__PURE__ */ jsx(BeeMoment, { pillanat: "ures", sima: "Nincs ellen\u0151rizend\u0151 t\xE9tel ebben a sorban." }) : /* @__PURE__ */ jsx(
      BeeMoment,
      {
        pillanat: "merfoldko",
        valtozat: 0,
        live: "status",
        sima: `Minden t\xE9telt \xE1tn\xE9zt\xE9l: ${count("approve")} j\xF3v\xE1hagyva, ${count("reject")} elutas\xEDtva, ${count("skip")} kihagyva.`
      }
    ),
    err && /* @__PURE__ */ jsx("div", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx("p", { children: err }) }),
    item && /* @__PURE__ */ jsx("div", { className: "bc-review-bar", children: rejecting ? /* @__PURE__ */ jsx(
      ReviewReject,
      {
        reasons,
        busy,
        onSubmit: (reason) => void decide({ type: "reject", reason }),
        onCancel: () => {
          setRejecting(false);
          requestAnimationFrame(() => rejectBtn.current?.focus());
        }
      }
    ) : /* @__PURE__ */ jsxs("div", { className: "bc-row bc-review-actions", children: [
      /* @__PURE__ */ jsxs(Button, { busy, onClick: () => void decide({ type: "approve" }), "aria-keyshortcuts": "J", children: [
        "J\xF3v\xE1hagy\xE1s ",
        /* @__PURE__ */ jsx("kbd", { className: "bc-kbd", children: "J" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { ref: rejectBtn, variant: "danger", disabled: busy, onClick: () => setRejecting(true), "aria-keyshortcuts": "E", children: [
        "Elutas\xEDt\xE1s ",
        /* @__PURE__ */ jsx("kbd", { className: "bc-kbd", children: "E" })
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "secondary", disabled: busy, onClick: () => void decide({ type: "skip" }), "aria-keyshortcuts": "K", children: [
        "Kihagy\xE1s ",
        /* @__PURE__ */ jsx("kbd", { className: "bc-kbd", children: "K" })
      ] })
    ] }) })
  ] });
}

export {
  ReviewQueue
};
