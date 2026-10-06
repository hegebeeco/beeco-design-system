/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  Clamp,
  CutContext
} from "./chunk-SVI5A7U3.js";
import {
  cx
} from "./chunk-MW6TFN7W.js";

// react/src/kieg/PreviewCard.tsx
import { useCallback, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Img = ({ src, empty }) => src ? /* @__PURE__ */ jsx("img", { className: "bc-pv-img", src, alt: "", loading: "lazy" }) : /* @__PURE__ */ jsx("div", { className: "bc-pv-img is-empty", children: /* @__PURE__ */ jsx("span", { children: empty }) });
var has = (v) => Boolean(v && v.trim());
function Full({ as: Tag = "p", className, placeholder, children }) {
  return has(children) ? /* @__PURE__ */ jsx(Tag, { className: cx("bc-pv-full", className), children: children.trim() }) : /* @__PURE__ */ jsx(Tag, { className: cx("bc-clamp is-placeholder", className), children: placeholder });
}
function Rows({ rows }) {
  const shown = rows.filter(([, v]) => v !== void 0 && v !== null && v !== "" && !(typeof v === "string" && !v.trim()));
  if (!shown.length) return null;
  return /* @__PURE__ */ jsx("dl", { className: "bc-pv-rows", children: shown.map(([k, v]) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("dt", { children: k }),
    /* @__PURE__ */ jsx("dd", { children: v })
  ] }, k)) });
}
var Featured = ({ on }) => on ? /* @__PURE__ */ jsx("span", { className: "bc-badge is-tag bc-pv-featured", children: "Kiemelt" }) : null;
function Partner(p) {
  return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card", children: [
    /* @__PURE__ */ jsx(Img, { src: p.imageUrl, empty: p.empty }),
    /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
      p.detail ? /* @__PURE__ */ jsx(Full, { as: "h3", placeholder: "Partner neve", className: "bc-pv-title", children: p.name }) : /* @__PURE__ */ jsx(Clamp, { k: "name", label: "A partner neve", lines: 1, as: "h3", placeholder: "Partner neve", className: "bc-pv-title", children: p.name }),
      p.category && /* @__PURE__ */ jsx("span", { className: "bc-badge is-accent bc-pv-badge", children: p.category }),
      p.detail ? /* @__PURE__ */ jsx(Full, { placeholder: "C\xEDm helye", className: "bc-pv-meta", children: p.address }) : /* @__PURE__ */ jsx(Clamp, { k: "address", label: "Az utcac\xEDm", lines: 1, placeholder: "C\xEDm helye", className: "bc-pv-meta", children: p.address }),
      p.detail ? /* @__PURE__ */ jsx(Full, { placeholder: "Itt jelenik meg a le\xEDr\xE1s.", className: "bc-pv-text", children: p.description }) : /* @__PURE__ */ jsx(Clamp, { k: "description", label: "A le\xEDr\xE1s", lines: 3, placeholder: "R\xF6vid le\xEDr\xE1s helye", className: "bc-pv-text", children: p.description })
    ] })
  ] });
}
function Coupon(p) {
  const media = /* @__PURE__ */ jsxs("div", { className: "bc-pv-media", children: [
    /* @__PURE__ */ jsx(Img, { src: p.imageUrl, empty: p.empty }),
    p.discount && /* @__PURE__ */ jsx("span", { className: "bc-pv-discount", children: p.discount }),
    /* @__PURE__ */ jsx(Featured, { on: p.featured })
  ] });
  if (p.detail) {
    return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card", children: [
      media,
      /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
        /* @__PURE__ */ jsx(Full, { placeholder: "Partner neve", className: "bc-pv-meta", children: p.partnerName }),
        /* @__PURE__ */ jsx(Full, { as: "h3", placeholder: "Kupon neve", className: "bc-pv-title", children: p.title }),
        has(p.subtitle) && /* @__PURE__ */ jsx("p", { className: "bc-pv-text bc-pv-full", children: p.subtitle.trim() }),
        p.descriptionRow !== false && /* @__PURE__ */ jsx(Full, { placeholder: "Itt jelenik meg a le\xEDr\xE1s.", className: "bc-pv-text", children: p.description }),
        /* @__PURE__ */ jsx(Rows, { rows: [["\xC9rv\xE9nyes", p.validity === false ? void 0 : p.validUntil], ["Tudnival\xF3k", p.terms], ["Kuponk\xF3d", p.code], ["\xC1r", p.price]] }),
        has(p.buttonText) && /* @__PURE__ */ jsx("span", { className: "bc-btn is-sm is-block bc-pv-btn", children: p.buttonText.trim() })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card", children: [
    media,
    /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
      /* @__PURE__ */ jsx(Clamp, { k: "partner", label: "A partner neve", lines: 1, placeholder: "Partner neve", className: "bc-pv-meta", children: p.partnerName }),
      /* @__PURE__ */ jsx(Clamp, { k: "title", label: "A kupon neve", lines: 2, as: "h3", placeholder: "Kupon neve", className: "bc-pv-title", children: p.title }),
      has(p.subtitle) && /* @__PURE__ */ jsx(Clamp, { k: "subtitle", label: "Az alc\xEDm", lines: 1, placeholder: "", className: "bc-pv-text", children: p.subtitle }),
      p.descriptionRow !== false && /* @__PURE__ */ jsx(Clamp, { k: "description", label: "A felt\xE9telek", lines: 2, placeholder: "Felt\xE9telek helye", className: "bc-pv-text", children: p.description }),
      p.validity !== false && /* @__PURE__ */ jsx("p", { className: "bc-pv-meta", children: p.validUntil ? `\xC9rv\xE9nyes: ${p.validUntil}` : "\xC9rv\xE9nyess\xE9g helye" }),
      has(p.price) && /* @__PURE__ */ jsx("p", { className: "bc-pv-meta", children: p.price })
    ] })
  ] });
}
function Notification(p) {
  const btn = p.buttonText !== void 0 && (p.detail ? has(p.buttonText) && /* @__PURE__ */ jsx("span", { className: "bc-btn is-sm is-block bc-pv-btn", children: p.buttonText.trim() }) : /* @__PURE__ */ jsx("span", { className: "bc-btn is-sm is-block bc-pv-btn", children: /* @__PURE__ */ jsx(Clamp, { k: "button", label: "A gomb felirata", lines: 1, as: "span", placeholder: "Gomb felirata", children: p.buttonText }) }));
  return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card is-message", children: [
    p.imageUrl !== void 0 && /* @__PURE__ */ jsx(Img, { src: p.imageUrl || void 0, empty: p.empty }),
    /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
      p.detail ? /* @__PURE__ */ jsx(Full, { as: "h3", placeholder: "Az \xE9rtes\xEDt\xE9s c\xEDme", className: "bc-pv-title", children: p.title }) : /* @__PURE__ */ jsx(Clamp, { k: "title", label: "A c\xEDm", lines: 2, as: "h3", placeholder: "Az \xE9rtes\xEDt\xE9s c\xEDme", className: "bc-pv-title", children: p.title }),
      p.detail ? /* @__PURE__ */ jsx(Full, { placeholder: "Az \xFCzenet sz\xF6vege", className: "bc-pv-text", children: p.body }) : /* @__PURE__ */ jsx(Clamp, { k: "body", label: "Az \xFCzenet", lines: 4, placeholder: "Az \xFCzenet sz\xF6vege", className: "bc-pv-text", children: p.body }),
      btn,
      p.detail && has(p.sendAt) && /* @__PURE__ */ jsxs("p", { className: "bc-pv-meta", children: [
        "Kik\xFCld\xE9s: ",
        p.sendAt
      ] })
    ] })
  ] });
}
function Education(p) {
  const meta = [p.topic, p.partnerName].filter(has).join(" \xB7 ");
  if (p.detail) {
    return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card", children: [
      /* @__PURE__ */ jsx(Img, { src: p.imageUrl, empty: p.empty }),
      /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
        (has(p.contentType) || has(p.topic)) && /* @__PURE__ */ jsxs("span", { className: "bc-pv-tags", children: [
          has(p.contentType) && /* @__PURE__ */ jsx("span", { className: "bc-badge is-tag", children: p.contentType }),
          has(p.topic) && /* @__PURE__ */ jsx("span", { className: "bc-badge is-tag", children: p.topic })
        ] }),
        /* @__PURE__ */ jsx(Full, { as: "h3", placeholder: "A tartalom c\xEDme", className: "bc-pv-title", children: p.title }),
        has(p.day) && /* @__PURE__ */ jsxs("p", { className: "bc-pv-meta", children: [
          "A napt\xE1rban: ",
          p.day
        ] }),
        /* @__PURE__ */ jsx(Full, { placeholder: "Itt jelenik meg a le\xEDr\xE1s.", className: "bc-pv-text", children: p.description }),
        /* @__PURE__ */ jsx(Rows, { rows: [["Forr\xE1s", p.source], ["Partner", p.partnerName]] })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card", children: [
    /* @__PURE__ */ jsx(Img, { src: p.imageUrl, empty: p.empty }),
    /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
      has(p.contentType) && /* @__PURE__ */ jsx("span", { className: "bc-badge is-tag bc-pv-badge", children: p.contentType }),
      /* @__PURE__ */ jsx(Clamp, { k: "title", label: "A c\xEDm", lines: 2, as: "h3", placeholder: "A tartalom c\xEDme", className: "bc-pv-title", children: p.title }),
      /* @__PURE__ */ jsx(Clamp, { k: "cardText", label: "A k\xE1rtyasz\xF6veg", lines: 3, placeholder: "K\xE1rtyasz\xF6veg helye", className: "bc-pv-text", children: has(p.cardText) ? p.cardText : p.description }),
      meta && /* @__PURE__ */ jsx(Clamp, { k: "meta", label: "A t\xE9mak\xF6r \xE9s a partner", lines: 1, placeholder: "", className: "bc-pv-meta", children: meta })
    ] })
  ] });
}
function Event(p) {
  const media = /* @__PURE__ */ jsxs("div", { className: "bc-pv-media", children: [
    /* @__PURE__ */ jsx(Img, { src: p.imageUrl, empty: p.empty }),
    /* @__PURE__ */ jsx(Featured, { on: p.featured })
  ] });
  if (p.detail) {
    return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card", children: [
      media,
      /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
        has(p.category) && /* @__PURE__ */ jsx("span", { className: "bc-badge is-tag bc-pv-badge", children: p.category }),
        /* @__PURE__ */ jsx(Full, { as: "h3", placeholder: "Az esem\xE9ny neve", className: "bc-pv-title", children: p.name }),
        /* @__PURE__ */ jsx(Rows, { rows: [["Kezd\xE9s", p.start || "\u2013"], ["Befejez\xE9s", p.end || "\u2013"], ["Helysz\xEDn", p.location || "\u2013"], ["R\xE9szv\xE9tel", p.fee], ["Szervez\u0151", p.organizers]] }),
        /* @__PURE__ */ jsx(Full, { placeholder: "Itt jelenik meg a le\xEDr\xE1s.", className: "bc-pv-text", children: p.description })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("article", { className: "bc-pv-card", children: [
    media,
    /* @__PURE__ */ jsxs("div", { className: "bc-pv-body", children: [
      /* @__PURE__ */ jsx("p", { className: cx("bc-pv-meta", !has(p.start) && "bc-clamp is-placeholder"), children: has(p.start) ? p.start : "Kezd\xE9s helye" }),
      /* @__PURE__ */ jsx(Clamp, { k: "name", label: "Az esem\xE9ny neve", lines: 2, as: "h3", placeholder: "Az esem\xE9ny neve", className: "bc-pv-title", children: p.name }),
      /* @__PURE__ */ jsx(Clamp, { k: "location", label: "A helysz\xEDn", lines: 1, placeholder: "Helysz\xEDn helye", className: "bc-pv-meta", children: p.location }),
      has(p.fee) && /* @__PURE__ */ jsx("span", { className: "bc-badge is-tag bc-pv-badge", children: p.fee })
    ] })
  ] });
}
var VIEW_NAME = { card: "k\xE1rtya", detail: "r\xE9szletek" };
var regionName = (d) => {
  const t = "title" in d ? d.title : "name" in d ? d.name : void 0;
  return t && t.trim() ? t.trim() : "El\u0151n\xE9zet";
};
function PreviewCard({ caption = "\xCDgy l\xE1tszik az appban", className, view = "card", aspect, emptyImageText = "Nincs k\xE9p", notes = true, ...data }) {
  const [cuts, setCuts] = useState({});
  const report = useCallback((key, label, lines, cut) => {
    setCuts((prev) => {
      if (Boolean(prev[key]) === cut) return prev;
      const next = { ...prev };
      if (cut) next[key] = { label, lines };
      else delete next[key];
      return next;
    });
  }, []);
  const detail = view === "detail";
  const list = Object.entries(cuts);
  const v = { detail, empty: emptyImageText };
  let body;
  if (data.variant === "partner") body = /* @__PURE__ */ jsx(Partner, { ...data, ...v });
  else if (data.variant === "kupon") body = /* @__PURE__ */ jsx(Coupon, { ...data, ...v });
  else if (data.variant === "edukacio") body = /* @__PURE__ */ jsx(Education, { ...data, ...v });
  else if (data.variant === "esemeny") body = /* @__PURE__ */ jsx(Event, { ...data, ...v });
  else body = /* @__PURE__ */ jsx(Notification, { ...data, ...v });
  const style = aspect !== void 0 ? { ["--pv-aspect"]: String(aspect) } : void 0;
  return /* @__PURE__ */ jsxs("figure", { className: cx("bc-preview", className), "data-variant": data.variant, "data-view": view, style, children: [
    /* @__PURE__ */ jsxs("div", { className: "bc-pv-phone", "aria-label": `${caption} (el\u0151n\xE9zet${detail ? ", r\xE9szletek" : ""})`, role: "group", children: [
      /* @__PURE__ */ jsx("div", { className: "bc-pv-notch", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cx("bc-pv-screen", detail && "is-scroll"),
          tabIndex: detail ? 0 : void 0,
          role: detail ? "region" : void 0,
          "aria-label": detail ? `${regionName(data)} \u2013 ${VIEW_NAME[view]}, g\xF6rgethet\u0151` : void 0,
          children: /* @__PURE__ */ jsx(CutContext.Provider, { value: report, children: body })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("figcaption", { className: "bc-pv-caption", children: [
      /* @__PURE__ */ jsx("span", { children: caption }),
      notes && /* @__PURE__ */ jsx("span", { className: "bc-pv-notes", role: "status", children: detail ? /* @__PURE__ */ jsx("span", { className: "bc-badge is-muted", children: "R\xE9szletek: a teljes sz\xF6veg l\xE1tszik" }) : list.length === 0 ? /* @__PURE__ */ jsx("span", { className: "bc-badge is-success", children: "Minden sz\xF6veg kif\xE9r" }) : list.map(([k, c]) => /* @__PURE__ */ jsxs("span", { className: "bc-badge is-warning", "data-cut": k, children: [
        c.label,
        " lev\xE1g\xF3dik: ",
        c.lines === 1 ? "1 sor" : `${c.lines} sor`,
        " f\xE9r el"
      ] }, k)) })
    ] })
  ] });
}

export {
  PreviewCard
};
