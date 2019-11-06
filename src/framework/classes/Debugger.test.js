// @flow

import Debugger from "./Debugger";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

it("can be turned on and off", function() {
  const debug = new Debugger();

  expect(debug.isEnabled()).toBe(false);

  debug.setIsEnabled(true);

  expect(debug.isEnabled()).toBe(true);
});

it("is mutable", function() {
  const breadcrumbs = new LoggerBreadcrumbs();
  const debug = new Debugger();

  debug.updateState(breadcrumbs, "test");

  expect(debug.getState().get(breadcrumbs)).toBe("test");
});

it("removes state", function() {
  const breadcrumbs = new LoggerBreadcrumbs();
  const debug = new Debugger();

  debug.updateState(breadcrumbs, "test");

  expect(debug.getState().get(breadcrumbs)).toBe("test");

  debug.deleteState(breadcrumbs);

  expect(debug.getState().has(breadcrumbs)).toBe(false);
});
