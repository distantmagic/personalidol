// @flow

import type { ElementPosition } from "../interfaces/ElementPosition";
import type { TiledPositionedTile } from "../interfaces/TiledPositionedTile";
import type { TiledSkinnedTile as TiledSkinnedTileInterface } from "../interfaces/TiledSkinnedTile";
import type { TiledTile } from "../interfaces/TiledTile";
import type { TiledTileset } from "../interfaces/TiledTileset";

export default class TiledSkinnedTile implements TiledSkinnedTileInterface {
  +id: number;
  +tiledPositionedTile: TiledPositionedTile;
  +tiledTile: TiledTile;
  +tiledTileset: TiledTileset;

  constructor(id: number, tiledPositionedTile: TiledPositionedTile, tiledTile: TiledTile, tiledTileset: TiledTileset) {
    this.id = id;
    this.tiledPositionedTile = tiledPositionedTile;
    this.tiledTile = tiledTile;
    this.tiledTileset = tiledTileset;
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

  getTiledTileset(): TiledTileset {
    return this.tiledTileset;
  }
}
