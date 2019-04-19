// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledPositionedTile } from "./TiledPositionedTile";
import type { TiledTile } from "./TiledTile";

export interface TiledSkinnedTile {
  constructor(id: number, TiledPositionedTile, TiledTile): void;
}
