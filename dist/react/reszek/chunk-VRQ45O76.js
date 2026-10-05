/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/inputs/mergeRefs.ts
function mergeRefs(...refs) {
  return (el) => {
    for (const r of refs) {
      if (typeof r === "function") r(el);
      else if (r) r.current = el;
    }
  };
}

export {
  mergeRefs
};
