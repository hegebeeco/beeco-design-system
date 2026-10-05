/* beeco design system 1.43.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  cx
} from "./chunk-4NETF2NE.js";

// react/src/meh/motion.tsx
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function useReducedMotion() {
  const [r, setR] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setR(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}
function useCountUp(value, ms = 600) {
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [anim, setAnim] = useState(reduce ? null : 0);
  useEffect(() => {
    if (reduce || !first.current) {
      setAnim(null);
      return;
    }
    first.current = false;
    const t0 = performance.now();
    let raf = 0;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      setAnim(k < 1 ? value * (1 - Math.pow(1 - k, 3)) : null);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      setAnim(null);
    };
  }, [value, ms, reduce]);
  return anim ?? value;
}
function Stagger({ children, as: Tag = "div", className }) {
  return /* @__PURE__ */ jsx(Tag, { className: cx("bc-stagger", className), children: Children.map(children, (c, i) => isValidElement(c) ? cloneElement(c, { style: { ...c.props.style ?? {}, ["--i"]: i } }) : c) });
}
function celebrate(from) {
  if (typeof document === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = from?.getBoundingClientRect() ?? { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const box = document.createElement("div");
  box.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("i");
    p.className = "bc-hexpiece";
    const a = i / 14 * Math.PI * 2, d = 60 + i % 3 * 30;
    p.style.left = `${r.left + r.width / 2}px`;
    p.style.top = `${r.top + r.height / 2}px`;
    p.style.setProperty("--dx", `${Math.cos(a) * d}px`);
    p.style.setProperty("--dy", `${Math.sin(a) * d - 30}px`);
    p.style.setProperty("--rot", `${(i % 2 ? 1 : -1) * 120}deg`);
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 700);
}
function shake(el) {
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  el.classList.remove("bc-anim-shake");
  void el.offsetWidth;
  el.classList.add("bc-anim-shake");
  setTimeout(() => el.classList.remove("bc-anim-shake"), 300);
}
function HexLoader({ label = "T\xF6lt\xF6m" }) {
  return /* @__PURE__ */ jsxs("span", { className: "bc-hexload", role: "status", "aria-label": label, children: [
    /* @__PURE__ */ jsx("i", {}),
    /* @__PURE__ */ jsx("i", {}),
    /* @__PURE__ */ jsx("i", {})
  ] });
}
function ProgressBar({ value, label, moving }) {
  const v = Math.max(0, Math.min(1, value));
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cx("bc-progress", moving && v < 1 && "is-moving", v >= 1 && "is-done"),
      role: "progressbar",
      "aria-label": label,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(v * 100),
      style: { ["--v"]: v },
      children: /* @__PURE__ */ jsx("span", {})
    }
  );
}

export {
  useReducedMotion,
  useCountUp,
  Stagger,
  celebrate,
  shake,
  HexLoader,
  ProgressBar
};
