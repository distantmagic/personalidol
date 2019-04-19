// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { TiledPositionedTile } from "../interfaces/TiledPositionedTile";
import type { TiledSkinnedTile as TiledSkinnedTileInterface } from "../interfaces/TiledSkinnedTile";
import type { TiledTile } from "../interfaces/TiledTile";

export default class TiledSkinnedTile implements TiledSkinnedTileInterface {
  +id: number;
  +tiledPositionedTile: TiledPositionedTile;
  +tiledTile: TiledTile;

  constructor(
    id: number,
    tiledPositionedTile: TiledPositionedTile,
    tiledTile: TiledTile
  ) {
    this.id = id;
    this.tiledPositionedTile = tiledPositionedTile;
    this.tiledTile = tiledTile;
  }

  getElementPosition(): ElementPosition<"tile"> {
    return this.tiledPositionedTile.getElementPosition();
  }

  getId(): number {
    return this.id;
  }

  getTiledTile(): TiledTile {
    return this.tiledTile;
  }
}
