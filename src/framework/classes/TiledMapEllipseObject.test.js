// @flow

import ElementSize from "./ElementSize";
import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import TiledMapBlockObject from "./TiledMapBlockObject";
import TiledMapPositionedObject from "./TiledMapPositionedObject";
import TiledMapEllipseObject from "./TiledMapEllipseObject";
import TiledMapEllipseObjectUnserializer from "./TiledMapEllipseObjectUnserializer";

it("is comparable with other ellipse objects", function() {
  const elementPosition1 = new ElementPosition(1, 1);
  const elementRotation1 = new ElementRotation<"radians">(1, 1, 1);
  const tiledMapPositionedObject1 = new TiledMapPositionedObject(
    "test",
    elementPosition1,
    elementRotation1
  );
  const elementSize1 = new ElementSize(1, 1);
  const tiledMapBlockObject1 = new TiledMapBlockObject(
    tiledMapPositionedObject1,
    elementSize1
  );
  const tiledMapEllipseObject1 = new TiledMapEllipseObject(
    tiledMapBlockObject1
  );

  const elementPosition2 = new ElementPosition(2, 2);
  const elementRotation2 = new ElementRotation<"radians">(2, 2, 2);
  const tiledMapPositionedObject2 = new TiledMapPositionedObject(
    "test",
    elementPosition2,
    elementRotation2
  );
  const elementSize2 = new ElementSize(2, 2);
  const tiledMapBlockObject2 = new TiledMapBlockObject(
    tiledMapPositionedObject2,
    elementSize2
  );
  const tiledMapEllipseObject2 = new TiledMapEllipseObject(
    tiledMapBlockObject2
  );

  expect(tiledMapEllipseObject1.isEqual(tiledMapEllipseObject2)).toBe(false);
});

it("is serializable as JSON", function() {
  const elementPosition = new ElementPosition(1, 1);
  const elementRotation = new ElementRotation<"radians">(1, 1, 1);
  const tiledMapPositionedObject = new TiledMapPositionedObject(
    "test",
    elementPosition,
    elementRotation
  );
  const elementSize = new ElementSize(1, 1);
  const tiledMapBlockObject = new TiledMapBlockObject(
    tiledMapPositionedObject,
    elementSize
  );
  const tiledMapEllipseObject = new TiledMapEllipseObject(tiledMapBlockObject);

  const serialized = tiledMapEllipseObject.asJson();
  const unserializer = new TiledMapEllipseObjectUnserializer();
  const unserialized = unserializer.fromJson(serialized);

  expect(tiledMapEllipseObject.isEqual(unserialized)).toBe(true);
});
