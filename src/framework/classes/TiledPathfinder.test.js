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
    [2, 0],
    [2, 2],
    [13, 2],
    [13, 13],
    [11, 13],
    [11, 10],
    [9, 10],
    [9, 13],
    [5, 13],
    [5, 11],
    [2, 11],
    [2, 9],
    [5, 9],
    [5, 7],
    [2, 7],
    [2, 4],
    [7, 4],
    [7, 6],
    [9, 6],
  ];

  for (let correctStep of correctSteps) {
    correctTiledPath.addStep(new ElementPosition<"tile">(...correctStep));
  }

  expect(tiledPath.isEqual(correctTiledPath)).toBe(true);
});
