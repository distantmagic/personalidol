// @flow strict

import ElementBoundingBox from "./ElementBoundingBox";
import ElementPosition from "./ElementPosition";
import ElementSize from "./ElementSize";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

test("stores element coordinates", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const elementPosition = new ElementPosition(0, 0, 0);
  const elementSize = new ElementSize(10, 10, 10);
  const elementBoundingBox = new ElementBoundingBox<"tile">(loggerBreadcrumbs, elementPosition, elementSize);

  expect(elementBoundingBox.getElementPosition().isEqual(elementPosition)).toBe(true);
  expect(elementBoundingBox.getElementSize().isEqual(elementSize)).toBe(true);
});
