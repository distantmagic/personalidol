// @flow

import * as fixtures from "../../fixtures";
import CancelToken from "./CancelToken";
import TiledTilesetParser from "./TiledTilesetParser";

it("parses tileset files", async function() {
  const cancelToken = new CancelToken();
  const content = await fixtures.file("tileset-fixture-01.tsx");
  const tiledTilesetParser = new TiledTilesetParser(content);
  const tiledTileset = await tiledTilesetParser.parse(cancelToken);

  expect(tiledTileset.getTileById("1")).toBeDefined();
  expect(tiledTileset.getTileById("2")).toBeDefined();
});
