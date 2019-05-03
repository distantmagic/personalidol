// @flow

import ElementSize from "./ElementSize";
import TiledMapGrid from "./TiledMapGrid";
import TiledMapLayer from "./TiledMapLayer";

it("is serializable as JSON", function() {
  const tiledMapLayer = new TiledMapLayer(
    "test",
    new TiledMapGrid([[1, 1], [1, 1]], new ElementSize<"tile">(10, 10)),
    new ElementSize<"tile">(20, 20)
  );

  const serialized = tiledMapLayer.asJson();

  expect(function() {
    JSON.parse(serialized);
  }).not.toThrow();
});
