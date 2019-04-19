// @flow

import type { ElementPosition } from "./ElementPosition";
import type { ElementSize } from "./ElementSize";
import type { TiledPositionedTile } from "./TiledPositionedTile";
import type { TiledTile } from "./TiledTile";

export interface TiledSkinnedTile {
  constructor(id: number, TiledPositionedTile, TiledTile): void;

  getElementPosition(): ElementPosition<"tile">;

  getId(): number;

  getTiledTile(): TiledTile;
}
