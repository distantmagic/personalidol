// @flow

import ElementSize from "./ElementSize";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import TiledMapBlockObject from "./TiledMapBlockObject";
import TiledMapPositionedObject from "./TiledMapPositionedObject";
import TiledMapRectangleObject from "./TiledMapRectangleObject";

it("is comparable with other ellipse objects", function() {
  const elementPosition1 = new ElementPosition(1, 1);
  const elementRotation1 = new ElementRotation<"radians">(1, 1, 1);
  const tiledMapPositionedObject1 = new TiledMapPositionedObject("test", elementPosition1, elementRotation1);
  const elementSize1 = new ElementSize(1, 1);
  const tiledMapBlockObject1 = new TiledMapBlockObject(tiledMapPositionedObject1, elementSize1);
  const tiledMapRectangleObject1 = new TiledMapRectangleObject(tiledMapBlockObject1);

  const elementPosition2 = new ElementPosition(2, 2);
  const elementRotation2 = new ElementRotation<"radians">(2, 2, 2);
  const tiledMapPositionedObject2 = new TiledMapPositionedObject("test", elementPosition2, elementRotation2);
  const elementSize2 = new ElementSize(2, 2);
  const tiledMapBlockObject2 = new TiledMapBlockObject(tiledMapPositionedObject2, elementSize2);
  const tiledMapRectangleObject2 = new TiledMapRectangleObject(tiledMapBlockObject2);

  expect(tiledMapRectangleObject1.isEqual(tiledMapRectangleObject2)).toBe(false);
});