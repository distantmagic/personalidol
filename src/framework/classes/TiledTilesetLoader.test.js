// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import FixturesTiledTilesetQueryBuilder from "./FixturesTiledTilesetQueryBuilder";
import ForcedTick from "./ForcedTick";
import QueryBus from "./QueryBus";
import TiledTilesetLoader from "./TiledTilesetLoader";

it("loads and parses tileset files", function() {
  const cancelToken = new CancelToken();
  const queryBuilder = new FixturesTiledTilesetQueryBuilder();
  const queryBus = new QueryBus();
  const tiledTilesetLoader = new TiledTilesetLoader(queryBus, queryBuilder);
  const tiledTileset = tiledTilesetLoader.load(
    cancelToken,
    "tileset-fixture-01.tsx"
  );

  setTimeout(function() {
    queryBus.tick(new ForcedTick(false));
  });

  return expect(tiledTileset).resolves.toBeDefined();
});
