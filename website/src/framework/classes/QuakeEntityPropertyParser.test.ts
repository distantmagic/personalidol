import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeEntityProperty from "src/framework/classes/QuakeEntityProperty";
import QuakeEntityPropertyParser from "src/framework/classes/QuakeEntityPropertyParser";

test.each([
  ['    "foo" "bar\\"baz\\"booz"', "foo", 'bar"baz"booz'],
  ['"origin" "-32 -32 40"', "origin", "-32 -32 40"],
])("processes brush entity string '%p'", function (line, expectedKey, expectedValue) {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const parser = new QuakeEntityPropertyParser(loggerBreadcrumbs, line);
  const entityProperty = parser.parse();
  const correct = new QuakeEntityProperty(loggerBreadcrumbs, expectedKey, expectedValue);

  expect(entityProperty.getKey()).toBe(correct.getKey());
  expect(entityProperty.getValue()).toBe(correct.getValue());
  expect(entityProperty.isEqual(correct)).toBe(true);
});
