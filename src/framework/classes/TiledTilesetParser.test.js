// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";
import TiledTilesetParser from "./TiledTilesetParser";

it("parses tileset files", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const tilesetFilename = "tileset-fixture-01.tsx";
  const tilesetFilenameAbsolute = fixtures.findPath(tilesetFilename);
  const content = await fixtures.file(tilesetFilename);

  const tilesetElement = document.createElement("tileset");

  tilesetElement.setAttribute("firstgid", "1");

  const tiledTilesetParser = new TiledTilesetParser(
    loggerBreadcrumbs,
    tilesetElement,
    tilesetFilenameAbsolute,
    content
  );
  const tiledTileset = await tiledTilesetParser.parse(cancelToken);

  expect(tiledTileset.getTileById(1)).toBeDefined();

  const tile2 = tiledTileset.getTileById(2);

  expect(tile2).toBeDefined();

  const tile2ImageSource = tile2.getTiledTileImage().getSource();

  expect(tile2ImageSource).toBe(fixtures.findPath("texture-gray-rock-128.jpg"));
});
