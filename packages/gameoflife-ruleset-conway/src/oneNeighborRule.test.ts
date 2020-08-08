import { oneNeighborRule } from "./oneNeighborRule";

test("each cell with one or no neighbors dies, as if by solitude, function", function () {
  expect(oneNeighborRule(1, 1)).toBe(0);
  expect(oneNeighborRule(1, 0)).toBe(0);
});

test("cell state is preserved", function () {
  expect(oneNeighborRule(1, 3)).toBe(1);
  expect(oneNeighborRule(0, 3)).toBe(0);
});
