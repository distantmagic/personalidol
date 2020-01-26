import ElementPosition from "src/framework/classes/ElementPosition";
import ElementPositionCollection from "src/framework/classes/ElementPositionCollection";
import ElementSize from "src/framework/classes/ElementSize";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("finds bounding box", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const elementPositionCollection = new ElementPositionCollection<"tile">(loggerBreadcrumbs, "tile", [
    new ElementPosition<"tile">("tile", 1, 1, 0),
    new ElementPosition<"tile">("tile", 2, 2, 0),
    new ElementPosition<"tile">("tile", 7.5, 2, 3),
    new ElementPosition<"tile">("tile", 3, 8, 0),
  ]);

  const elementBoundingBox = elementPositionCollection.getElementBoundingBox();

  expect(elementBoundingBox.getElementPosition().isEqual(new ElementPosition<"tile">("tile", 1, 1, 0))).toBe(true);
  expect(elementBoundingBox.getElementSize().isEqual(new ElementSize<"tile">("tile", 6.5, 7.0, 3.0))).toBe(true);
});

test("offsets points", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const elementPositionCollection = new ElementPositionCollection<"tile">(loggerBreadcrumbs, "tile", [
    new ElementPosition<"tile">("tile", 1, 1, 0),
    new ElementPosition<"tile">("tile", 2, 2, 0),
    new ElementPosition<"tile">("tile", 7.5, 2, 3),
    new ElementPosition<"tile">("tile", 3, 8, 0),
  ]);
  const offsetted = elementPositionCollection.offsetCollection(new ElementPosition("tile", 1, 2, 3));
  const offsettedArray = offsetted.asArray();

  expect(offsettedArray).toHaveLength(4);
  expect(offsettedArray[0].isEqual(new ElementPosition<"tile">("tile", 2, 3, 3))).toBe(true);
  expect(offsettedArray[1].isEqual(new ElementPosition<"tile">("tile", 3, 4, 3))).toBe(true);
  expect(offsettedArray[2].isEqual(new ElementPosition<"tile">("tile", 8.5, 4, 6))).toBe(true);
  expect(offsettedArray[3].isEqual(new ElementPosition<"tile">("tile", 4, 10, 3))).toBe(true);
});