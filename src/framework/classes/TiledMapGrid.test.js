// @flow

import ElementSize from "./ElementSize";
import TiledMapGrid from "./TiledMapGrid";

it("generates positioned tiles", async function() {
  const tiledMapGrid = new TiledMapGrid([[1, 2], [3, 4]], new ElementSize<"tile">(2, 2));
  const positionedTiles = [];

  for await (let positionedTile of tiledMapGrid.generatePositionedTiles()) {
    positionedTiles.push(positionedTile);
  }

  expect(positionedTiles).toHaveLength(4);

  expect(positionedTiles[0].getId()).toBe(1);
  expect(positionedTiles[0].getElementPosition().getX()).toBe(0);
  expect(positionedTiles[0].getElementPosition().getY()).toBe(0);

  expect(positionedTiles[1].getId()).toBe(2);
  expect(positionedTiles[1].getElementPosition().getX()).toBe(1);
  expect(positionedTiles[1].getElementPosition().getY()).toBe(0);

  expect(positionedTiles[2].getId()).toBe(3);
  expect(positionedTiles[2].getElementPosition().getX()).toBe(0);
  expect(positionedTiles[2].getElementPosition().getY()).toBe(1);

  expect(positionedTiles[3].getId()).toBe(4);
  expect(positionedTiles[3].getElementPosition().getX()).toBe(1);
  expect(positionedTiles[3].getElementPosition().getY()).toBe(1);
});

it("generates covered grid", function() {
  const tiledMapGrid = new TiledMapGrid([[0, 2], [-1, 0]], new ElementSize<"tile">(2, 2));
  const tiledMapCoveredGrid = tiledMapGrid.getCoveredGrid();

  expect(tiledMapCoveredGrid).toEqual([[0, 1], [0, 0]]);
});

it("is equatable", function() {
  const tiledMapGrid1 = new TiledMapGrid([[1, 2], [3, 4]], new ElementSize<"tile">(2, 2));
  const tiledMapGrid2 = new TiledMapGrid([[1, 2], [3, 3]], new ElementSize<"tile">(2, 2));

  expect(tiledMapGrid1.isEqual(tiledMapGrid2)).toBe(false);
});
