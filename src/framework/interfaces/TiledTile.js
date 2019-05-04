// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledTileImage } from "./TiledTileImage";
import type { TiledTileSerializedObject } from "../types/TiledTileSerializedObject";

export interface TiledTile
  extends Equatable<TiledTile>,
    JsonSerializable<TiledTileSerializedObject> {
  constructor(id: number, image: TiledTileImage): void;

  getId(): number;

  getTiledTileImage(): TiledTileImage;
}
