// @flow

import Debugger from "./Debugger";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

it("is mutable", function() {
  const breadcrumbs = new LoggerBreadcrumbs();
  const debug = new Debugger();

  debug.updateState(breadcrumbs, "test");

  expect(debug.getState().get(breadcrumbs)).toBe("test");
});
