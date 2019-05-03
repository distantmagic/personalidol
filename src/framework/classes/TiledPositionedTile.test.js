// @flow

import ElementPosition from "./ElementPosition";
import TiledPositionedTile from "./TiledPositionedTile";

it("is equatable", function () {
  const tile1 = new TiledPositionedTile(1, new ElementPosition(0, 0));
  const tile2 = new TiledPositionedTile(1, new ElementPosition(0, 0));

  expect(tile1.isEqual(tile2)).toBe(true);
});
