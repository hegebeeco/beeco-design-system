/* beeco design system 1.48.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  defaultLink
} from "./chunk-CWAJ56WD.js";
import {
  formatHuDate
} from "./chunk-YGFEDREK.js";
import {
  EmptyState
} from "./chunk-DAYGAJXJ.js";
import {
  IcRight
} from "./chunk-F6KEZPWA.js";
import {
  cx
} from "./chunk-KBQVEJSX.js";

// react/src/ut/Utvonal.tsx
import { useLayoutEffect, useRef } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function hataridoSzoveg(ora) {
  if (ora < 0) {
    const k = Math.max(1, Math.round(-ora));
    return k >= 48 ? `${Math.floor(k / 24)} napja lej\xE1rt` : `${k} \xF3r\xE1ja lej\xE1rt`;
  }
  if (ora >= 48) return `m\xE9g ${Math.floor(ora / 24)} nap`;
  if (ora < 1) return "m\xE9g kevesebb mint 1 \xF3ra";
  return `m\xE9g ${Math.floor(ora)} \xF3ra`;
}
var UTVONAL_LABELS_HU = {
  allapot: { kesz: "k\xE9sz", most: "most itt tartasz", jon: "ezut\xE1n j\xF6n", kihagyva: "kihagyva" },
  jelveny: { kesz: "K\xE9sz", most: "Most itt tartasz", jon: "Ezut\xE1n j\xF6n", kihagyva: "Kihagyva" },
  mostItt: (n, m) => `Most itt tartasz \xB7 ${n}. szakasz (\xF6sszesen ${m})`,
  gorgetheto: "v\xEDzszintesen g\xF6rgethet\u0151",
  keszCim: "V\xE9gig\xE9rt\xE9l az \xFAton",
  keszSzoveg: "Minden szakasz k\xE9sz. Sz\xE9p munka!",
  uresCim: "M\xE9g nincs kijel\xF6lt \xFAt",
  uresSzoveg: "Amint elindul, itt l\xE1tod a szakaszokat \xE9s a k\xF6vetkez\u0151 l\xE9p\xE9st.",
  nincsSegito: "Seg\xEDt\u0151t m\xE9g keres\xFCnk neked \u2013 hamarosan jelentkezik.",
  kesesSegitovel: "Nincs baj \u2013 \xEDrj nyugodtan a seg\xEDt\u0151dnek.",
  kesesSegitoNelkul: "Nincs baj \u2013 folytasd, amikor tudod.",
  ido: hataridoSzoveg
};
var isoNap = (d) => d && /^\d{4}-\d{2}-\d{2}/.test(d) ? formatHuDate(d.slice(0, 10)) : d ?? "";
var JelIkon = ({ allapot, n }) => allapot === "kesz" ? /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M5 12.5l4.5 4.5L19 7" }) }) : allapot === "kihagyva" ? /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2.6", strokeLinecap: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M7 12h10" }) }) : /* @__PURE__ */ jsx(Fragment, { children: n });
function Utvonal({ szakaszok, cimke, kovetkezo, segito, hatarido, tomor, cimSzint = 3, renderLink = defaultLink, labels, children, className }) {
  const L = { ...UTVONAL_LABELS_HU, ...labels };
  const H = `h${cimSzint}`;
  const mostIdx = szakaszok.findIndex((s) => s.allapot === "most");
  const allapotOf = (s, i) => s.allapot === "most" && i !== mostIdx ? "jon" : s.allapot;
  const mind = szakaszok.length > 0 && szakaszok.every((s) => s.allapot === "kesz" || s.allapot === "kihagyva");
  const most = mostIdx >= 0 ? szakaszok[mostIdx] : void 0;
  const terkep = useRef(null);
  useLayoutEffect(() => {
    const el = terkep.current;
    const cur = el?.querySelector('[aria-current="step"]');
    if (!el || !cur || el.scrollWidth <= el.clientWidth) return;
    el.scrollLeft = cur.offsetLeft - el.clientWidth / 2 + cur.offsetWidth / 2;
  }, [szakaszok, tomor]);
  const cta = kovetkezo && (() => {
    const tart = /* @__PURE__ */ jsxs(Fragment, { children: [
      kovetkezo.cta,
      /* @__PURE__ */ jsx(IcRight, {})
    ] });
    return kovetkezo.href ? renderLink({ href: kovetkezo.href, className: "bc-btn is-wrap", onClick: kovetkezo.onClick, children: tart }) : /* @__PURE__ */ jsx("button", { type: "button", className: "bc-btn is-wrap", onClick: kovetkezo.onClick, children: tart });
  })();
  const kesik = hatarido ? hatarido.kesik ?? hatarido.ora < 0 : false;
  const meta = (segito !== void 0 || hatarido) && /* @__PURE__ */ jsxs("div", { className: "bc-ut-meta", children: [
    segito ? /* @__PURE__ */ jsxs("p", { className: "bc-ut-segito", children: [
      segito.szerep,
      ":",
      " ",
      segito.href ? renderLink({ href: segito.href, className: "bc-ut-segito-link", children: segito.nev }) : /* @__PURE__ */ jsx("b", { children: segito.nev })
    ] }) : segito === null ? /* @__PURE__ */ jsx("p", { className: "bc-ut-segito is-missing", children: L.nincsSegito }) : null,
    hatarido && /* @__PURE__ */ jsxs("span", { className: cx("bc-badge", kesik ? "is-warning" : "is-info"), children: [
      hatarido.cimke ? `${hatarido.cimke}: ` : "",
      L.ido(hatarido.ora)
    ] }),
    kesik && /* @__PURE__ */ jsx("p", { className: "bc-ut-nyugi", children: segito ? L.kesesSegitovel : L.kesesSegitoNelkul })
  ] });
  const lepes = (children || kovetkezo || meta) && /* @__PURE__ */ jsxs(Fragment, { children: [
    children && /* @__PURE__ */ jsx("div", { className: "bc-ut-extra", children }),
    kovetkezo && /* @__PURE__ */ jsxs("div", { className: "bc-ut-next", children: [
      /* @__PURE__ */ jsx("p", { className: "bc-ut-next-text", children: kovetkezo.szoveg }),
      cta
    ] }),
    meta
  ] });
  if (!szakaszok.length) {
    return /* @__PURE__ */ jsxs("div", { className: cx("bc-ut", tomor && "is-tomor", "is-empty", className), children: [
      /* @__PURE__ */ jsx(EmptyState, { compact: true, title: L.uresCim, action: cta, children: L.uresSzoveg }),
      meta
    ] });
  }
  const keszPanel = mind && /* @__PURE__ */ jsxs("div", { className: "bc-ut-done", role: "status", children: [
    /* @__PURE__ */ jsx("p", { className: "bc-ut-done-title", children: L.keszCim }),
    /* @__PURE__ */ jsx("p", { className: "bc-ut-done-text", children: L.keszSzoveg })
  ] });
  if (tomor) {
    return /* @__PURE__ */ jsxs("div", { className: cx("bc-ut", "is-tomor", className), children: [
      /* @__PURE__ */ jsx("div", { ref: terkep, className: "bc-ut-map", role: "region", "aria-label": `${cimke} \u2013 ${L.gorgetheto}`, tabIndex: 0, children: /* @__PURE__ */ jsx("ol", { className: "bc-steps bc-ut-steps", "aria-label": cimke, children: szakaszok.map((s, i) => {
        const a = allapotOf(s, i);
        return /* @__PURE__ */ jsxs(
          "li",
          {
            className: `is-${a === "kesz" ? "done" : a === "most" ? "current" : a === "jon" ? "todo" : "skipped"}`,
            "aria-current": a === "most" ? "step" : void 0,
            children: [
              /* @__PURE__ */ jsx("b", { "aria-hidden": "true", children: /* @__PURE__ */ jsx(JelIkon, { allapot: a, n: i + 1 }) }),
              /* @__PURE__ */ jsx("span", { className: "bc-ut-step-label", title: s.cim, children: s.cim }),
              /* @__PURE__ */ jsxs("span", { className: "bc-sr", children: [
                " \u2013 ",
                L.allapot[a]
              ] })
            ]
          },
          s.kulcs
        );
      }) }) }),
      most ? /* @__PURE__ */ jsxs("div", { className: "bc-ut-now bc-anim-rise", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "bc-ut-kicker", children: L.mostItt(mostIdx + 1, szakaszok.length) }),
          /* @__PURE__ */ jsx(H, { className: "bc-ut-now-title", children: most.cim }),
          most.leiras && /* @__PURE__ */ jsx("p", { className: "bc-ut-desc", children: most.leiras })
        ] }),
        lepes
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        keszPanel,
        lepes && /* @__PURE__ */ jsx("div", { className: "bc-ut-now bc-anim-rise", children: lepes })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-ut", className), children: [
    /* @__PURE__ */ jsx("ol", { className: "bc-ut-list", "aria-label": cimke, children: szakaszok.map((s, i) => {
      const a = allapotOf(s, i);
      const d = a === "kesz" ? isoNap(s.datum) : "";
      return /* @__PURE__ */ jsxs("li", { className: `bc-ut-item is-${a}`, "aria-current": a === "most" ? "step" : void 0, children: [
        /* @__PURE__ */ jsx("span", { className: "bc-ut-mark", "aria-hidden": "true", children: /* @__PURE__ */ jsx(JelIkon, { allapot: a, n: i + 1 }) }),
        /* @__PURE__ */ jsxs("div", { className: "bc-ut-body", children: [
          /* @__PURE__ */ jsxs("div", { className: "bc-ut-head", children: [
            /* @__PURE__ */ jsx(H, { className: "bc-ut-title", children: s.cim }),
            /* @__PURE__ */ jsx("span", { className: cx("bc-badge", a === "kesz" ? "is-success" : a === "most" ? "is-accent" : "is-muted"), children: d ? `${L.jelveny.kesz} \xB7 ${d}` : L.jelveny[a] })
          ] }),
          s.leiras && /* @__PURE__ */ jsx("p", { className: "bc-ut-desc", children: s.leiras }),
          a === "most" && lepes && /* @__PURE__ */ jsx("div", { className: "bc-ut-now bc-anim-rise", children: lepes })
        ] })
      ] }, s.kulcs);
    }) }),
    !most && (keszPanel || lepes) && /* @__PURE__ */ jsxs("div", { className: "bc-ut-after", children: [
      keszPanel,
      lepes && /* @__PURE__ */ jsx("div", { className: "bc-ut-now bc-anim-rise", children: lepes })
    ] })
  ] });
}

export {
  hataridoSzoveg,
  UTVONAL_LABELS_HU,
  Utvonal
};
