// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QuakeBrushEntityProperty from "./QuakeBrushEntityProperty";
import QuakeBrushEntityPropertyParser from "./QuakeBrushEntityPropertyParser";

test.each([['    "foo" "bar\\"baz\\"booz"', "foo", 'bar"baz"booz'], ['"origin" "-32 -32 40"', "origin", "-32 -32 40"]])(
  "processes brush entity string '%p'",
  function(line, expectedKey, expectedValue) {
    const loggerBreadcrumbs = new LoggerBreadcrumbs();
    const parser = new QuakeBrushEntityPropertyParser(loggerBreadcrumbs, line);
    const entityProperty = parser.parse();
    const correct = new QuakeBrushEntityProperty(expectedKey, expectedValue);

    expect(entityProperty.getKey()).toBe(correct.getKey());
    expect(entityProperty.getValue()).toBe(correct.getValue());
    expect(entityProperty.isEqual(correct)).toBe(true);
  }
);
