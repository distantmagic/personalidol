import { getRouterCallback } from "./getRouterCallback";

test("ensures that route is set", function () {
  const routes = {
    test(foo: string) {},
  };

  expect(getRouterCallback(routes, "test")).toBe(routes.test);
});

test("throws user friendly error message if route is not set", function () {
  const routes = {
    test(foo: string) {},
  };

  expect(function () {
    // @ts-ignore - we are testing the runtime behavior
    getRouterCallback(routes, "bar");
  }).toThrow(`Available keys are: "test"`);
});
