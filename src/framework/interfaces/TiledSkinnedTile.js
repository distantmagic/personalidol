// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementSize } from "./ElementSize";
import type { TiledPositionedTile } from "./TiledPositionedTile";
import type { TiledTile } from "./TiledTile";
import type { TiledTileset } from "./TiledTileset";

export interface TiledSkinnedTile {
  getElementPosition(): ElementPosition<"tile">;

  getId(): number;

  getTiledTile(): TiledTile;

  getTiledTileset(): TiledTileset;
}
