// @flow

import ElementPosition from "./ElementPosition";
import tiledMapParserFixture from "./TiledMapParser.fixture";
import TiledMapPathfinder from "./TiledMapPathfinder";

it("finds the shortest path from point to point on tiled map", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await tiledMapParserFixture(
    "map-fixture-02-walkable.tmx"
  );
  const tiledMap = await tiledMapPromise;
  const tiledMapPathfinder = new TiledMapPathfinder(tiledMap);
});
