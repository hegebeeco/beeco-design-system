/* beeco design system 1.52.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cimkeIgazitas,
  cimkeTordeles,
  radarPoligon,
  radarPont,
  tengelySzog
} from "./chunk-5364AEPC.js";
import {
  Marker
} from "./chunk-2XDPGPZH.js";
import {
  SegmentedControl
} from "./chunk-OMXYADDB.js";
import {
  EmptyState
} from "./chunk-FAPKDIIU.js";
import {
  useWidth
} from "./chunk-SFXSRWNV.js";
import {
  fmt
} from "./chunk-QIBUPNT2.js";
import {
  cx
} from "./chunk-UHO66ITM.js";

// react/src/csapat/KerekRadar.tsx
import { useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var KEREK_RADAR_LABELS_HU = {
  nezet: "N\xE9zet",
  kerek: "Ker\xE9k",
  tablazat: "T\xE1bl\xE1zat",
  jelmagyarazat: "Jelmagyar\xE1zat",
  skala: (max) => `Sk\xE1la: 0\u2013${fmt(max)} (k\xF6z\xE9pen 0, a k\xFCls\u0151 gy\u0171r\u0171 ${fmt(max)})`,
  lista: "Ter\xFCletek \u2013 v\xE1lassz a r\xE9szletekhez",
  terulet: "Ter\xFClet",
  valtozas: "V\xE1ltoz\xE1s",
  jelzes: "Jelz\xE9s",
  nincsAdat: "nincs adat",
  uj: "\xFAj",
  tengelyNev: (nev, ertek, elozo, valtozas) => [`${nev}: ${ertek}`, elozo !== void 0 ? `el\u0151z\u0151 ${elozo}` : "", valtozas ? `v\xE1ltoz\xE1s ${valtozas}` : ""].filter(Boolean).join(", "),
  tablaFelirat: (cim, max) => `${cim} \u2013 \xE9rt\xE9kek 0\u2013${fmt(max)} k\xF6z\xF6tt`,
  keves: "A ker\xE9khez legal\xE1bb 3 ter\xFClet kell \u2013 addig t\xE1bl\xE1zatban l\xE1tod.",
  sok: "12-n\xE9l t\xF6bb ter\xFClet a ker\xE9ken m\xE1r olvashatatlan \u2013 t\xE1bl\xE1zatban l\xE1tod.",
  uresCim: "M\xE9g nincs adat",
  uresSzoveg: "Amint lesznek \xE9rt\xE9kek, itt l\xE1tod a kereket.",
  betoltes: "Bet\xF6lt\xF6m a kereket\u2026"
};
var LH = 16;
var CH_S = 8.3;
var CH_XS = 7.1;
var vanSzam = (v) => typeof v === "number" && !Number.isNaN(v);
function KerekRadar({
  tengelyek,
  sorozatok,
  cim,
  kijelolt = null,
  onValaszt,
  max = 10,
  tizedes = 1,
  jelzes,
  nezet,
  onNezet,
  lista = true,
  tolt,
  uresTeendo,
  labels,
  className
}) {
  const L = { ...KEREK_RADAR_LABELS_HU, ...labels };
  const [sajatNezet, setSajatNezet] = useState(nezet ?? "kerek");
  const aktNezet = onNezet ? nezet ?? "kerek" : sajatNezet;
  const setNezet = (n2) => {
    if (onNezet) onNezet(n2);
    else setSajatNezet(n2);
  };
  const box = useRef(null);
  const mert = useWidth(box);
  const utolso = useRef(0);
  if (mert > 0) utolso.current = mert;
  const W = utolso.current;
  const cimkek = useRef([]);
  const [fokusz, setFokusz] = useState(0);
  const sor = sorozatok.slice(0, 2);
  const n = tengelyek.length;
  const ertek = (s, k) => {
    const v = s?.ertekek[k];
    return vanSzam(v) ? v : null;
  };
  const most = sor[0];
  const elozo = sor[1];
  const szam = (v) => v === null ? L.nincsAdat : fmt(v, tizedes);
  const delta = (k) => {
    if (!elozo) return null;
    const a = ertek(most, k), b = ertek(elozo, k);
    if (a === null) return { v: null, szoveg: "\u2013" };
    if (b === null) return { v: null, szoveg: L.uj };
    const d = Math.round((a - b) * 10 ** tizedes) / 10 ** tizedes;
    return { v: d, szoveg: d === 0 ? "\xB10" : `${d > 0 ? "+" : "\u2212"}${fmt(Math.abs(d), tizedes)}` };
  };
  const ures = !n || !sor.some((s) => tengelyek.some((t) => ertek(s, t.kulcs) !== null));
  const csakTabla = n > 0 && (n < 3 || n > 12);
  const mutat = csakTabla ? "tablazat" : aktNezet;
  const valaszthato = Boolean(onValaszt);
  const Delta = ({ k }) => {
    const d = delta(k);
    if (!d) return null;
    return /* @__PURE__ */ jsx("span", { className: cx("bc-kerek-delta", d.v !== null && d.v > 0 && "is-fel", d.v !== null && d.v < 0 && "is-le"), children: d.szoveg });
  };
  if (tolt) {
    return /* @__PURE__ */ jsx("div", { className: cx("bc-kerek", className), "aria-busy": "true", children: /* @__PURE__ */ jsxs("div", { className: "bc-state", role: "status", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-spinner", "aria-hidden": "true" }),
      " ",
      L.betoltes
    ] }) });
  }
  if (ures) {
    return /* @__PURE__ */ jsx("div", { className: cx("bc-kerek", "is-empty", className), children: /* @__PURE__ */ jsx(EmptyState, { compact: true, title: L.uresCim, action: uresTeendo, children: L.uresSzoveg }) });
  }
  const keskeny = W < 400;
  const CH = keskeny ? CH_XS : CH_S;
  const oldal = Math.round(Math.min(136, Math.max(keskeny ? 70 : 96, W * 0.24)));
  const R = Math.max(52, Math.min(170, W / 2 - oldal - 8));
  const pad = 3 * LH + LH + 10;
  const H = Math.round(2 * R + 2 * pad);
  const cxp = W / 2, cyp = H / 2;
  const opts = { cx: cxp, cy: cyp, r: R, max };
  const gyuruk = [0.25, 0.5, 0.75, 1];
  const onCimkeKey = (e, i) => {
    const lep = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let uj = lep ? (i + lep + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
    if (uj !== null) {
      e.preventDefault();
      setFokusz(uj);
      cimkek.current[uj]?.focus();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onValaszt?.(tengelyek[i].kulcs);
    }
  };
  const tabStop = Math.max(0, kijelolt ? tengelyek.findIndex((t) => t.kulcs === kijelolt) : fokusz);
  const rajz = W > 0 && /* @__PURE__ */ jsxs("svg", { className: cx("bc-kerek-svg", keskeny && "is-keskeny"), width: W, height: H, viewBox: `0 0 ${W} ${H}`, role: "group", "aria-label": cim, children: [
    /* @__PURE__ */ jsxs("g", { "aria-hidden": "true", children: [
      gyuruk.map((g) => /* @__PURE__ */ jsx("polygon", { className: cx("bc-kerek-gyuru", g === 1 && "is-kulso"), points: radarPoligon(Array(n).fill(g * max), opts) }, g)),
      tengelyek.map((t, i) => {
        const p = radarPont(i, n, max, opts);
        return /* @__PURE__ */ jsx("line", { className: cx("bc-kerek-kullo", t.kulcs === kijelolt && "is-on"), x1: cxp, y1: cyp, x2: p.x, y2: p.y }, t.kulcs);
      }),
      sor.map((s, si) => {
        const ert = tengelyek.map((t) => ertek(s, t.kulcs));
        const db = ert.filter((v) => v !== null).length;
        const pts = radarPoligon(ert, opts);
        return /* @__PURE__ */ jsxs("g", { className: cx("bc-kerek-sor", `bc-s${si + 1}`, si === 1 && "is-osszevet"), children: [
          db >= 3 && /* @__PURE__ */ jsx("polygon", { className: "bc-kerek-terulet-under", points: pts }),
          db >= 3 && /* @__PURE__ */ jsx("polygon", { className: "bc-kerek-terulet", points: pts }),
          db === 2 && /* @__PURE__ */ jsx("polyline", { className: "bc-kerek-terulet", points: pts }),
          ert.map((v, i) => {
            if (v === null) return null;
            const p = radarPont(i, n, v, opts);
            return /* @__PURE__ */ jsx(Marker, { x: p.x, y: p.y, i: si, r: tengelyek[i].kulcs === kijelolt ? 6.5 : 4.5 }, tengelyek[i].kulcs);
          })
        ] }, s.kulcs);
      })
    ] }),
    tengelyek.map((t, i) => {
      const igaz = cimkeIgazitas(i, n);
      const szog = tengelySzog(i, n);
      const p = radarPont(i, n, max, { ...opts, r: R + 12 });
      const fent = Math.sin(szog) < -0.5 && igaz === "middle";
      const lent = Math.sin(szog) > 0.5 && igaz === "middle";
      const szel = igaz === "middle" ? Math.min(2 * oldal, W - 16) : oldal - 6;
      const sorok = cimkeTordeles(t.nev, szel / CH, 3);
      const v = ertek(most, t.kulcs);
      const ertekSor = szam(v);
      const h = sorok.length * LH + LH;
      const y0 = fent ? p.y - 2 - h : lent ? p.y + 2 : p.y - h / 2;
      const sz = Math.max(...sorok.map((s) => s.length), ertekSor.length) * CH + 10;
      const rw = Math.max(48, sz), rh = Math.max(48, h + 6);
      const rx = igaz === "start" ? p.x - 5 : igaz === "end" ? p.x - rw + 5 : p.x - rw / 2;
      const ry = y0 + h / 2 - rh / 2;
      const on = t.kulcs === kijelolt;
      const d = delta(t.kulcs);
      const nev = L.tengelyNev(t.nev, ertekSor, elozo ? szam(ertek(elozo, t.kulcs)) : void 0, d?.szoveg);
      const int = valaszthato ? {
        role: "button",
        tabIndex: i === tabStop ? 0 : -1,
        "aria-pressed": on,
        "aria-label": nev,
        onClick: () => onValaszt?.(t.kulcs),
        onKeyDown: (e) => onCimkeKey(e, i),
        onFocus: () => setFokusz(i)
      } : { "aria-label": nev, role: "img" };
      return /* @__PURE__ */ jsxs("g", { ref: (el) => {
        cimkek.current[i] = el;
      }, className: cx("bc-kerek-cimke", on && "is-on", valaszthato && "is-valaszthato"), ...int, children: [
        /* @__PURE__ */ jsx("rect", { className: "bc-kerek-cimke-hatter", x: rx, y: ry, width: rw, height: rh, rx: 6 }),
        /* @__PURE__ */ jsxs("text", { textAnchor: igaz, "aria-hidden": "true", children: [
          sorok.map((s, k) => /* @__PURE__ */ jsx("tspan", { className: "bc-kerek-cimke-nev", x: p.x, y: y0 + 12 + k * LH, children: s }, k)),
          /* @__PURE__ */ jsx("tspan", { className: cx("bc-kerek-cimke-ertek", v === null && "is-nincs"), x: p.x, y: y0 + 12 + sorok.length * LH, children: ertekSor })
        ] })
      ] }, t.kulcs);
    })
  ] });
  const tablazat = /* @__PURE__ */ jsx("div", { className: "bc-table-wrap bc-kerek-tabla", tabIndex: 0, role: "region", "aria-label": L.tablaFelirat(cim, max), children: /* @__PURE__ */ jsxs("table", { className: "bc-table is-dense", children: [
    /* @__PURE__ */ jsx("caption", { className: "bc-sr", children: L.tablaFelirat(cim, max) }),
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { scope: "col", children: L.terulet }),
      sor.map((s) => /* @__PURE__ */ jsx("th", { scope: "col", className: "is-num", children: s.nev }, s.kulcs)),
      elozo && /* @__PURE__ */ jsx("th", { scope: "col", className: "is-num", children: L.valtozas }),
      jelzes && /* @__PURE__ */ jsx("th", { scope: "col", children: L.jelzes })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: tengelyek.map((t) => {
      const j = jelzes?.(ertek(most, t.kulcs));
      return /* @__PURE__ */ jsxs("tr", { "aria-current": t.kulcs === kijelolt ? "true" : void 0, className: cx(t.kulcs === kijelolt && "is-selected"), children: [
        /* @__PURE__ */ jsx("th", { scope: "row", children: valaszthato ? /* @__PURE__ */ jsx("button", { type: "button", className: "bc-kerek-sorgomb", "aria-pressed": t.kulcs === kijelolt, onClick: () => onValaszt?.(t.kulcs), children: t.nev }) : t.nev }),
        sor.map((s) => {
          const v = ertek(s, t.kulcs);
          return /* @__PURE__ */ jsx("td", { className: "is-num", children: v === null ? /* @__PURE__ */ jsx("span", { className: "bc-muted", children: L.nincsAdat }) : fmt(v, tizedes) }, s.kulcs);
        }),
        elozo && /* @__PURE__ */ jsx("td", { className: "is-num", children: /* @__PURE__ */ jsx(Delta, { k: t.kulcs }) }),
        jelzes && /* @__PURE__ */ jsx("td", { children: j ? /* @__PURE__ */ jsx("span", { className: cx("bc-badge", `is-${j.tone}`), children: j.szoveg }) : /* @__PURE__ */ jsx("span", { className: "bc-muted", children: L.nincsAdat }) })
      ] }, t.kulcs);
    }) })
  ] }) });
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-kerek", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-kerek-fej", children: [
      !csakTabla && /* @__PURE__ */ jsx(
        SegmentedControl,
        {
          label: L.nezet,
          value: mutat,
          onChange: setNezet,
          items: [{ value: "kerek", label: L.kerek }, { value: "tablazat", label: L.tablazat }]
        }
      ),
      /* @__PURE__ */ jsx("ul", { className: "bc-legend bc-kerek-jelmagyarazat", "aria-label": L.jelmagyarazat, children: sor.map((s, si) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("svg", { className: "bc-swatch", viewBox: "0 0 24 16", width: "24", height: "16", "aria-hidden": "true", children: /* @__PURE__ */ jsxs("g", { className: cx("bc-kerek-sor", `bc-s${si + 1}`, si === 1 && "is-osszevet"), children: [
          si === 0 ? /* @__PURE__ */ jsx("rect", { className: "bc-kerek-terulet", x: "2", y: "2", width: "20", height: "12", rx: "2" }) : /* @__PURE__ */ jsx("path", { className: "bc-kerek-terulet", d: "M1 8H23" }),
          /* @__PURE__ */ jsx(Marker, { x: 12, y: 8, i: si, r: 4 })
        ] }) }),
        s.nev
      ] }, s.kulcs)) })
    ] }),
    csakTabla && /* @__PURE__ */ jsx("p", { className: "bc-kerek-megj", children: n < 3 ? L.keves : L.sok }),
    !csakTabla && /* @__PURE__ */ jsxs("div", { className: cx("bc-kerek-test", !lista && "is-lista-nelkul"), hidden: mutat !== "kerek", children: [
      /* @__PURE__ */ jsxs("figure", { className: "bc-kerek-abra bc-chart", children: [
        /* @__PURE__ */ jsx("div", { ref: box, className: "bc-kerek-rajz", children: rajz }),
        /* @__PURE__ */ jsx("figcaption", { className: "bc-chart-note", children: L.skala(max) })
      ] }),
      lista && /* @__PURE__ */ jsx("ul", { className: "bc-kerek-lista", "aria-label": L.lista, children: tengelyek.map((t) => {
        const on = t.kulcs === kijelolt;
        const tart = /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "bc-kerek-lista-nev", children: t.nev }),
          /* @__PURE__ */ jsxs("span", { className: "bc-kerek-lista-szam", children: [
            /* @__PURE__ */ jsx("span", { className: cx(ertek(most, t.kulcs) === null && "is-nincs"), children: szam(ertek(most, t.kulcs)) }),
            /* @__PURE__ */ jsx(Delta, { k: t.kulcs })
          ] })
        ] });
        return /* @__PURE__ */ jsx("li", { children: valaszthato ? /* @__PURE__ */ jsx("button", { type: "button", className: cx("bc-kerek-lista-elem", on && "is-on"), "aria-pressed": on, onClick: () => onValaszt?.(t.kulcs), children: tart }) : /* @__PURE__ */ jsx("div", { className: "bc-kerek-lista-elem", children: tart }) }, t.kulcs);
      }) })
    ] }),
    mutat === "tablazat" && tablazat
  ] });
}

export {
  KEREK_RADAR_LABELS_HU,
  KerekRadar
};
