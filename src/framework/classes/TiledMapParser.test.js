// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import FixturesTiledTilesetQueryBuilder from "./FixturesTiledTilesetQueryBuilder";
import ForcedTick from "./ForcedTick";
import QueryBus from "./QueryBus";
import TiledMapParser from "./TiledMapParser";
import TiledTilesetLoader from "./TiledTilesetLoader";

it("parses map file", async function() {
  const cancelToken = new CancelToken();
  const mapFilename = "map-fixture-01.tmx";
  const queryBuilder = new FixturesTiledTilesetQueryBuilder();
  const queryBus = new QueryBus();

  const tiledTilesetLoader = new TiledTilesetLoader(queryBus, queryBuilder);
  const parser = new TiledMapParser(
    mapFilename,
    await fixtures.file(mapFilename),
    tiledTilesetLoader
  );

  const resultPromise = parser.parse(cancelToken);

  setTimeout(function() {
    queryBus.tick(new ForcedTick(false));
  });

  const tiledMap = await resultPromise;
});
