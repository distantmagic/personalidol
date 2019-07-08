// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import FixturesFileQueryBuilder from "./FixturesFileQueryBuilder";
import ForcedTick from "./ForcedTick";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import QueryBus from "./QueryBus";
import TiledMapLoader from "./TiledMapLoader";
import TiledTilesetLoader from "./TiledTilesetLoader";

it("loads and parses map files", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const fixturesFileQueryBuilder = new FixturesFileQueryBuilder();
  const mapFilename = fixtures.findPath("map-fixture-01.tmx");
  const queryBus = new QueryBus(loggerBreadcrumbs);
  const tiledTilesetLoader = new TiledTilesetLoader(loggerBreadcrumbs, queryBus, fixturesFileQueryBuilder);
  const tiledMapLoader = new TiledMapLoader(loggerBreadcrumbs, queryBus, fixturesFileQueryBuilder, tiledTilesetLoader);

  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledMap = tiledMapLoader.load(cancelToken, mapFilename);

  await expect(tiledMap).resolves.toBeDefined();

  // first tick for map
  // second tick for tileset
  expect(mockedEnqueuedCallback.mock.calls.length).toBe(2);

  queryBus.offEnqueued(mockedEnqueuedCallback);
}, 1000);

it("loads map files with custom tileset ids", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const fixturesFileQueryBuilder = new FixturesFileQueryBuilder();
  const mapFilename = fixtures.findPath("map-fixture-01.tmx");
  const queryBus = new QueryBus(loggerBreadcrumbs);
  const tiledTilesetLoader = new TiledTilesetLoader(loggerBreadcrumbs, queryBus, fixturesFileQueryBuilder);
  const tiledMapLoader = new TiledMapLoader(loggerBreadcrumbs, queryBus, fixturesFileQueryBuilder, tiledTilesetLoader);

  const mockedEnqueuedCallback = jest.fn(function() {
    queryBus.tick(new ForcedTick(false));
  });

  queryBus.onEnqueued(mockedEnqueuedCallback);

  const tiledMap = tiledMapLoader.load(cancelToken, mapFilename);

  await expect(tiledMap).resolves.toBeDefined();

  // first tick for map
  // second tick for tileset
  expect(mockedEnqueuedCallback.mock.calls.length).toBe(2);

  queryBus.offEnqueued(mockedEnqueuedCallback);
}, 1000);
