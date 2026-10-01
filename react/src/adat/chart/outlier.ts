import { fmt } from '../format';
import type { ChartData } from './types';

/**
 * Egy óriási kiugró érték (a legnagyobb > 4 × a második) a többit ellapítaná. Ilyenkor a tengely a második legnagyobbhoz igazodik,
 * a kiugró oszlop levágva, töréssel és a pontos számmal látszik, és a grafikon alatt szöveg is szól (az adattáblában pontos).
 */
export function findOutlier(values: Array<number | null>) {
  const nums = values.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => typeof x.v === 'number' && x.v > 0).sort((a, b) => b.v - a.v);
  if (nums.length < 4 || nums[1].v <= 0 || nums[0].v <= 4 * nums[1].v) return null;
  return { index: nums[0].i, value: nums[0].v, cap: nums[1].v * 1.25 };
}

export const outlierNote = (d: ChartData, o: { index: number; value: number }) =>
  `A(z) „${d.categories[o.index]}” értéke (${fmt(o.value, d.decimals ?? 0)} ${d.unit}) kilóg a skálából – levágva rajzoltam, hogy a többi is látsszon. A pontos szám az adattáblában van.`;
