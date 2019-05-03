// @flow

import type { ElementSize } from "./ElementSize";
import type { JsonSerializable } from "./JsonSerializable";
import type { TiledMapGrid } from "./TiledMapGrid";
import type { TiledMapLayerSerializedObject } from "../types/TiledMapLayerSerializedObject";

export interface TiledMapLayer
  extends JsonSerializable<TiledMapLayerSerializedObject> {
  constructor(name: string, TiledMapGrid, ElementSize<"tile">): void;

  getName(): string;

  getTiledMapGrid(): TiledMapGrid;
}
