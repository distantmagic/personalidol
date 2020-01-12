import isEqualWithEpsilon from "src/framework/helpers/isEqualWithEpsilon";

test.each([
  [1.04, 1.0, 0.02, false],
  [1.04, 1.0, 0.05, true],
])("equality of '%p' vs '%p' with epsilon '%p' should be %p", function(n1, n2, epsilon, expected) {
  expect(isEqualWithEpsilon(n1, n2, epsilon)).toBe(expected);
});
