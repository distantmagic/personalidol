// @flow

import combineWithoutRepetitions from "./combineWithoutRepetitions";

test("generates combinations", function() {
  const combinations = Array.from(combineWithoutRepetitions([1, 2, 3], 2));

  expect(combinations).toHaveLength(3);

  expect(combinations[0]).toEqual([1, 2]);
  expect(combinations[1]).toEqual([1, 3]);
  expect(combinations[2]).toEqual([2, 3]);
});
