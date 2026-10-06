/* beeco design system 1.46.2 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/sablon/print.ts
import { useEffect } from "react";
function usePrintFrame(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;
    const html = document.documentElement;
    html.classList.add("bc-print-page");
    let saved = null;
    const before = () => {
      if (saved) return;
      saved = { theme: html.getAttribute("data-theme"), dark: html.classList.contains("dark") };
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark");
    };
    const after = () => {
      if (!saved) return;
      if (saved.theme === null) html.removeAttribute("data-theme");
      else html.setAttribute("data-theme", saved.theme);
      html.classList.toggle("dark", saved.dark);
      saved = null;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      after();
      html.classList.remove("bc-print-page");
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [enabled]);
}

export {
  usePrintFrame
};
