// @flow

import * as fixtures from "../../fixtures";
import Cancelled from "./Exception/Cancelled";
import CancelToken from "./CancelToken";
import FixturesFileQueryBuilder from "./FixturesFileQueryBuilder";
import ForcedTick from "./ForcedTick";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";
import TiledMapParser from "./TiledMapParser";
import TiledTilesetLoader from "./TiledTilesetLoader";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";

async function prepare(): Promise<
  [CancelTokenInterface, QueryBusInterface, Promise<TiledMapInterface>]
> {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const mapFilename = "map-fixture-01.tmx";
  const queryBuilder = new FixturesFileQueryBuilder();
  const queryBus = new QueryBus(loggerBreadcrumbs);

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

  const tiledMapLayers = tiledMap.getLayers();

  expect(tiledMapLayers).toHaveLength(1);
  expect(tiledMapLayers[0]).toBeDefined();

  // ellipses

  const tiledMapEllipseObjects = tiledMap.getEllipseObjects();

  expect(tiledMapEllipseObjects).toHaveLength(1);
  expect(tiledMapEllipseObjects[0]).toBeDefined();
  expect(tiledMapEllipseObjects[0].getElementPosition().getX()).toBe(4);
  expect(tiledMapEllipseObjects[0].getElementPosition().getY()).toBe(1);
  expect(tiledMapEllipseObjects[0].getElementPosition().getZ()).toBe(0);
  expect(tiledMapEllipseObjects[0].getElementRotation().getRotationX()).toBe(0);
  expect(tiledMapEllipseObjects[0].getElementRotation().getRotationY()).toBe(0);
  expect(tiledMapEllipseObjects[0].getElementRotation().getRotationZ()).toBe(
    -0
  );
  expect(tiledMapEllipseObjects[0].getElementSize().getDepth()).toBe(0.5);
  expect(tiledMapEllipseObjects[0].getElementSize().getHeight()).toBe(2);
  expect(tiledMapEllipseObjects[0].getElementSize().getWidth()).toBe(2);
  expect(tiledMapEllipseObjects[0].getName()).toBe("Well");

  // polygons

  const tiledMapPolygonObjects = tiledMap.getPolygonObjects();

  expect(tiledMapPolygonObjects).toHaveLength(1);
  expect(tiledMapPolygonObjects[0]).toBeDefined();
  expect(tiledMapPolygonObjects[0].getElementPosition().getX()).toBe(6);
  expect(tiledMapPolygonObjects[0].getElementPosition().getY()).toBe(2);
  expect(tiledMapPolygonObjects[0].getElementPosition().getZ()).toBe(0);
  expect(tiledMapPolygonObjects[0].getElementRotation().getRotationX()).toBe(0);
  expect(tiledMapPolygonObjects[0].getElementRotation().getRotationY()).toBe(0);
  expect(tiledMapPolygonObjects[0].getElementRotation().getRotationZ()).toBe(
    -0
  );
  expect(tiledMapPolygonObjects[0].getDepth()).toBe(3);
  expect(tiledMapPolygonObjects[0].getName()).toBe("Crater");

  // rectangles

  const tiledMapRectangleObjects = tiledMap.getRectangleObjects();

  expect(tiledMapRectangleObjects).toHaveLength(2);

  expect(tiledMapRectangleObjects[0]).toBeDefined();
  expect(tiledMapRectangleObjects[0].getElementPosition().getX()).toBe(0);
  expect(tiledMapRectangleObjects[0].getElementPosition().getY()).toBe(0);
  expect(tiledMapRectangleObjects[0].getElementPosition().getZ()).toBe(0);
  expect(tiledMapRectangleObjects[0].getElementRotation().getRotationX()).toBe(
    0
  );
  expect(tiledMapRectangleObjects[0].getElementRotation().getRotationY()).toBe(
    0
  );
  expect(
    Math.round(tiledMapRectangleObjects[0].getElementRotation().getRotationZ())
  ).toBe(-1);
  expect(tiledMapRectangleObjects[0].getElementSize().getDepth()).toBe(3);
  expect(tiledMapRectangleObjects[0].getElementSize().getHeight()).toBe(1);
  expect(tiledMapRectangleObjects[0].getElementSize().getWidth()).toBe(1);
  expect(tiledMapRectangleObjects[0].getName()).toBe("Cottage");

  expect(tiledMapRectangleObjects[1]).toBeDefined();
  expect(tiledMapRectangleObjects[1].getElementPosition().getX()).toBe(3);
  expect(tiledMapRectangleObjects[1].getElementPosition().getY()).toBe(5);
  expect(tiledMapRectangleObjects[1].getElementPosition().getZ()).toBe(0);
  expect(tiledMapRectangleObjects[1].getElementRotation().getRotationX()).toBe(
    0
  );
  expect(tiledMapRectangleObjects[1].getElementRotation().getRotationY()).toBe(
    0
  );
  expect(tiledMapRectangleObjects[1].getElementRotation().getRotationZ()).toBe(
    -0
  );
  expect(tiledMapRectangleObjects[1].getElementSize().getDepth()).toBe(4);
  expect(tiledMapRectangleObjects[1].getElementSize().getHeight()).toBe(2);
  expect(tiledMapRectangleObjects[1].getElementSize().getWidth()).toBe(3);
  expect(tiledMapRectangleObjects[1].getName()).toBe("Barn");
});
