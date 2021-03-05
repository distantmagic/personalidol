import { unary } from "./unary";

test("taskes only one argument and ignores the rest", function () {
  const sum = function (a: number, b: number = 0) {
    return a + b;
  };

  // @ts-ignore: Expected 1 arguments, but got 2
  expect(unary(sum)(1, 5)).toBe(1);
});
