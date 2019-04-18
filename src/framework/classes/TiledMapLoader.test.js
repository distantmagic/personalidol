// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import FixturesTiledMapQueryBuilder from "./FixturesTiledMapQueryBuilder";
import FixturesTiledTilesetQueryBuilder from "./FixturesTiledTilesetQueryBuilder";
import ForcedTick from "./ForcedTick";
import QueryBus from "./QueryBus";
import TiledMapLoader from "./TiledMapLoader";
import TiledTilesetLoader from "./TiledTilesetLoader";

it("loads and parses map files", async function() {
  const cancelToken = new CancelToken();
  const queryBus = new QueryBus();
  const tiledTilesetLoader = new TiledTilesetLoader(
    queryBus,
    new FixturesTiledTilesetQueryBuilder()
  );
  const tiledMapLoader = new TiledMapLoader(
    queryBus,
    new FixturesTiledMapQueryBuilder(),
    tiledTilesetLoader
  );

  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledMap = tiledMapLoader.load(cancelToken, "map-fixture-01.tmx");

  await expect(tiledMap).resolves.toBeDefined();

  // first tick for map
  // second tick for tileset
  expect(mockedEnqueuedCallback.mock.calls.length).toBe(2);

  queryBus.offEnqueued(mockedEnqueuedCallback);
}, 300);
