// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledCustomProperties } from "./TiledCustomProperties";
import type { TiledMapGrid } from "./TiledMapGrid";
import type { TiledMapLayerSerializedObject } from "../types/TiledMapLayerSerializedObject";

export interface TiledMapLayer extends Equatable<TiledMapLayer>, JsonSerializable<TiledMapLayerSerializedObject> {
  getName(): string;

  getLayerSize(): ElementSize<"tile">;

  getTiledCustomProperties(): TiledCustomProperties;

  getTiledMapGrid(): TiledMapGrid;
}
