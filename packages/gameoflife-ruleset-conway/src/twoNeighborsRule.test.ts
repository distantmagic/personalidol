import { twoNeighborsRule } from "./twoNeighborsRule";

test("each cell with two or three neighbors survives", function () {
  expect(twoNeighborsRule(1, 2)).toBe(1);
  expect(twoNeighborsRule(1, 3)).toBe(1);
  expect(twoNeighborsRule(1, 1)).toBe(0);
  expect(twoNeighborsRule(1, 4)).toBe(0);
});

test("cell state is preserved", function () {
  expect(twoNeighborsRule(0, 2)).toBe(0);
  expect(twoNeighborsRule(0, 3)).toBe(0);
});
