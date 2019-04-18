// @flow

import * as fixtures from "../../fixtures";
import Cancelled from "./Exception/Cancelled";
import CancelToken from "./CancelToken";
import FixturesTiledTilesetQueryBuilder from "./FixturesTiledTilesetQueryBuilder";
import ForcedTick from "./ForcedTick";
import QueryBus from "./QueryBus";
import TiledMapParser from "./TiledMapParser";
import TiledTilesetLoader from "./TiledTilesetLoader";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";

async function prepare(): Promise<
  [CancelTokenInterface, QueryBusInterface, Promise<TiledMapInterface>]
> {
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

  const tiledMapPromise = parser.parse(cancelToken);

  return [cancelToken, queryBus, tiledMapPromise];
}

it("parses map file", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await prepare();

  setTimeout(function() {
    queryBus.tick(new ForcedTick(false));
  });

  const tiledMap = await tiledMapPromise;
});

it("can be cancelled gracefully", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await prepare();

  cancelToken.cancel();

  setTimeout(function() {
    queryBus.tick(new ForcedTick(false));
  });

  return expect(tiledMapPromise).rejects.toThrow(Cancelled);
});
