// @flow

import ElementSize from "./ElementSize";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";
import TiledTileset from "./TiledTileset";
import TiledTilesetOffset from "./TiledTilesetOffset";
import TiledTilesetOffsetCollection from "./TiledTilesetOffsetCollection";

it("is equatable", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledTilesetTileSize = new ElementSize<"px">(10, 10);
  const tiledTileset = new TiledTileset(loggerBreadcrumbs, 0, tiledTilesetTileSize);
  const tiledTilesetOffset = new TiledTilesetOffset(1, tiledTileset);

  const tiledTilesetOffsetCollection1 = new TiledTilesetOffsetCollection(loggerBreadcrumbs);

  const tiledTilesetOffsetCollection2 = new TiledTilesetOffsetCollection(loggerBreadcrumbs);

  tiledTilesetOffsetCollection2.addTiledTilesetOffset(tiledTilesetOffset);

  const tiledTilesetOffsetCollection3 = new TiledTilesetOffsetCollection(loggerBreadcrumbs);

  tiledTilesetOffsetCollection3.addTiledTilesetOffset(tiledTilesetOffset);

  expect(tiledTilesetOffsetCollection1.isEqual(tiledTilesetOffsetCollection2)).toBe(false);
  expect(tiledTilesetOffsetCollection2.isEqual(tiledTilesetOffsetCollection3)).toBe(true);
});
