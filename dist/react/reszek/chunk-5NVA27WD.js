/* beeco design system 1.45.1 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */

// react/src/adat/chart/types.ts
var isGap = (d, i) => d.series.some((s) => !s.hidden && (s.values[i] === null || s.values[i] === void 0));
var hasGap = (d) => d.categories.some((_, i) => isGap(d, i));
var allValues = (d) => d.series.flatMap((s) => s.values.filter((v) => typeof v === "number"));
var visibleValues = (d) => d.series.filter((s) => !s.hidden).flatMap((s) => s.values.filter((v) => typeof v === "number"));
var paletteClass = (d) => d.palette === "allapot" ? "bc-pal-allapot" : void 0;
var isEmptyData = (d) => !d.categories.length || !allValues(d).length;

export {
  isGap,
  hasGap,
  allValues,
  visibleValues,
  paletteClass,
  isEmptyData
};
