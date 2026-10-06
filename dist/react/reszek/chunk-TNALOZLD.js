/* beeco design system 1.48.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  BeeMoment
} from "./chunk-BM56AYJ7.js";
import {
  HexLoader
} from "./chunk-ZDDDXMYL.js";
import {
  Button
} from "./chunk-K7H75UN6.js";
import {
  cx
} from "./chunk-5U262HSQ.js";

// react/src/kieg2/VideoPlayer.tsx
import { useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var ERR = {
  2: "A vide\xF3 nem t\xF6lt\u0151d\xF6tt le (h\xE1l\xF3zati hiba). Ellen\u0151rizd a kapcsolatot, \xE9s pr\xF3b\xE1ld \xFAjra.",
  3: "A vide\xF3f\xE1jl s\xE9r\xFClt, nem lehet lej\xE1tszani. T\xF6ltsd fel \xFAjra.",
  4: "Ezt a vide\xF3t a b\xF6ng\xE9sz\u0151 nem tudja lej\xE1tszani (rossz vagy nem t\xE1mogatott form\xE1tum). Export\xE1ld \xFAjra MP4 (H.264) form\xE1tumban, \xE9s t\xF6ltsd fel \xFAjra."
};
var SEEK = 5;
function VideoPlayer({ title, src, poster, captions = [], warnNoCaptions = true, onError, className }) {
  const video = useRef(null);
  const [state, setState] = useState("loading");
  const [code, setCode] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [said, setSaid] = useState("");
  const onKey = (e) => {
    const v = e.currentTarget;
    const k = e.key.toLowerCase();
    if (k === "k") {
      if (v.paused) void v.play().catch(() => void 0);
      else v.pause();
    } else if (k === "arrowleft" || k === "arrowright") {
      v.currentTime = Math.max(0, v.currentTime + (k === "arrowleft" ? -SEEK : SEEK));
      setSaid(`${k === "arrowleft" ? "Vissza" : "El\u0151re"} ${SEEK} m\xE1sodperc`);
    } else if (k === "m") {
      v.muted = !v.muted;
      setSaid(v.muted ? "N\xE9m\xEDtva" : "Hang bekapcsolva");
    } else return;
    e.preventDefault();
  };
  const showLoading = !src || state === "loading";
  return /* @__PURE__ */ jsxs("figure", { className: cx("bc-video", className), "data-state": src ? state : "loading", children: [
    /* @__PURE__ */ jsx("div", { className: "bc-video-frame", children: state === "error" ? /* @__PURE__ */ jsx(
      BeeMoment,
      {
        inline: true,
        live: "alert",
        szerep: "gondolkodo",
        sima: ERR[code] ?? "A vide\xF3 nem j\xE1tszhat\xF3 le. Pr\xF3b\xE1ld \xFAjra, vagy t\xF6ltsd fel \xFAjra a f\xE1jlt.",
        action: /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", onClick: () => {
          setState("loading");
          setAttempt((n) => n + 1);
        }, children: "\xDAjrapr\xF3b\xE1l\xE1s" })
      }
    ) : /* @__PURE__ */ jsxs(Fragment, { children: [
      src && /* @__PURE__ */ jsx(
        "video",
        {
          ref: video,
          className: "bc-video-el",
          controls: true,
          preload: "metadata",
          playsInline: true,
          tabIndex: 0,
          poster,
          src,
          "aria-label": title,
          onLoadedMetadata: () => setState("ready"),
          onCanPlay: () => setState("ready"),
          onPlay: () => setSaid("Lej\xE1tsz\xE1s"),
          onPause: () => setSaid("Sz\xFCnet"),
          onError: (e) => {
            const c = e.currentTarget.error?.code ?? 0;
            setCode(c);
            setState("error");
            onError?.(c);
          },
          onKeyDown: onKey,
          children: captions.map((t) => /* @__PURE__ */ jsx("track", { kind: "captions", src: t.src, srcLang: t.srclang, label: t.label, default: t.default }, t.src))
        },
        `${src}#${attempt}`
      ),
      showLoading && /* @__PURE__ */ jsxs("div", { className: "bc-video-loading", role: "status", children: [
        /* @__PURE__ */ jsx(HexLoader, { label: "T\xF6lt\xF6m a vide\xF3t" }),
        /* @__PURE__ */ jsx("span", { children: "T\xF6lt\xF6m a vide\xF3t\u2026" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("figcaption", { className: "bc-video-cap", children: [
      /* @__PURE__ */ jsx("span", { className: "bc-video-title", children: title }),
      src && state !== "error" && /* @__PURE__ */ jsx("span", { className: "bc-video-keys", children: "Billenty\u0171k: Sz\xF3k\xF6z vagy K \u2013 lej\xE1tsz\xE1s/sz\xFCnet \xB7 \u2190/\u2192 \u2013 5 mp \xB7 M \u2013 n\xE9m\xEDt\xE1s" }),
      warnNoCaptions && !captions.length && state !== "error" && /* @__PURE__ */ jsx("span", { className: "bc-video-nocc", children: "Ehhez a vide\xF3hoz nincs felirat \u2013 t\xF6lts fel egy .vtt feliratf\xE1jlt, hogy hang n\xE9lk\xFCl is \xE9rthet\u0151 legyen." })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", children: said })
  ] });
}

export {
  VideoPlayer
};
