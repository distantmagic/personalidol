// @flow

import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import tiledMapParser from "../fixtures/tiledMapParser";
import TiledMapSerializer from "./TiledMapSerializer";
import TiledMapUnserializer from "./TiledMapUnserializer";

it("serializes map", async function () {
  const [cancelToken, queryBus, tiledMapPromise] = await tiledMapParser();
  const tiledMap = await tiledMapPromise;

  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledMapSerializer = new TiledMapSerializer(loggerBreadcrumbs, tiledMap);
  const serialized = tiledMapSerializer.asJson();

  expect(function () {
    JSON.parse(serialized)
  }).not.toThrow();

  const tiledMapUnserializer = new TiledMapUnserializer(loggerBreadcrumbs, serialized);
  const unserialized = tiledMapUnserializer.fromJson();

  expect(tiledMap.isEqual(unserialized)).toBe(true);
});
