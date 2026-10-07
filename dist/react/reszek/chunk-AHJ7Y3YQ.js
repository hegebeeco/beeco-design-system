/* beeco design system 1.52.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  TextArea
} from "./chunk-CS4JUNGH.js";
import {
  cx
} from "./chunk-42HXLUBI.js";

// react/src/csapat/JelzoKartya.tsx
import { useId } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var JELZO_KARTYA_LABELS_HU = {
  jelzesKerdes: "Hogy \xE1ll most?",
  iranyKerdes: "Merre tart?",
  jelzesek: {
    zold: { cim: "Z\xF6ld", leiras: "J\xF3l megy" },
    sarga: { cim: "S\xE1rga", leiras: "D\xF6c\xF6g, van mit jav\xEDtani" },
    piros: { cim: "Piros", leiras: "Elakadt, seg\xEDts\xE9g kell" }
  },
  iranyok: { elore: "El\u0151re megy", helyben: "Helyben \xE1ll", hatra: "H\xE1trafel\xE9 cs\xFAszik" },
  szovegCim: "Mondan\xE1l p\xE1r sz\xF3t? (nem k\xF6telez\u0151, n\xE9v n\xE9lk\xFCl)",
  kotelezo: "k\xF6telez\u0151"
};
var JELZO_SZOVEG_MEZOK_HU = [
  { kulcs: "jo", cimke: "Mi megy j\xF3l?", sugo: "Egy-k\xE9t mondat arr\xF3l, ami ezen a ter\xFCleten m\u0171k\xF6dik. N\xE9v n\xE9lk\xFCl jelenik meg.", max: 280 },
  { kulcs: "akadaly", cimke: "Mi akad\xE1lyoz?", sugo: "Mi lass\xEDt vagy nehez\xEDt? Konkr\xE9t p\xE9lda sokat seg\xEDt. N\xE9v n\xE9lk\xFCl jelenik meg.", max: 280 },
  { kulcs: "vallalas", cimke: "Ezt tenn\xE9m meg", sugo: "Egy apr\xF3 l\xE9p\xE9s, amit te magad meg tudsz tenni. A vezet\u0151k l\xE1tj\xE1k, n\xE9v n\xE9lk\xFCl.", max: 280 }
];
var JELZESEK = ["zold", "sarga", "piros"];
var IRANYOK = ["elore", "helyben", "hatra"];
var TONE = { zold: "is-zold", sarga: "is-sarga", piros: "is-piros" };
var S = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
var JELZES_IKON = {
  zold: /* @__PURE__ */ jsxs("svg", { ...S, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { d: "M8 12.5l3 3 5-6" })
  ] }),
  sarga: /* @__PURE__ */ jsxs("svg", { ...S, children: [
    /* @__PURE__ */ jsx("path", { d: "M12 3.5L2.8 19.5h18.4z" }),
    /* @__PURE__ */ jsx("path", { d: "M12 10v4M12 16.8v.2" })
  ] }),
  piros: /* @__PURE__ */ jsxs("svg", { ...S, children: [
    /* @__PURE__ */ jsx("path", { d: "M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2z" }),
    /* @__PURE__ */ jsx("path", { d: "M9 9l6 6M15 9l-6 6" })
  ] })
};
var IRANY_IKON = {
  elore: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M7 17L17 7M9 7h8v8" }) }),
  helyben: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M4 12h16M14 6l6 6-6 6" }) }),
  hatra: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M7 7l10 10M17 9v8H9" }) })
};
function JelzoKartya({
  cim,
  leiras,
  cimSzint = 3,
  ertek,
  onValtozas,
  irany = true,
  szovegMezok = JELZO_SZOVEG_MEZOK_HU,
  szovegNyitva,
  hiba,
  kotelezo,
  disabled,
  labels,
  className
}) {
  const L = { ...JELZO_KARTYA_LABELS_HU, ...labels, jelzesek: { ...JELZO_KARTYA_LABELS_HU.jelzesek, ...labels?.jelzesek }, iranyok: { ...JELZO_KARTYA_LABELS_HU.iranyok, ...labels?.iranyok } };
  const id = useId();
  const H = `h${cimSzint}`;
  const szovegek = ertek.szovegek ?? {};
  const vanSzoveg = Object.values(szovegek).some((s) => s && s.trim());
  const set = (uj) => onValtozas({ ...ertek, ...uj });
  return /* @__PURE__ */ jsxs("div", { role: "group", className: cx("bc-jelzo", disabled && "is-disabled", hiba && "is-error", className), "aria-labelledby": `${id}-cim`, children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-jelzo-fej", children: [
      /* @__PURE__ */ jsx(H, { id: `${id}-cim`, className: "bc-jelzo-cim", children: cim }),
      leiras && /* @__PURE__ */ jsx("p", { className: "bc-jelzo-leiras", children: leiras })
    ] }),
    /* @__PURE__ */ jsxs("fieldset", { className: "bc-jelzo-csoport", disabled, "aria-invalid": hiba ? true : void 0, "aria-describedby": hiba ? `${id}-hiba` : void 0, children: [
      /* @__PURE__ */ jsxs("legend", { className: "bc-jelzo-kerdes", children: [
        L.jelzesKerdes,
        kotelezo && /* @__PURE__ */ jsx("span", { className: "is-req", "aria-hidden": "true", children: "*" }),
        kotelezo && /* @__PURE__ */ jsxs("span", { className: "bc-sr", children: [
          " (",
          L.kotelezo,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bc-jelzo-opciok", children: JELZESEK.map((j) => /* @__PURE__ */ jsxs("label", { className: cx("bc-jelzo-opcio", "is-nagy", TONE[j]), children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            className: "bc-jelzo-radio",
            name: `${id}-jelzes`,
            value: j,
            checked: ertek.jelzes === j,
            required: kotelezo,
            onChange: () => set({ jelzes: j })
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "bc-jelzo-ikon", children: JELZES_IKON[j] }),
        /* @__PURE__ */ jsxs("span", { className: "bc-jelzo-szoveg", children: [
          /* @__PURE__ */ jsx("span", { className: "bc-jelzo-opcio-cim", children: L.jelzesek[j].cim }),
          /* @__PURE__ */ jsx("span", { className: "bc-jelzo-opcio-leiras", children: L.jelzesek[j].leiras })
        ] })
      ] }, j)) }),
      hiba && /* @__PURE__ */ jsx("p", { className: "bc-error", id: `${id}-hiba`, role: "alert", children: hiba })
    ] }),
    irany && /* @__PURE__ */ jsxs("fieldset", { className: "bc-jelzo-csoport", disabled, children: [
      /* @__PURE__ */ jsx("legend", { className: "bc-jelzo-kerdes", children: L.iranyKerdes }),
      /* @__PURE__ */ jsx("div", { className: "bc-jelzo-opciok is-irany", children: IRANYOK.map((i) => /* @__PURE__ */ jsxs("label", { className: "bc-jelzo-opcio is-irany", children: [
        /* @__PURE__ */ jsx("input", { type: "radio", className: "bc-jelzo-radio", name: `${id}-irany`, value: i, checked: ertek.irany === i, onChange: () => set({ irany: i }) }),
        /* @__PURE__ */ jsx("span", { className: "bc-jelzo-ikon", children: IRANY_IKON[i] }),
        /* @__PURE__ */ jsx("span", { className: "bc-jelzo-opcio-cim", children: L.iranyok[i] })
      ] }, i)) })
    ] }),
    szovegMezok && szovegMezok.length > 0 && /* @__PURE__ */ jsxs("details", { className: "bc-jelzo-reszlet", open: szovegNyitva ?? vanSzoveg, children: [
      /* @__PURE__ */ jsx("summary", { className: "bc-jelzo-osszegzes", children: L.szovegCim }),
      /* @__PURE__ */ jsx("div", { className: "bc-jelzo-mezok", children: szovegMezok.map((m) => /* @__PURE__ */ jsx(
        TextArea,
        {
          label: m.cimke,
          help: m.sugo,
          rows: 2,
          maxLength: m.max ?? 280,
          disabled,
          value: szovegek[m.kulcs] ?? "",
          onChange: (e) => set({ szovegek: { ...szovegek, [m.kulcs]: e.target.value } })
        },
        m.kulcs
      )) })
    ] })
  ] });
}

export {
  JELZO_KARTYA_LABELS_HU,
  JELZO_SZOVEG_MEZOK_HU,
  JELZES_IKON,
  IRANY_IKON,
  JelzoKartya
};
