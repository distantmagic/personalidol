import ElementBoundingBox from "src/framework/classes/ElementBoundingBox";
import ElementPosition from "src/framework/classes/ElementPosition";
import ElementSize from "src/framework/classes/ElementSize";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("stores element coordinates", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const elementPosition = new ElementPosition("tile", 0, 0, 0);
  const elementSize = new ElementSize("tile", 10, 10, 10);
  const elementBoundingBox = new ElementBoundingBox<"tile">(loggerBreadcrumbs, elementPosition, elementSize);

  expect(elementBoundingBox.getElementPosition().isEqual(elementPosition)).toBe(true);
  expect(elementBoundingBox.getElementSize().isEqual(elementSize)).toBe(true);
});
