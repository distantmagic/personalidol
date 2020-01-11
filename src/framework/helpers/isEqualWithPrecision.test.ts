// @flow strict

import isEqualWithPrecision from "./isEqualWithPrecision";

test.each([
  [1.004, 1.005, 3, false],

  [1.005, 1.0051, 4, false],
  [1.005, 1.0051, 3, true],
  [1.005, 1.0051, 2, true],
  [1.005, 1.0051, 1, true],
  [1.005, 1.0051, 0, true],
])("equality of '%p' vs '%p' with precision '%p' should be %p", function(n1, n2, precision, expected) {
  expect(isEqualWithPrecision(n1, n2, precision)).toBe(expected);
});
