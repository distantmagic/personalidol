// @flow

import ElementPosition from "./ElementPosition";

it("is comparable with other element positions", function() {
  const elementPosition1 = new ElementPosition(10, 10, 5);
  const elementPosition2 = new ElementPosition(10, 10, 4);

  expect(elementPosition1.isEqual(elementPosition2)).toBe(false);
});
