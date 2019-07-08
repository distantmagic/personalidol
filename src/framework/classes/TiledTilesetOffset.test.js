// @flow

import ElementSize from "./ElementSize";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";
import TiledTileset from "./TiledTileset";
import TiledTilesetOffset from "./TiledTilesetOffset";

it("finds actual tile id considering offset", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const tiledTilesetTileSize = new ElementSize<"px">(10, 10);
  const tiledTileset = new TiledTileset(loggerBreadcrumbs, 0, tiledTilesetTileSize);
  const tiledTilesetOffset = new TiledTilesetOffset(1, tiledTileset);

  expect(tiledTilesetOffset.getActualTiledTileId(2)).toBe(1);
});
