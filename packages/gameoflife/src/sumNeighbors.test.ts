import { sumNeighbors } from "./sumNeighbors";

test("correctly sums neighbors", function () {
  // prettier-ignore
  const map = [
    0, 0, 0,
    1, 1, 1,
    0, 0, 0,
  ];

  expect(sumNeighbors(3, 3, map, 0)).toBe(2);
  expect(sumNeighbors(3, 3, map, 1)).toBe(3);
  expect(sumNeighbors(3, 3, map, 2)).toBe(2);
  expect(sumNeighbors(3, 3, map, 3)).toBe(1);
  expect(sumNeighbors(3, 3, map, 4)).toBe(2);
  expect(sumNeighbors(3, 3, map, 5)).toBe(1);
  expect(sumNeighbors(3, 3, map, 6)).toBe(2);
  expect(sumNeighbors(3, 3, map, 7)).toBe(3);
  expect(sumNeighbors(3, 3, map, 8)).toBe(2);
});
