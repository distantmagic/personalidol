// @flow

import ElementSize from "./ElementSize";
import TiledTileImage from "./TiledTileImage";

it("is equatable", function() {
  const tiledTileImageSize1 = new ElementSize<"px">(10, 10);
  const tiledTileImage1 = new TiledTileImage("foo.png", tiledTileImageSize1);

  const tiledTileImageSize2 = new ElementSize<"px">(20, 20);
  const tiledTileImage2 = new TiledTileImage("foo.png", tiledTileImageSize2);

  expect(tiledTileImage1.isEqual(tiledTileImage2)).toBe(false);
});
