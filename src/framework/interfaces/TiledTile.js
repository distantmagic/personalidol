// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { TiledTileImage } from "./TiledTileImage";

export interface TiledTile extends Equatable<TiledTile> {
  constructor(id: number, image: TiledTileImage): void;

  getId(): number;

  getTiledTileImage(): TiledTileImage;
}
