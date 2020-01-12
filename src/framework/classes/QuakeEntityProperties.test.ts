import Exception from "src/framework/classes/Exception";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeEntityProperties from "src/framework/classes/QuakeEntityProperties";
import QuakeEntityProperty from "src/framework/classes/QuakeEntityProperty";

test("does not accept the same key more than once", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty(loggerBreadcrumbs, "foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty(loggerBreadcrumbs, "foo", "booz");

  return expect(function() {
    return new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);
  }).toThrow(Exception);
});

test("throws when property does not exist", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty(loggerBreadcrumbs, "foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty(loggerBreadcrumbs, "baz", "booz");
  const quakeEntityProperties = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);

  expect(quakeEntityProperties.hasPropertyKey("bar")).toBe(false);

  return expect(function() {
    quakeEntityProperties.getPropertyByKey("bar");
  }).toThrow(Exception);
});

test("finds property by key", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty(loggerBreadcrumbs, "foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty(loggerBreadcrumbs, "baz", "booz");
  const quakeEntityProperties = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);

  expect(quakeEntityProperties.hasPropertyKey("foo")).toBe(true);
  expect(quakeEntityProperties.getPropertyByKey("foo").getValue()).toBe("bar");
});

test("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty1 = new QuakeEntityProperty(loggerBreadcrumbs, "foo", "bar");
  const quakeEntityProperty2 = new QuakeEntityProperty(loggerBreadcrumbs, "baz", "booz");
  const quakeEntityProperties1 = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty1, quakeEntityProperty2]);
  const quakeEntityProperties2 = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty2, quakeEntityProperty1]);
  const quakeEntityProperties3 = new QuakeEntityProperties(loggerBreadcrumbs, [quakeEntityProperty2]);

  expect(quakeEntityProperties1.isEqual(quakeEntityProperties2)).toBe(true);
  expect(quakeEntityProperties2.isEqual(quakeEntityProperties1)).toBe(true);
  expect(quakeEntityProperties1.isEqual(quakeEntityProperties3)).toBe(false);
  expect(quakeEntityProperties3.isEqual(quakeEntityProperties1)).toBe(false);
});
