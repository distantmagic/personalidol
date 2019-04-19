// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledTileImage } from "./TiledTileImage";

export interface TiledTile {
  constructor(id: number, image: TiledTileImage): void;

  getId(): number;
}
