// @flow

import CancelToken from "./CancelToken";
import ElementSize from "./ElementSize";
import TiledMapPolygonPointsParser from "./TiledMapPolygonPointsParser";

it("parses polygon points", async function() {
  const cancelToken = new CancelToken();
  const tileSize = new ElementSize<"px">(128, 128);
  const points = "0,0 128,128 128,256 256,512";
  const tiledMapPolygonPointsParser = new TiledMapPolygonPointsParser(
    points,
    tileSize
  );

  const tiledMapPolygonPoints = await tiledMapPolygonPointsParser.parse(
    cancelToken
  );

  expect(tiledMapPolygonPoints).toHaveLength(4);

  expect(tiledMapPolygonPoints[0].getX()).toBe(0);
  expect(tiledMapPolygonPoints[0].getY()).toBe(0);

  expect(tiledMapPolygonPoints[1].getX()).toBe(1);
  expect(tiledMapPolygonPoints[1].getY()).toBe(1);

  expect(tiledMapPolygonPoints[2].getX()).toBe(1);
  expect(tiledMapPolygonPoints[2].getY()).toBe(2);

  expect(tiledMapPolygonPoints[3].getX()).toBe(2);
  expect(tiledMapPolygonPoints[3].getY()).toBe(4);
});
