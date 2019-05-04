// @flow

import ElementPosition from "./ElementPosition";
import ElementRotation from "./ElementRotation";
import TiledMapPositionedObject from "./TiledMapPositionedObject";
import TiledMapPositionedObjectUnserializer from "./TiledMapPositionedObjectUnserializer";

it("is equatable", function() {
  const tiledMapPositionedObjectPosition1 = new ElementPosition<"tile">(10, 10);
  const tiledMapPositionedObjectRotation1 = new ElementRotation<"radians">(
    10,
    10,
    10
  );
  const tiledMapPositionedObject1 = new TiledMapPositionedObject(
    "foo.png",
    tiledMapPositionedObjectPosition1,
    tiledMapPositionedObjectRotation1
  );

  const tiledMapPositionedObjectPosition2 = new ElementPosition<"tile">(20, 20);
  const tiledMapPositionedObjectRotation2 = new ElementRotation<"radians">(
    20,
    20,
    20
  );
  const tiledMapPositionedObject2 = new TiledMapPositionedObject(
    "foo.png",
    tiledMapPositionedObjectPosition2,
    tiledMapPositionedObjectRotation2
  );

  expect(tiledMapPositionedObject1.isEqual(tiledMapPositionedObject2)).toBe(
    false
  );
});

it("is JSON serializable", function() {
  const tiledMapPositionedObjectPosition = new ElementPosition<"tile">(10, 10);
  const tiledMapPositionedObjectRotation = new ElementRotation<"radians">(
    10,
    10,
    10
  );
  const tiledMapPositionedObject = new TiledMapPositionedObject(
    "foo.png",
    tiledMapPositionedObjectPosition,
    tiledMapPositionedObjectRotation
  );

  const serialized = tiledMapPositionedObject.asJson();
  const unserializer = new TiledMapPositionedObjectUnserializer();
  const unserialized = unserializer.fromJson(serialized);

  expect(tiledMapPositionedObject.isEqual(unserialized)).toBe(true);
});
