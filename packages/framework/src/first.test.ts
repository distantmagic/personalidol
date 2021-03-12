import { first } from "./first";

test("return the first item from set (first inserted) or null", function () {
  const set: Set<number> = new Set();

  expect(first(set)).toBe(null);

  set.add(1);
  set.add(2);
  set.add(3);

  expect(first(set)).toBe(1);
});
