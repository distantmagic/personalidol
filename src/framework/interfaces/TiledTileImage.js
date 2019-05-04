// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledTileImageSerializedObject } from "../types/TiledTileImageSerializedObject";

export interface TiledTileImage
  extends Equatable<TiledTileImage>,
    JsonSerializable<TiledTileImageSerializedObject> {
  getElementSize(): ElementSize<"px">;

  getSource(): string;
}
