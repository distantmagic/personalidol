// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";
import type { TiledCustomProperties } from "./TiledCustomProperties";
import type { TiledMapGrid } from "./TiledMapGrid";

export interface TiledMapLayer extends Equatable<TiledMapLayer> {
  getName(): string;

  getLayerSize(): ElementSize<"tile">;

  getTiledCustomProperties(): TiledCustomProperties;

  getTiledMapGrid(): TiledMapGrid;
}
