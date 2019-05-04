// @flow

import ElementSize from "./ElementSize";
import TiledMapGrid from "./TiledMapGrid";
import TiledMapLayer from "./TiledMapLayer";
import TiledMapLayerUnserializer from "./TiledMapLayerUnserializer";

it("is equatable", function() {
  const tiledMapLayer1 = new TiledMapLayer(
    "test",
    new TiledMapGrid([[1, 1], [1, 1]], new ElementSize<"tile">(2, 2)),
    new ElementSize<"tile">(20, 20)
  );
  const tiledMapLayer2 = new TiledMapLayer(
    "test",
    new TiledMapGrid([[1, 1], [1, 2]], new ElementSize<"tile">(2, 2)),
    new ElementSize<"tile">(20, 20)
  );

  expect(tiledMapLayer1.isEqual(tiledMapLayer2)).toBe(false);
});

it("is serializable as JSON", function() {
  const tiledMapLayer = new TiledMapLayer(
    "test",
    new TiledMapGrid([[1, 1], [1, 1]], new ElementSize<"tile">(2, 2)),
    new ElementSize<"tile">(20, 20)
  );

  const serialized = tiledMapLayer.asJson();
  const unserializer = new TiledMapLayerUnserializer();
  const unserialized = unserializer.fromJson(serialized);

  expect(tiledMapLayer.isEqual(unserialized)).toBe(true);
});
