// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledTileImage } from "./TiledTileImage";

export interface TiledTile {
  constructor(id: string, image: TiledTileImage): void;

  getId(): string;
}
