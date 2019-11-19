// @flow

import Exception from "./Exception";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeEntityProperties from "./QuakeEntityProperties";
import QuakeEntityProperty from "./QuakeEntityProperty";

it("does not accept the same key more than once", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty("foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty("foo", "booz");

  return expect(function() {
    return new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);
  }).toThrow(Exception);
});

it("throws when property does not exist", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty("foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty("baz", "booz");
  const quakeEntityProperties = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);

  expect(quakeEntityProperties.hasPropertyKey("bar")).toBe(false);

  return expect(function() {
    quakeEntityProperties.getPropertyByKey("bar");
  }).toThrow(Exception);
});

it("finds property by key", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty("foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty("baz", "booz");
  const quakeEntityProperties = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);

  expect(quakeEntityProperties.hasPropertyKey("foo")).toBe(true);
  expect(quakeEntityProperties.getPropertyByKey("foo").getValue()).toBe("bar");
});

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty("foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty("baz", "booz");
  const quakeEntityProperties1 = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);
  const quakeEntityProperties2 = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty2, quakeEntityProperty1]);
  const quakeEntityProperties3 = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty2]);

  expect(quakeEntityProperties1.isEqual(quakeEntityProperties2)).toBe(true);
  expect(quakeEntityProperties2.isEqual(quakeEntityProperties1)).toBe(true);
  expect(quakeEntityProperties1.isEqual(quakeEntityProperties3)).toBe(false);
  expect(quakeEntityProperties3.isEqual(quakeEntityProperties1)).toBe(false);
});
