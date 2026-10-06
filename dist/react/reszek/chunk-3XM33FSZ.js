/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  VideoPlayer
} from "./chunk-ZR6R2R7U.js";
import {
  parseVideoUrl
} from "./chunk-D3EQXWN6.js";
import {
  HexLoader
} from "./chunk-5S5THYRY.js";
import {
  Button
} from "./chunk-CVRNQZIF.js";
import {
  cx
} from "./chunk-PG2ADDWU.js";

// react/src/kieg2/VideoEmbed.tsx
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function VideoEmbed({ source, title, className }) {
  const [on, setOn] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const frame = useRef(null);
  useEffect(() => {
    setOn(false);
    setLoaded(false);
    setSlow(false);
  }, [source.embedUrl]);
  useEffect(() => {
    if (!on || loaded) return;
    frame.current?.focus();
    const t = setTimeout(() => setSlow(true), 15e3);
    return () => clearTimeout(t);
  }, [on, loaded]);
  return /* @__PURE__ */ jsxs("figure", { className: cx("bc-video", "bc-vembed", className), "data-provider": source.kind, "data-state": on ? loaded ? "ready" : "loading" : "placeholder", children: [
    /* @__PURE__ */ jsx("div", { className: "bc-video-frame", children: on ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "iframe",
        {
          ref: frame,
          className: "bc-video-el",
          src: source.embedUrl,
          title: `${title} \u2013 ${source.provider}-vide\xF3`,
          onLoad: () => setLoaded(true),
          allow: "autoplay; encrypted-media; picture-in-picture; fullscreen",
          allowFullScreen: true,
          referrerPolicy: "strict-origin-when-cross-origin"
        }
      ),
      !loaded && /* @__PURE__ */ jsxs("div", { className: "bc-video-loading", role: "status", children: [
        /* @__PURE__ */ jsx(HexLoader, { label: "T\xF6lt\xF6m a lej\xE1tsz\xF3t" }),
        /* @__PURE__ */ jsx("span", { children: slow ? "Lassan t\xF6lt a lej\xE1tsz\xF3." : `T\xF6lt\xF6m a ${source.provider} lej\xE1tsz\xF3j\xE1t\u2026` }),
        slow && /* @__PURE__ */ jsxs("a", { className: "bc-btn is-secondary is-sm", href: source.watchUrl, target: "_blank", rel: "noopener noreferrer", children: [
          "Megnyit\xE1s: ",
          source.provider
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "bc-vembed-ph", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-badge is-muted", children: source.provider }),
      /* @__PURE__ */ jsx(
        Button,
        {
          size: "lg",
          onClick: () => setOn(true),
          "aria-describedby": `vembed-${source.id}`,
          icon: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z", fill: "currentColor" }) }),
          children: "Vide\xF3 bet\xF6lt\xE9se"
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "bc-vembed-note", id: `vembed-${source.id}`, children: [
        "Kattint\xE1sra a ",
        source.provider,
        " lej\xE1tsz\xF3ja t\xF6lt\u0151dik be, \xE9s a ",
        source.provider,
        " ekkor adatot (pl. s\xFCtit) t\xE1rolhat a g\xE9peden."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("figcaption", { className: "bc-video-cap", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-video-title", children: title }),
      /* @__PURE__ */ jsxs("a", { className: "bc-video-link", href: source.watchUrl, target: "_blank", rel: "noopener noreferrer", children: [
        "Megnyit\xE1s a ",
        source.provider,
        " oldal\xE1n",
        /* @__PURE__ */ jsx("span", { className: "bc-sr", children: " (\xFAj lapon)" })
      ] })
    ] })
  ] });
}
function VideoPreview({ url, title, poster, captions, className }) {
  const s = parseVideoUrl(url);
  if (s.kind === "empty") return /* @__PURE__ */ jsx("p", { className: cx("bc-video-empty", className), children: "M\xE9g nincs vide\xF3 \u2013 illeszd be a linket (YouTube, Vimeo vagy MP4/WebM)." });
  if (s.kind === "invalid") return /* @__PURE__ */ jsx("p", { className: cx("bc-alert is-warning", className), role: "alert", "data-reason": s.reason, children: /* @__PURE__ */ jsx("span", { children: s.message }) });
  if (s.kind === "file") return /* @__PURE__ */ jsx(VideoPlayer, { title, src: s.url, poster, captions, className });
  return /* @__PURE__ */ jsx(VideoEmbed, { source: s, title, className });
}

export {
  VideoEmbed,
  VideoPreview
};
