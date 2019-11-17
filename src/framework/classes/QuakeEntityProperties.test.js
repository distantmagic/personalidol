// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeEntityProperties from "./QuakeEntityProperties";
import QuakeEntityProperty from "./QuakeEntityProperty";

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty("foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty("baz", "booz");
  const quakeEntityProperties1 = new QuakeEntityProperties(loggerBreadcrumbs, [
    quakeEntityProperty1,
    quakeEntityProperty2,
  ]);
  const quakeEntityProperties2 = new QuakeEntityProperties(loggerBreadcrumbs, [
    quakeEntityProperty2,
    quakeEntityProperty1,
  ]);
  const quakeEntityProperties3 = new QuakeEntityProperties(loggerBreadcrumbs, [
    quakeEntityProperty2,
    quakeEntityProperty2,
  ]);

  expect(quakeEntityProperties1.isEqual(quakeEntityProperties2)).toBe(true);
  expect(quakeEntityProperties2.isEqual(quakeEntityProperties1)).toBe(true);
  expect(quakeEntityProperties1.isEqual(quakeEntityProperties3)).toBe(false);
  expect(quakeEntityProperties3.isEqual(quakeEntityProperties1)).toBe(false);
});
