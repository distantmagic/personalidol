// @flow

import ElementSize from "./ElementSize";
import TiledTile from "./TiledTile";
import TiledTileImage from "./TiledTileImage";

it("is equatable", function() {
  const tiledTileImageSize1 = new ElementSize<"px">(10, 10);
  const tiledTileImage1 = new TiledTileImage("foo.png", tiledTileImageSize1);
  const tiledTile1 = new TiledTile(1, tiledTileImage1);

  const tiledTileImageSize2 = new ElementSize<"px">(20, 20);
  const tiledTileImage2 = new TiledTileImage("foo.png", tiledTileImageSize2);
  const tiledTile2 = new TiledTile(1, tiledTileImage2);

  expect(tiledTile1.isEqual(tiledTile2)).toBe(false);
});
