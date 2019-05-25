// @flow

import ElementPosition from "./ElementPosition";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import tiledMapParserFixture from "./TiledMapParser.fixture";
import TiledPath from "./TiledPath";
import TiledPathfinder from "./TiledPathfinder";

it("finds the shortest path from point to point on tiled map", async function() {
  const [cancelToken, queryBus, tiledMapPromise] = await tiledMapParserFixture("map-fixture-02-walkable.tmx");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledMap = await tiledMapPromise;
  const tiledPathfinder = new TiledPathfinder(loggerBreadcrumbs, tiledMap);
  const pathStart = new ElementPosition(0, 0);
  const pathEnd = new ElementPosition(9, 6);
  const tiledPath = await tiledPathfinder.findPath(pathStart, pathEnd);

  const correctTiledPath = new TiledPath(loggerBreadcrumbs);
  const correctSteps = [
    [0, 0],
    [1, 0],
    [2, 0],
    [2, 1],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
    [9, 2],
    [10, 2],
    [11, 2],
    [12, 2],
    [13, 2],
    [13, 3],
    [13, 4],
    [13, 5],
    [13, 6],
    [13, 7],
    [13, 8],
    [13, 9],
    [13, 10],
    [13, 11],
    [13, 12],
    [13, 13],
    [12, 13],
    [11, 13],
    [11, 12],
    [11, 11],
    [11, 10],
    [10, 10],
    [9, 10],
    [9, 11],
    [9, 12],
    [9, 13],
    [8, 13],
    [7, 13],
    [6, 13],
    [5, 13],
    [5, 12],
    [5, 11],
    [4, 11],
    [3, 11],
    [2, 11],
    [2, 10],
    [2, 9],
    [3, 9],
    [4, 9],
    [5, 9],
    [5, 8],
    [5, 7],
    [4, 7],
    [3, 7],
    [2, 7],
    [2, 6],
    [2, 5],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
    [7, 5],
    [7, 6],
    [8, 6],
    [9, 6],
  ];

  for (let correctStep of correctSteps) {
    correctTiledPath.addStep(new ElementPosition<"tile">(...correctStep));
  }

  expect(tiledPath.isEqual(correctTiledPath)).toBe(true);
});
