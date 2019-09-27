// @flow

import * as dmmath from "./dmmath";

test.each([
  [1.004, 1.005, -3, false],

  [1.005, 1.0051, -4, false],
  [1.005, 1.0051, -3, true],
  [1.005, 1.0051, -2, true],
  [1.005, 1.0051, -1, true],
  [1.005, 1.0051, -0, true],
])("equality of '%p' vs '%p' with precision '%p' should be %p", function(n1, n2, precision, expected) {
  expect(dmmath.isEqualWithPrecision(n1, n2, precision)).toBe(expected);
});

test.each([
  [1.005, -4, 1.005],
  [1.005, -3, 1.005],
  [1.005, -2, 1.01],
  [1.005, -1, 1.0],
  [1.005, -0, 1.0],

  [5005e-3, -4, 5.005],

  [5.005, -4, 5.005],
  [5.005, -3, 5.005],
  [5.005, -2, 5.01],
  [5.005, -1, 5.0],
  [5.005, -0, 5.0],
])("rounds '%p' with precision of '%p' to '%p'", function(n, precision, expected) {
  expect(dmmath.roundWithPrecision(n, precision)).toBe(expected);
});
