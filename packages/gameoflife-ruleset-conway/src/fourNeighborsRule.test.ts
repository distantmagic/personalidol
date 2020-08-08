import { fourNeighborsRule } from "./fourNeighborsRule";

test("each cell with four or more neighbors dies, as if by overpopulation", function () {
  expect(fourNeighborsRule(1, 4)).toBe(0);
});

test("cell state is preserved", function () {
  expect(fourNeighborsRule(1, 3)).toBe(1);
  expect(fourNeighborsRule(0, 3)).toBe(0);
});
