// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import FixturesFileQueryBuilder from "./FixturesFileQueryBuilder";
import ForcedTick from "./ForcedTick";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";
import TiledMapParser from "./TiledMapParser";
import TiledTilesetLoader from "./TiledTilesetLoader";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "../interfaces/LoggerBreadcrumbs";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";

export default async function tiledMapParserFixture(
  loggerBreadcrumbs: LoggerBreadcrumbsInterface,
  mapFilename: string,
  expectedTicks: number
): Promise<[CancelTokenInterface, QueryBusInterface, Promise<TiledMapInterface>]> {
  const breadcrumbs = loggerBreadcrumbs.add("tiledMapParserFixture");
  const cancelToken = new CancelToken(breadcrumbs.add("CancelToken"));
  const queryBuilder = new FixturesFileQueryBuilder();
  const queryBus = new QueryBus(breadcrumbs.add("QueryBus"));

  let ticks = 0;
  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));

    ticks += 1;

    // each tiled tileset is na new tick
    if (ticks >= expectedTicks) {
      queryBus.offEnqueued(mockedEnqueuedCallback);
    }
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledTilesetLoader = new TiledTilesetLoader(breadcrumbs.add("TiledTilesetLoader"), queryBus, queryBuilder);
  const parser = new TiledMapParser(
    breadcrumbs.add("TiledMapParser"),
    fixtures.findPath(mapFilename),
    await fixtures.file(mapFilename),
    tiledTilesetLoader
  );

  const tiledMapPromise = parser.parse(cancelToken);

  return [cancelToken, queryBus, tiledMapPromise];
}
