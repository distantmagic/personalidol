import { threeNeighborsRule } from "./threeNeighborsRule";

test("each cell with three neighbors becomes populated", function () {
  expect(threeNeighborsRule(0, 3)).toBe(1);
  expect(threeNeighborsRule(1, 3)).toBe(1);
});

test("cell state is preserved", function () {
  expect(threeNeighborsRule(0, 2)).toBe(0);
  expect(threeNeighborsRule(1, 2)).toBe(1);
  expect(threeNeighborsRule(0, 4)).toBe(0);
  expect(threeNeighborsRule(1, 4)).toBe(1);
});
