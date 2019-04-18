// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import FixturesFileQueryBuilder from "./FixturesFileQueryBuilder";
import ForcedTick from "./ForcedTick";
import QueryBus from "./QueryBus";
import TiledTilesetLoader from "./TiledTilesetLoader";

it("loads and parses tileset files", async function() {
  const cancelToken = new CancelToken();
  const queryBuilder = new FixturesFileQueryBuilder();
  const queryBus = new QueryBus();

  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));

    // should be done in one tick
    queryBus.offEnqueued(mockedEnqueuedCallback);
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledTilesetLoader = new TiledTilesetLoader(queryBus, queryBuilder);
  const tiledTileset = tiledTilesetLoader.load(
    cancelToken,
    "tileset-fixture-01.tsx"
  );

  await expect(tiledTileset).resolves.toBeDefined();
  expect(mockedEnqueuedCallback.mock.calls.length).toBe(1);
});
