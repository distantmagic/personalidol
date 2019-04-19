// @flow

import * as fixtures from "../../fixtures";
import Cancelled from "./Exception/Cancelled";
import CancelToken from "./CancelToken";
import FixturesFileQueryBuilder from "./FixturesFileQueryBuilder";
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
  const queryBuilder = new FixturesFileQueryBuilder();
  const queryBus = new QueryBus();

  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));

    // should be done in one tick
    queryBus.offEnqueued(mockedEnqueuedCallback);
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledTilesetLoader = new TiledTilesetLoader(queryBus, queryBuilder);
  const parser = new TiledMapParser(
    fixtures.findPath(mapFilename),
    await fixtures.file(mapFilename),
    tiledTilesetLoader
  );

  const tiledMapPromise = parser.parse(cancelToken);

  return [cancelToken, queryBus, tiledMapPromise];
}

it("parses map file", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await prepare();

  return expect(tiledMapPromise).resolves.toBeDefined();
});

it("can be cancelled gracefully", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await prepare();

  cancelToken.cancel();

  return expect(tiledMapPromise).rejects.toThrow(Cancelled);
});

it("generates skinned layers and tiles", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await prepare();
  const tiledMap = await tiledMapPromise;
  const skinnedTiles = [];

  for await (let skinnedLayer of tiledMap.generateSkinnedLayers(cancelToken)) {
    for await (let skinnedTile of skinnedLayer.generateSkinnedTiles(
      cancelToken
    )) {
      skinnedTiles.push(skinnedTile);
    }
  }

  // there are 4 tiles in total, but one is blank
  expect(skinnedTiles).toHaveLength(3);
});
