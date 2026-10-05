/* beeco design system 1.45.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/marka/evszak.ts
function evszak(d = /* @__PURE__ */ new Date()) {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return "tavasz";
  if (m >= 6 && m <= 8) return "nyar";
  if (m >= 9 && m <= 11) return "osz";
  return "tel";
}

export {
  evszak
};
