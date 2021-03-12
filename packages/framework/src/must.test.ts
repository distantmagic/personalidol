import { must } from "./must";

test("passes through element if it is set", function () {
  expect(must(5)).toBe(5);
});

test("fails when element is not set", function () {
  expect(function () {
    must(null);
  }).toThrow();
});
