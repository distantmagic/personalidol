// @flow

import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import TiledMapPositionedObject from "./TiledMapPositionedObject";
import TiledMapPolygonObject from "./TiledMapPolygonObject";
import TiledMapPolygonObjectUnserializer from "./TiledMapPolygonObjectUnserializer";

it("is comparable with other polygon objects", function() {
  const elementPosition1 = new ElementPosition(1, 1);
  const elementRotation1 = new ElementRotation<"radians">(1, 1, 1);
  const tiledMapPositionedObject1 = new TiledMapPositionedObject(
    "test",
    elementPosition1,
    elementRotation1
  );
  const tiledMapEllipseObject1 = new TiledMapPolygonObject(
    tiledMapPositionedObject1,
    [new ElementPosition(0, 0, 0)],
    10
  );

  const elementPosition2 = new ElementPosition(1, 1);
  const elementRotation2 = new ElementRotation<"radians">(2, 2, 2);
  const tiledMapPositionedObject2 = new TiledMapPositionedObject(
    "test",
    elementPosition2,
    elementRotation2
  );
  const tiledMapEllipseObject2 = new TiledMapPolygonObject(
    tiledMapPositionedObject2,
    [new ElementPosition(0, 0, 0)],
    10
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
  const tiledMapPolygonObject = new TiledMapPolygonObject(
    tiledMapPositionedObject,
    [new ElementPosition(0, 0, 0)],
    10
  );

  const serialized = tiledMapPolygonObject.asJson();
  const unserializer = new TiledMapPolygonObjectUnserializer();
  const unserialized = unserializer.fromJson(serialized);

  expect(tiledMapPolygonObject.isEqual(unserialized)).toBe(true);
});
