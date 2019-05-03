// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "../classes/CancelToken";
import FixturesFileQueryBuilder from "../classes/FixturesFileQueryBuilder";
import ForcedTick from "../classes/ForcedTick";
import LoggerBreadcrumbs from "../classes/LoggerBreadcrumbs";
import QueryBus from "../classes/QueryBus";
import TiledMapParser from "../classes/TiledMapParser";
import TiledTilesetLoader from "../classes/TiledTilesetLoader";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";

export default async function tiledMapParser(): Promise<[
  CancelTokenInterface,
  QueryBusInterface,
  Promise<TiledMapInterface>
]> {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const queryBuilder = new FixturesFileQueryBuilder();
  const queryBus = new QueryBus(loggerBreadcrumbs);
  const mapFilename = "map-fixture-01.tmx";

  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));

    // should be done in one tick
    queryBus.offEnqueued(mockedEnqueuedCallback);
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledTilesetLoader = new TiledTilesetLoader(
    loggerBreadcrumbs,
    queryBus,
    queryBuilder
  );
  const parser = new TiledMapParser(
    loggerBreadcrumbs,
    fixtures.findPath(mapFilename),
    await fixtures.file(mapFilename),
    tiledTilesetLoader
  );

  const tiledMapPromise = parser.parse(cancelToken);

  return [cancelToken, queryBus, tiledMapPromise];
}
