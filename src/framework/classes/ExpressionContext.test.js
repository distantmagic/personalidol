// @flow

import Expression from "./Expression";
import ExpressionContext from "./ExpressionContext";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import UnexpectedOverride from "./Exception/UnexpectedOverride";

test("is immutable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs);
  const updated = context.set("foo", "bar");

  expect(context).not.toBe(updated);
  expect(context.has("foo")).toBeFalsy();
});

test("cannot override values", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const context = new ExpressionContext(loggerBreadcrumbs);

  expect(function() {
    context.set("foo", "bar").set("foo", "baz");
  }).toThrow(UnexpectedOverride);
});
