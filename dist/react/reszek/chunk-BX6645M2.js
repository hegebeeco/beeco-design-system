/* beeco design system 1.46.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  RerollForm
} from "./chunk-47FE5CFX.js";
import {
  DrawSpinner,
  WinnerCard
} from "./chunk-7CZC2M6O.js";
import {
  REVEAL_STEPS,
  cryptoIndex,
  drawTime,
  tickerNames,
  wait
} from "./chunk-ACRH7RBG.js";
import {
  BeeMoment
} from "./chunk-XNMTXE7K.js";
import {
  HexLoader,
  celebrate,
  useReducedMotion
} from "./chunk-HQI7T5A7.js";
import {
  formatHu
} from "./chunk-VIY7LMVS.js";
import {
  Button
} from "./chunk-LQIZVHIZ.js";
import {
  cx
} from "./chunk-MW6TFN7W.js";

// react/src/kieg2/PrizeDrawReveal.tsx
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PrizeDrawReveal({ prize, participants, draw, onDrawn, onReroll, excludePrevious = true, minReasonLength = 5, loading, className }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState("ready");
  const [step, setStep] = useState(-1);
  const [names, setNames] = useState([]);
  const [log, setLog] = useState([]);
  const [error, setError] = useState();
  const [animated, setAnimated] = useState(false);
  const alive = useRef(true);
  const heading = useRef(null);
  useEffect(() => () => {
    alive.current = false;
  }, []);
  const last = log[log.length - 1];
  const used = new Set(excludePrevious ? log.map((r) => r.winner.id) : []);
  const pool = participants.filter((p) => !used.has(p.id));
  const test = !draw;
  useEffect(() => {
    if (phase !== "won") return;
    heading.current?.focus();
    if (animated) celebrate(heading.current);
  }, [phase, animated, log.length]);
  const run = async (from, reason) => {
    if (!from.length) return;
    setError(void 0);
    setPhase("spinning");
    const instant = reduce || from.length === 1;
    const result = Promise.resolve().then(() => draw ? draw(from) : from[cryptoIndex(from.length)]);
    result.catch(() => void 0);
    if (!instant) {
      setNames(tickerNames(from, REVEAL_STEPS.length));
      for (let i = 0; i < REVEAL_STEPS.length; i++) {
        if (!alive.current) return;
        setStep(i);
        await wait(REVEAL_STEPS[i]);
      }
      setStep(REVEAL_STEPS.length);
    }
    let w;
    try {
      w = await result;
    } catch {
      if (alive.current) {
        setPhase("error");
        setError("Nem siker\xFClt a sorsol\xE1s \u2013 senki nem nyert, a r\xE9sztvev\u0151k nem v\xE1ltoztak. Pr\xF3b\xE1ld \xFAjra.");
      }
      return;
    }
    if (!alive.current) return;
    if (!from.some((p) => p.id === w.id)) {
      setPhase("error");
      setError("A sorsol\xF3 olyan nyertest adott, aki nincs a h\xFAzhat\xF3 r\xE9sztvev\u0151k k\xF6z\xF6tt \u2013 nem fogadtam el. Sz\xF3lj a fejleszt\u0151nek.");
      return;
    }
    const rec = { winner: w, at: /* @__PURE__ */ new Date(), attempt: log.length + 1, reason, test, poolSize: from.length };
    setLog((l) => [...l, rec]);
    setAnimated(!instant);
    setStep(-1);
    setPhase("won");
    onDrawn?.(rec);
  };
  const n = participants.length;
  return /* @__PURE__ */ jsxs("section", { className: cx("bc-draw", className), "aria-label": `Sorsol\xE1s: ${prize}`, children: [
    /* @__PURE__ */ jsxs("header", { className: "bc-draw-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "bc-draw-prize-label", children: "Nyerem\xE9ny" }),
        /* @__PURE__ */ jsx("h2", { className: "bc-draw-title", children: prize })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "bc-draw-count", "data-count": n, children: loading ? /* @__PURE__ */ jsx(HexLoader, { label: "T\xF6lt\xF6m a r\xE9sztvev\u0151ket" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("b", { children: formatHu(n, 0) }),
        " r\xE9sztvev\u0151"
      ] }) })
    ] }),
    test && /* @__PURE__ */ jsx("p", { className: "bc-alert is-warning bc-draw-testnote", role: "note", children: /* @__PURE__ */ jsxs("span", { children: [
      /* @__PURE__ */ jsx("b", { children: "Teszt-sorsol\xE1s:" }),
      " nincs bek\xF6tve a sorsol\xF3, ez\xE9rt a b\xF6ng\xE9sz\u0151 v\xE9letlenje h\xFAz. \xC9les nyertest \xEDgy ne hirdess."
    ] }) }),
    !loading && n === 0 && /* @__PURE__ */ jsx(BeeMoment, { inline: true, szerep: "piheno", poen: "M\xE9g nem z\xFCmm\xF6g itt senki.", sima: "M\xE9g nincs r\xE9sztvev\u0151 \u2013 ha valaki jelentkezik, itt sorsolhatsz." }),
    !loading && n === 1 && phase === "ready" && /* @__PURE__ */ jsx("p", { className: "bc-notice bc-draw-one", role: "note", children: "Egy r\xE9sztvev\u0151 van, ez\xE9rt a sorsol\xE1s biztosan \u0151t adja (felfed\xE9s n\xE9lk\xFCl)." }),
    phase === "spinning" && /* @__PURE__ */ jsx(DrawSpinner, { step, name: names[Math.min(Math.max(step, 0), names.length - 1)] ?? "", waiting: step >= REVEAL_STEPS.length }),
    (phase === "won" || phase === "reason") && last && /* @__PURE__ */ jsx(WinnerCard, { ref: heading, winner: last.winner, prize, test: last.test, attempt: last.attempt, animate: animated }),
    phase === "error" && /* @__PURE__ */ jsx("p", { className: "bc-alert is-danger", role: "alert", children: /* @__PURE__ */ jsx("span", { children: error }) }),
    /* @__PURE__ */ jsx("p", { className: "bc-sr", role: "status", children: phase === "spinning" ? "Sorsol\xE1s folyamatban\u2026" : phase === "won" && last ? `A nyertes: ${last.winner.name}` : "" }),
    phase === "reason" && last && /* @__PURE__ */ jsx(
      RerollForm,
      {
        previous: last.winner.name,
        minLength: minReasonLength,
        onCancel: () => setPhase("won"),
        onConfirm: (reason) => {
          onReroll?.({ previous: last.winner, reason });
          void run(pool, reason);
        }
      }
    ),
    phase !== "reason" && /* @__PURE__ */ jsxs("div", { className: "bc-draw-actions", children: [
      (phase === "ready" || phase === "spinning" || phase === "error" && !last) && /* @__PURE__ */ jsx(Button, { size: "lg", busy: phase === "spinning", disabled: loading || n === 0, onClick: () => void run(pool), children: phase === "error" ? "\xDAjrapr\xF3b\xE1l\xE1s" : "Sorsol\xE1s" }),
      (phase === "won" || phase === "error" && last) && /* @__PURE__ */ jsx(Button, { variant: "secondary", disabled: pool.length === 0, onClick: () => setPhase("reason"), children: "\xDAjrasorsol\xE1s" }),
      phase === "won" && pool.length === 0 && /* @__PURE__ */ jsx("p", { className: "bc-draw-hint", children: "Nincs t\xF6bb h\xFAzhat\xF3 r\xE9sztvev\u0151 \u2013 \xFAjrasorsolni nem lehet." }),
      n === 0 && !loading && /* @__PURE__ */ jsx("p", { className: "bc-draw-hint", children: "A \u201ESorsol\xE1s\u201D az els\u0151 r\xE9sztvev\u0151vel v\xE1lik el\xE9rhet\u0151v\xE9." })
    ] }),
    log.length > 0 && /* @__PURE__ */ jsxs("details", { className: "bc-draw-log", open: log.length > 1, children: [
      /* @__PURE__ */ jsxs("summary", { children: [
        "Jegyz\u0151k\xF6nyv (",
        log.length,
        " h\xFAz\xE1s)"
      ] }),
      /* @__PURE__ */ jsx("ol", { children: log.map((r) => /* @__PURE__ */ jsxs("li", { children: [
        /* @__PURE__ */ jsx("b", { children: r.winner.name }),
        " \u2013 ",
        drawTime(r.at),
        ", ",
        formatHu(r.poolSize, 0),
        " r\xE9sztvev\u0151b\u0151l",
        r.test ? " (teszt-sorsol\xE1s)" : "",
        r.reason && /* @__PURE__ */ jsxs(Fragment, { children: [
          " \xB7 \xFAjrasorsol\xE1s oka: \u201E",
          r.reason,
          "\u201D"
        ] })
      ] }, r.attempt)) })
    ] })
  ] });
}

export {
  PrizeDrawReveal
};
