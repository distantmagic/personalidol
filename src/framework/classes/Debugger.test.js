// @flow

import Debugger from "./Debugger";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

test("can be turned on and off", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const debug = new Debugger(loggerBreadcrumbs);

  expect(debug.isEnabled()).toBe(false);

  debug.setIsEnabled(true);

  expect(debug.isEnabled()).toBe(true);
});

test("is mutable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const debug = new Debugger(loggerBreadcrumbs);

  debug.updateState(loggerBreadcrumbs, "test");

  expect(debug.getState().get(loggerBreadcrumbs)).toBe("test");
});

test("removes state", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const debug = new Debugger(loggerBreadcrumbs);

  debug.updateState(loggerBreadcrumbs, "test");

  expect(debug.getState().get(loggerBreadcrumbs)).toBe("test");

  debug.deleteState(loggerBreadcrumbs);

  expect(debug.getState().has(loggerBreadcrumbs)).toBe(false);
});
