import { sumNeighbors } from "./sumNeighbors";

import type { Rule } from "./Rule.type";

function applyRules(rules: ReadonlyArray<Rule>, height: number, width: number, input: ReadonlyArray<number>, current: number, index: number): number {
  const neighborsSum = sumNeighbors(height, width, input, index);
  let result = current;

  for (let rule of rules) {
    result = rule(result, neighborsSum);
  }

  return result;
}

export function tick(rules: ReadonlyArray<Rule>, height: number, width: number, input: ReadonlyArray<number>): Array<number> {
  return input.map(function (current: number, index: number): number {
    return applyRules(rules, height, width, input, current, index);
  });
}
