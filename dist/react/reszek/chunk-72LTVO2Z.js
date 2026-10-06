/* beeco design system 1.48.0 – GENERÁLT FÁJL (tools/react-build.js), forrás: react/ */
import {
  fmt
} from "./chunk-674RCXSW.js";

// react/src/adat/chart/outlier.ts
function findOutlier(values) {
  const nums = values.map((v, i) => ({ v, i })).filter((x) => typeof x.v === "number" && x.v > 0).sort((a, b) => b.v - a.v);
  if (nums.length < 4 || nums[1].v <= 0 || nums[0].v <= 4 * nums[1].v) return null;
  return { index: nums[0].i, value: nums[0].v, cap: nums[1].v * 1.25 };
}
var outlierNote = (d, o) => `A(z) \u201E${d.categories[o.index]}\u201D \xE9rt\xE9ke (${fmt(o.value, d.decimals ?? 0)} ${d.unit}) kil\xF3g a sk\xE1l\xE1b\xF3l \u2013 lev\xE1gva rajzoltam, hogy a t\xF6bbi is l\xE1tsszon. A pontos sz\xE1m az adatt\xE1bl\xE1ban van.`;

export {
  findOutlier,
  outlierNote
};
