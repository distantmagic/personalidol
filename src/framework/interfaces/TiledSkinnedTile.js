// @flow

import type { TiledPositionedTile } from "./TiledPositionedTile";
import type { TiledTile } from "./TiledTile";
import type { TiledTileset } from "./TiledTileset";
import type { HasElementPosition } from "./HasElementPosition";

export interface TiledSkinnedTile extends HasElementPosition<"tile"> {
  getId(): number;

  getTiledTile(): TiledTile;

  getTiledTileset(): TiledTileset;
}
