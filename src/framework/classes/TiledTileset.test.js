// @flow

import ElementSize from "./ElementSize";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";
import TiledTileset from "./TiledTileset";
import TiledTilesetUnserializer from "./TiledTilesetUnserializer";

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledTilesetTileSize = new ElementSize<"px">(10, 10);

  const tiledTileset1 = new TiledTileset(
    loggerBreadcrumbs,
    1,
    tiledTilesetTileSize
  );
  const tiledTileImageSize1 = new ElementSize<"px">(10, 10);
  const tiledTileImage1 = new TiledTileImage("foo.png", tiledTileImageSize1);

  tiledTileset1.add(new TiledTile(1, tiledTileImage1));

  const tiledTileset2 = new TiledTileset(
    loggerBreadcrumbs,
    1,
    tiledTilesetTileSize
  );
  const tiledTileImageSize2 = new ElementSize<"px">(20, 20);
  const tiledTileImage2 = new TiledTileImage("foo.png", tiledTileImageSize2);

  tiledTileset2.add(new TiledTile(1, tiledTileImage2));

  expect(tiledTileset1.isEqual(tiledTileset2)).toBe(false);
});

it("is JSON serializable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();

  const tiledTileset = new TiledTileset(
    loggerBreadcrumbs,
    1,
    new ElementSize<"px">(10, 10)
  );
  const tiledTileImageSize = new ElementSize<"px">(10, 10);
  const tiledTileImage = new TiledTileImage("foo.png", tiledTileImageSize);

  tiledTileset.add(new TiledTile(1, tiledTileImage));

  const serialized = tiledTileset.asJson();
  const unserializer = new TiledTilesetUnserializer(loggerBreadcrumbs);
  const unserialized = unserializer.fromJson(serialized);

  expect(tiledTileset.isEqual(unserialized)).toBe(true);
});
