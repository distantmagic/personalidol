import { roundToNearestMultiple } from "./roundToNearestMultiple";

test("rounds to the nearest multiple of number", function () {
  expect(roundToNearestMultiple(15, 35)).toBe(30);
  expect(roundToNearestMultiple(50, 195)).toBe(200);
  expect(roundToNearestMultiple(5, 1)).toBe(0);
});
