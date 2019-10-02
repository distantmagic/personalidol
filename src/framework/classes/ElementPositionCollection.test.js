// @flow

import ElementPosition from "./ElementPosition";
import ElementPositionCollection from "./ElementPositionCollection";
import ElementSize from "./ElementSize";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

it("finds bounding box", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const elementPositionCollection = new ElementPositionCollection<"tile">(loggerBreadcrumbs, [
    new ElementPosition<"tile">(1, 1, 0),
    new ElementPosition<"tile">(2, 2, 0),
    new ElementPosition<"tile">(7.5, 2, 3),
    new ElementPosition<"tile">(3, 8, 0),
  ]);

  const elementBoundingBox = elementPositionCollection.getElementBoundingBox();

  expect(elementBoundingBox.getElementPosition().isEqual(new ElementPosition<"tile">(1, 1, 0))).toBe(true);
  expect(elementBoundingBox.getElementSize().isEqual(new ElementSize<"tile">(6.5, 7.0, 3.0))).toBe(true);
});
