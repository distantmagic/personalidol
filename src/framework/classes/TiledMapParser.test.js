// @flow

import * as fixtures from "../../fixtures";
import Cancelled from "./Exception/Cancelled";
import CancelToken from "./CancelToken";
import FixturesFileQueryBuilder from "./FixturesFileQueryBuilder";
import ForcedTick from "./ForcedTick";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";
import TiledMapParser from "./TiledMapParser";
import TiledMapUnserializer from "./TiledMapUnserializer";
import TiledTilesetLoader from "./TiledTilesetLoader";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { QueryBus as QueryBusInterface } from "../interfaces/QueryBus";
import type { TiledMap as TiledMapInterface } from "../interfaces/TiledMap";

async function prepare(): Promise<
  [CancelTokenInterface, QueryBusInterface, Promise<TiledMapInterface>]
> {
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
  const [cancelToken, queryBus, tiledMapPromise]: [
    CancelTokenInterface,
    QueryBusInterface,
    Promise<TiledMapInterface>
  ] = await prepare();
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

  const tiledMapEllipseBlockObject = tiledMapEllipseObjects[0].getTiledMapBlockObject();
  const tiledMapEllipsePosition = tiledMapEllipseBlockObject.getTiledMapPositionedObject();

  expect(tiledMapEllipsePosition.getElementPosition().getX()).toBe(4);
  expect(tiledMapEllipsePosition.getElementPosition().getY()).toBe(1);
  expect(tiledMapEllipsePosition.getElementPosition().getZ()).toBe(0);
  expect(tiledMapEllipsePosition.getElementRotation().getRotationX()).toBe(0);
  expect(tiledMapEllipsePosition.getElementRotation().getRotationY()).toBe(0);
  expect(tiledMapEllipsePosition.getElementRotation().getRotationZ()).toBe(-0);
  expect(tiledMapEllipsePosition.getName()).toBe("Well");
  expect(tiledMapEllipseBlockObject.getElementSize().getDepth()).toBe(0.5);
  expect(tiledMapEllipseBlockObject.getElementSize().getHeight()).toBe(2);
  expect(tiledMapEllipseBlockObject.getElementSize().getWidth()).toBe(2);

  // polygons

  const tiledMapPolygonObjects = tiledMap.getPolygonObjects();

  expect(tiledMapPolygonObjects).toHaveLength(1);
  expect(tiledMapPolygonObjects[0]).toBeDefined();

  const tiledMapPolygonPosition = tiledMapPolygonObjects[0].getTiledMapPositionedObject();

  expect(tiledMapPolygonPosition.getElementPosition().getX()).toBe(6);
  expect(tiledMapPolygonPosition.getElementPosition().getY()).toBe(2);
  expect(tiledMapPolygonPosition.getElementPosition().getZ()).toBe(0);
  expect(tiledMapPolygonPosition.getElementRotation().getRotationX()).toBe(0);
  expect(tiledMapPolygonPosition.getElementRotation().getRotationY()).toBe(0);
  expect(tiledMapPolygonPosition.getElementRotation().getRotationZ()).toBe(-0);
  expect(tiledMapPolygonObjects[0].getDepth()).toBe(3);
  expect(tiledMapPolygonPosition.getName()).toBe("Crater");

  // rectangles

  const tiledMapRectangleObjects = tiledMap.getRectangleObjects();

  expect(tiledMapRectangleObjects).toHaveLength(2);

  expect(tiledMapRectangleObjects[0]).toBeDefined();

  const tiledMapRectangleBlockObject1 = tiledMapRectangleObjects[0].getTiledMapBlockObject();
  const tiledMapRectanglePosition1 = tiledMapRectangleBlockObject1.getTiledMapPositionedObject();

  expect(tiledMapRectanglePosition1.getElementPosition().getX()).toBe(0);
  expect(tiledMapRectanglePosition1.getElementPosition().getY()).toBe(0);
  expect(tiledMapRectanglePosition1.getElementPosition().getZ()).toBe(0);
  expect(tiledMapRectanglePosition1.getElementRotation().getRotationX()).toBe(
    0
  );
  expect(tiledMapRectanglePosition1.getElementRotation().getRotationY()).toBe(
    0
  );
  expect(
    Math.round(tiledMapRectanglePosition1.getElementRotation().getRotationZ())
  ).toBe(-1);
  expect(tiledMapRectangleBlockObject1.getElementSize().getDepth()).toBe(3);
  expect(tiledMapRectangleBlockObject1.getElementSize().getHeight()).toBe(1);
  expect(tiledMapRectangleBlockObject1.getElementSize().getWidth()).toBe(1);
  expect(tiledMapRectanglePosition1.getName()).toBe("Cottage");

  expect(tiledMapRectangleObjects[1]).toBeDefined();

  const tiledMapRectangleBlockObject2 = tiledMapRectangleObjects[1].getTiledMapBlockObject();
  const tiledMapRectanglePosition2 = tiledMapRectangleBlockObject2.getTiledMapPositionedObject();

  expect(tiledMapRectanglePosition2.getElementPosition().getX()).toBe(3);
  expect(tiledMapRectanglePosition2.getElementPosition().getY()).toBe(5);
  expect(tiledMapRectanglePosition2.getElementPosition().getZ()).toBe(0);
  expect(tiledMapRectanglePosition2.getElementRotation().getRotationX()).toBe(
    0
  );
  expect(tiledMapRectanglePosition2.getElementRotation().getRotationY()).toBe(
    0
  );
  expect(tiledMapRectanglePosition2.getElementRotation().getRotationZ()).toBe(
    -0
  );
  expect(tiledMapRectangleBlockObject2.getElementSize().getDepth()).toBe(4);
  expect(tiledMapRectangleBlockObject2.getElementSize().getHeight()).toBe(2);
  expect(tiledMapRectangleBlockObject2.getElementSize().getWidth()).toBe(3);
  expect(tiledMapRectanglePosition2.getName()).toBe("Barn");
});

it("is serializable", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await prepare();
  const tiledMap = await tiledMapPromise;

  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const serialized = tiledMap.asJson();

  expect(function() {
    JSON.parse(serialized);
  }).not.toThrow();

  const tiledMapUnserializer = new TiledMapUnserializer(
    loggerBreadcrumbs,
    serialized
  );
  const unserialized = tiledMapUnserializer.fromJson();

  expect(tiledMap.isEqual(unserialized)).toBe(true);
});
