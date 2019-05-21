// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import FixturesFileQueryBuilder from "./FixturesFileQueryBuilder";
import ForcedTick from "./ForcedTick";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";
import TiledTilesetLoader from "./TiledTilesetLoader";

it("loads and parses tileset files", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const queryBuilder = new FixturesFileQueryBuilder();
  const queryBus = new QueryBus(loggerBreadcrumbs);

  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));

    // should be done in one tick
    queryBus.offEnqueued(mockedEnqueuedCallback);
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledTilesetLoader = new TiledTilesetLoader(loggerBreadcrumbs, queryBus, queryBuilder);
  const tiledTileset = tiledTilesetLoader.load(cancelToken, "tileset-fixture-01.tsx");

  await expect(tiledTileset).resolves.toBeDefined();
  expect(mockedEnqueuedCallback.mock.calls.length).toBe(1);
});
