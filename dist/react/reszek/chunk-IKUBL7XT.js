/* beeco design system – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  TooltipIconButton
} from "./chunk-LPUWHIAA.js";
import {
  CheckboxInput
} from "./chunk-7Y76TZ5Z.js";
import {
  TextArea
} from "./chunk-EA6XYHLF.js";
import {
  Button
} from "./chunk-ERIU5VPQ.js";
import {
  IcEdit,
  IcNew,
  IcSave,
  IcTrash,
  IcX
} from "./chunk-GQKKPGX5.js";
import {
  cx
} from "./chunk-PFNFGQD5.js";

// react/src/csapat/RetroVaszon.tsx
import { useEffect, useId, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var S = { viewBox: "0 0 24 24", width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
var IKON = {
  szel: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7" }) }),
  horgony: /* @__PURE__ */ jsxs("svg", { ...S, children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "5", r: "2" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7v14M8 11h8M5 14a7 7 0 0 0 14 0" })
  ] }),
  sziklak: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M2 20l6-11 4 6 3-4 7 9z" }) }),
  sziget: /* @__PURE__ */ jsx("svg", { ...S, children: /* @__PURE__ */ jsx("path", { d: "M6 21V4M6 4h11l-2.5 4L17 12H6" }) })
};
var RETRO_KERETEK = {
  vitorlas: {
    cim: "Vitorl\xE1s",
    leiras: "Mi visz el\u0151re, mi tart vissza, mire figyelj\xFCnk, \xE9s hova tartunk.",
    zonak: [
      { kulcs: "szel", cim: "Sz\xE9l", kerdes: "Mi visz el\u0151re?", ikon: IKON.szel },
      { kulcs: "horgony", cim: "Horgony", kerdes: "Mi tart vissza?", ikon: IKON.horgony },
      { kulcs: "sziklak", cim: "Szikl\xE1k", kerdes: "Milyen kock\xE1zatot l\xE1tsz?", ikon: IKON.sziklak },
      { kulcs: "sziget", cim: "Sziget", kerdes: "Hova tartunk?", ikon: IKON.sziget }
    ]
  },
  "4l": {
    cim: "4L",
    leiras: "Gyors, aszinkron k\xF6r n\xE9gy k\xE9rd\xE9ssel.",
    zonak: [
      { kulcs: "tetszett", cim: "Tetszett", kerdes: "Mi tetszett?" },
      { kulcs: "tanultunk", cim: "Tanultunk", kerdes: "Mit tanultunk?" },
      { kulcs: "hianyzott", cim: "Hi\xE1nyzott", kerdes: "Mi hi\xE1nyzott?" },
      { kulcs: "vagytunk", cim: "V\xE1gytunk", kerdes: "Mire v\xE1gytunk?" }
    ]
  },
  ssc: {
    cim: "Start\u2013Stop\u2013Folytasd",
    leiras: "Mit kezdj\xFCnk el, mit hagyjunk abba, mit folytassunk.",
    zonak: [
      { kulcs: "start", cim: "Start", kerdes: "Mit kezdj\xFCnk el?" },
      { kulcs: "stop", cim: "Stop", kerdes: "Mit hagyjunk abba?" },
      { kulcs: "folytat", cim: "Folytasd", kerdes: "Mit folytassunk?" }
    ]
  }
};
var RETRO_VASZON_LABELS_HU = {
  ujCetli: "Cetli ide",
  ujCetliMezo: (zona) => `\xDAj cetli \u2013 ${zona}`,
  ujSugo: "Egy gondolat, r\xF6viden. Ha bejel\xF6l\xF6d a \u201EN\xE9v n\xE9lk\xFCl\u201D-t, a neved nem jelenik meg.",
  anonim: "N\xE9v n\xE9lk\xFCl",
  felteszem: "Felteszem",
  megse: "M\xE9gse",
  mentes: "Ment\xE9s",
  szerkesztes: (s) => `Cetli szerkeszt\xE9se: ${s}`,
  szerkesztesMezo: "Cetli sz\xF6vege",
  torles: (s) => `Cetli t\xF6rl\xE9se: ${s}`,
  athelyezes: (s) => `\xC1thelyez\xE9s m\xE1sik z\xF3n\xE1ba: ${s}`,
  huzas: "H\xFAzd \xE1t egy m\xE1sik z\xF3n\xE1ba",
  nevNelkul: "N\xE9v n\xE9lk\xFCl",
  ismeretlen: "Ismeretlen",
  tied: "a ti\xE9d",
  ures: "M\xE9g \xFCres.",
  csakOlvashato: "Csak olvashat\xF3 \u2013 a retr\xF3 lez\xE1rult, a cetlik m\xE1r nem v\xE1ltoznak.",
  betoltes: "Bet\xF6lt\xF6m a cetliket\u2026",
  athelyezve: (z) => `\xC1thelyezve ide: ${z}`,
  db: (n) => `${n} cetli`,
  hibaUres: "\xCDrj legal\xE1bb egy sz\xF3t a cetlire."
};
function RetroVaszon({
  zonak,
  cetlik,
  onUj,
  onMozgat,
  onSzerkeszt,
  onTorol,
  moderator,
  csakOlvashato,
  tolt,
  maxHossz = 280,
  cimSzint = 3,
  nagy,
  labels,
  className
}) {
  const L = { ...RETRO_VASZON_LABELS_HU, ...labels };
  const id = useId();
  const H = `h${cimSzint}`;
  const [nyitott, setNyitott] = useState(null);
  const [uj, setUj] = useState("");
  const [anonim, setAnonim] = useState(false);
  const [hiba, setHiba] = useState();
  const [busy, setBusy] = useState(false);
  const [szerk, setSzerk] = useState(null);
  const [bemond, setBemond] = useState("");
  const [huz, setHuz] = useState(null);
  const huzRef = useRef(null);
  const zonaNev = (k) => zonak.find((z) => z.kulcs === k)?.cim ?? k;
  const kezelheto = (c) => !csakOlvashato && !tolt && Boolean(c.sajat || moderator);
  const mozgat = (cid, zona) => {
    onMozgat?.(cid, zona);
    setBemond(L.athelyezve(zonaNev(zona)));
  };
  useEffect(() => {
    if (!huz?.aktiv) return;
    const k = (e) => {
      if (e.key === "Escape") {
        huzRef.current = null;
        setHuz(null);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [huz?.aktiv]);
  const huzKezd = (e, cid) => {
    if (e.button !== 0 || !onMozgat) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    huzRef.current = { id: cid, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, aktiv: false, cel: null };
  };
  const huzMozog = (e) => {
    const h = huzRef.current;
    if (!h) return;
    const dx = e.clientX - h.x0, dy = e.clientY - h.y0;
    const aktiv = h.aktiv || Math.hypot(dx, dy) > 4;
    if (!aktiv) return;
    const alatt = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el instanceof HTMLElement && el.dataset.retroZona && el.closest(`[data-retro="${id}"]`));
    const kov = { ...h, dx, dy, aktiv, cel: alatt?.dataset.retroZona ?? null };
    huzRef.current = kov;
    setHuz(kov);
  };
  const huzVege = () => {
    const h = huzRef.current;
    huzRef.current = null;
    setHuz(null);
    if (!h?.aktiv || !h.cel) return;
    const c = cetlik.find((x) => x.id === h.id);
    if (c && c.zona !== h.cel) mozgat(h.id, h.cel);
  };
  const kuld = async (e, zona) => {
    e.preventDefault();
    if (!uj.trim()) {
      setHiba(L.hibaUres);
      return;
    }
    setBusy(true);
    const ok = await onUj?.(zona, uj.trim(), anonim);
    setBusy(false);
    if (ok === false) return;
    setUj("");
    setAnonim(false);
    setHiba(void 0);
    setNyitott(null);
  };
  const nyit = (zona) => {
    setNyitott(zona);
    setUj("");
    setHiba(void 0);
    setAnonim(false);
  };
  const irhato = !csakOlvashato && !tolt && Boolean(onUj);
  return /* @__PURE__ */ jsxs("div", { className: cx("bc-retro", nagy && "is-nagy", csakOlvashato && "is-readonly", huz?.aktiv && "is-huzas", className), "data-retro": id, "aria-busy": tolt || void 0, children: [
    csakOlvashato && /* @__PURE__ */ jsx("p", { className: "bc-retro-zarva", role: "note", children: L.csakOlvashato }),
    tolt && /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", children: L.betoltes }),
    /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", "aria-live": "polite", children: bemond }),
    /* @__PURE__ */ jsx("div", { className: cx("bc-retro-zonak", zonak.length === 3 && "is-harom"), children: zonak.map((z) => {
      const itt = cetlik.filter((c) => c.zona === z.kulcs);
      const zid = `${id}-z-${z.kulcs}`;
      return /* @__PURE__ */ jsxs("div", { role: "group", className: cx("bc-retro-zona", huz?.aktiv && huz.cel === z.kulcs && "is-cel"), "aria-labelledby": zid, "data-retro-zona": z.kulcs, children: [
        /* @__PURE__ */ jsxs("div", { className: "bc-retro-zona-fej", children: [
          /* @__PURE__ */ jsxs(H, { id: zid, className: "bc-retro-zona-cim", children: [
            z.ikon && /* @__PURE__ */ jsx("span", { className: "bc-retro-zona-ikon", children: z.ikon }),
            z.cim,
            /* @__PURE__ */ jsxs("span", { className: "bc-retro-db", children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: itt.length }),
              /* @__PURE__ */ jsx("span", { className: "bc-sr", children: L.db(itt.length) })
            ] })
          ] }),
          z.kerdes && /* @__PURE__ */ jsx("p", { className: "bc-retro-kerdes", children: z.kerdes })
        ] }),
        tolt ? /* @__PURE__ */ jsxs("div", { className: "bc-retro-cetlik", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("span", { className: "bc-skeleton bc-retro-skel" }),
          /* @__PURE__ */ jsx("span", { className: "bc-skeleton bc-retro-skel is-rovid" })
        ] }) : itt.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "bc-retro-cetlik", children: itt.map((c) => {
          const k = kezelheto(c);
          const h = huz?.id === c.id && huz.aktiv ? huz : null;
          const szerkeszt = szerk?.id === c.id;
          return /* @__PURE__ */ jsx(
            "li",
            {
              className: cx("bc-retro-cetli", c.sajat && "is-sajat", h && "is-huzott"),
              style: h ? { transform: `translate(${h.dx}px, ${h.dy}px) rotate(-1.5deg)` } : void 0,
              "data-cetli": c.id,
              children: szerkeszt ? /* @__PURE__ */ jsxs(
                "form",
                {
                  className: "bc-retro-urlap",
                  onSubmit: (e) => {
                    e.preventDefault();
                    if (szerk.szoveg.trim()) {
                      onSzerkeszt?.(c.id, szerk.szoveg.trim());
                      setSzerk(null);
                    }
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Escape") {
                      e.stopPropagation();
                      setSzerk(null);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      TextArea,
                      {
                        label: L.szerkesztesMezo,
                        help: L.ujSugo,
                        rows: 3,
                        maxLength: maxHossz,
                        autoFocus: true,
                        value: szerk.szoveg,
                        error: szerk.szoveg.trim() ? void 0 : L.hibaUres,
                        onChange: (e) => setSzerk({ id: c.id, szoveg: e.target.value })
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "bc-retro-gombok", children: [
                      /* @__PURE__ */ jsx(Button, { type: "submit", icon: /* @__PURE__ */ jsx(IcSave, {}), disabled: !szerk.szoveg.trim(), children: L.mentes }),
                      /* @__PURE__ */ jsx(Button, { variant: "ghost", icon: /* @__PURE__ */ jsx(IcX, {}), onClick: () => setSzerk(null), children: L.megse })
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "bc-retro-cetli-test", children: [
                  k && onMozgat && /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "bc-retro-fogo",
                      title: L.huzas,
                      "aria-hidden": "true",
                      onPointerDown: (e) => huzKezd(e, c.id),
                      onPointerMove: huzMozog,
                      onPointerUp: huzVege,
                      onPointerCancel: () => {
                        huzRef.current = null;
                        setHuz(null);
                      },
                      children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "currentColor", children: [
                        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "6", r: "1.6" }),
                        /* @__PURE__ */ jsx("circle", { cx: "15", cy: "6", r: "1.6" }),
                        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "12", r: "1.6" }),
                        /* @__PURE__ */ jsx("circle", { cx: "15", cy: "12", r: "1.6" }),
                        /* @__PURE__ */ jsx("circle", { cx: "9", cy: "18", r: "1.6" }),
                        /* @__PURE__ */ jsx("circle", { cx: "15", cy: "18", r: "1.6" })
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "bc-retro-szoveg", children: c.szoveg })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bc-retro-cetli-lab", children: [
                  /* @__PURE__ */ jsxs("span", { className: "bc-retro-szerzo", children: [
                    c.anonim ? L.nevNelkul : c.szerzo ?? L.ismeretlen,
                    c.sajat ? ` \xB7 ${L.tied}` : ""
                  ] }),
                  k && !nagy && /* @__PURE__ */ jsxs("span", { className: "bc-retro-muveletek", children: [
                    onMozgat && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("label", { className: "bc-sr", htmlFor: `${id}-m-${c.id}`, children: L.athelyezes(c.szoveg) }),
                      /* @__PURE__ */ jsx("select", { id: `${id}-m-${c.id}`, className: "bc-select bc-retro-mozgat", value: c.zona, onChange: (e) => mozgat(c.id, e.target.value), children: zonak.map((zz) => /* @__PURE__ */ jsx("option", { value: zz.kulcs, children: zz.cim }, zz.kulcs)) })
                    ] }),
                    onSzerkeszt && /* @__PURE__ */ jsx(TooltipIconButton, { label: L.szerkesztes(c.szoveg), onClick: () => setSzerk({ id: c.id, szoveg: c.szoveg }), children: /* @__PURE__ */ jsx(IcEdit, {}) }),
                    onTorol && /* @__PURE__ */ jsx(TooltipIconButton, { label: L.torles(c.szoveg), danger: true, onClick: () => onTorol(c.id), children: /* @__PURE__ */ jsx(IcTrash, {}) })
                  ] })
                ] })
              ] })
            },
            c.id
          );
        }) }) : /* @__PURE__ */ jsx("p", { className: "bc-retro-ures", children: L.ures }),
        irhato && !nagy && (nyitott === z.kulcs ? /* @__PURE__ */ jsxs(
          "form",
          {
            className: "bc-retro-urlap",
            onSubmit: (e) => kuld(e, z.kulcs),
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                setNyitott(null);
              }
            },
            children: [
              /* @__PURE__ */ jsx(
                TextArea,
                {
                  label: L.ujCetliMezo(z.cim),
                  help: L.ujSugo,
                  rows: 3,
                  maxLength: maxHossz,
                  autoFocus: true,
                  value: uj,
                  error: hiba,
                  onChange: (e) => {
                    setUj(e.target.value);
                    if (hiba && e.target.value.trim()) setHiba(void 0);
                  }
                }
              ),
              /* @__PURE__ */ jsxs("label", { className: "bc-check bc-retro-anonim", children: [
                /* @__PURE__ */ jsx(CheckboxInput, { checked: anonim, onChange: (e) => setAnonim(e.target.checked) }),
                L.anonim
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bc-retro-gombok", children: [
                /* @__PURE__ */ jsx(Button, { type: "submit", icon: /* @__PURE__ */ jsx(IcNew, {}), busy, children: L.felteszem }),
                /* @__PURE__ */ jsx(Button, { variant: "ghost", icon: /* @__PURE__ */ jsx(IcX, {}), onClick: () => setNyitott(null), children: L.megse })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsx(
          Button,
          {
            variant: "secondary",
            className: "bc-retro-uj",
            icon: /* @__PURE__ */ jsx(IcNew, {}),
            onClick: () => nyit(z.kulcs),
            "aria-label": `${L.ujCetli}: ${z.cim}`,
            children: L.ujCetli
          }
        ))
      ] }, z.kulcs);
    }) })
  ] });
}

export {
  RETRO_KERETEK,
  RETRO_VASZON_LABELS_HU,
  RetroVaszon
};
