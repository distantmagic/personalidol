import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeEntityProperty from "src/framework/classes/QuakeEntityProperty";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";

test("casts property to number", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty = new QuakeEntityProperty(loggerBreadcrumbs, "key", "5");

  expect(quakeEntityProperty.asNumber()).toBe(5);
});

test("fails when cannot cast to a number", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeEntityProperty = new QuakeEntityProperty(loggerBreadcrumbs, "key", "not a number");

  expect(function() {
    quakeEntityProperty.asNumber();
  }).toThrow(QuakeMapException);
});
