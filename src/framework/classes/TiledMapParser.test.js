// @flow

import tiledMapParser from "../fixtures/tiledMapParser";
import Cancelled from "./Exception/Cancelled";

import type { CancelToken } from "../interfaces/CancelToken";
import type { TiledMap } from "../interfaces/TiledMap";
import type { QueryBus } from "../interfaces/QueryBus";

it("parses map file", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await tiledMapParser();

  return expect(tiledMapPromise).resolves.toBeDefined();
});

it("can be cancelled gracefully", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await tiledMapParser();

  cancelToken.cancel();

  return expect(tiledMapPromise).rejects.toThrow(Cancelled);
});

it("generates skinned layers and tiles", async function() {
  const [cancelToken, queryBus, tiledMapPromise]: [
    CancelToken,
    QueryBus,
    Promise<TiledMap>,
  ] = await tiledMapParser();
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

  expect(tiledMapEllipseBlockObject.getElementPosition().getX()).toBe(4);
  expect(tiledMapEllipseBlockObject.getElementPosition().getY()).toBe(1);
  expect(tiledMapEllipseBlockObject.getElementPosition().getZ()).toBe(0);
  expect(tiledMapEllipseBlockObject.getElementRotation().getRotationX()).toBe(0);
  expect(tiledMapEllipseBlockObject.getElementRotation().getRotationY()).toBe(0);
  expect(tiledMapEllipseBlockObject.getElementRotation().getRotationZ()).toBe(
    -0
  );
  expect(tiledMapEllipseBlockObject.getElementSize().getDepth()).toBe(0.5);
  expect(tiledMapEllipseBlockObject.getElementSize().getHeight()).toBe(2);
  expect(tiledMapEllipseBlockObject.getElementSize().getWidth()).toBe(2);
  expect(tiledMapEllipseBlockObject.getName()).toBe("Well");

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

  const tiledMapRectangleBlockObject1 = tiledMapRectangleObjects[0].getTiledMapBlockObject();

  expect(tiledMapRectangleBlockObject1.getElementPosition().getX()).toBe(0);
  expect(tiledMapRectangleBlockObject1.getElementPosition().getY()).toBe(0);
  expect(tiledMapRectangleBlockObject1.getElementPosition().getZ()).toBe(0);
  expect(tiledMapRectangleBlockObject1.getElementRotation().getRotationX()).toBe(
    0
  );
  expect(tiledMapRectangleBlockObject1.getElementRotation().getRotationY()).toBe(
    0
  );
  expect(
    Math.round(tiledMapRectangleBlockObject1.getElementRotation().getRotationZ())
  ).toBe(-1);
  expect(tiledMapRectangleBlockObject1.getElementSize().getDepth()).toBe(3);
  expect(tiledMapRectangleBlockObject1.getElementSize().getHeight()).toBe(1);
  expect(tiledMapRectangleBlockObject1.getElementSize().getWidth()).toBe(1);
  expect(tiledMapRectangleBlockObject1.getName()).toBe("Cottage");

  expect(tiledMapRectangleObjects[1]).toBeDefined();

  const tiledMapRectangleBlockObject2 = tiledMapRectangleObjects[1].getTiledMapBlockObject();

  expect(tiledMapRectangleBlockObject2.getElementPosition().getX()).toBe(3);
  expect(tiledMapRectangleBlockObject2.getElementPosition().getY()).toBe(5);
  expect(tiledMapRectangleBlockObject2.getElementPosition().getZ()).toBe(0);
  expect(tiledMapRectangleBlockObject2.getElementRotation().getRotationX()).toBe(
    0
  );
  expect(tiledMapRectangleBlockObject2.getElementRotation().getRotationY()).toBe(
    0
  );
  expect(tiledMapRectangleBlockObject2.getElementRotation().getRotationZ()).toBe(
    -0
  );
  expect(tiledMapRectangleBlockObject2.getElementSize().getDepth()).toBe(4);
  expect(tiledMapRectangleBlockObject2.getElementSize().getHeight()).toBe(2);
  expect(tiledMapRectangleBlockObject2.getElementSize().getWidth()).toBe(3);
  expect(tiledMapRectangleBlockObject2.getName()).toBe("Barn");
});
