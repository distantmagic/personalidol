// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledMapGrid } from "./TiledMapGrid";

export interface TiledMapLayer {
  constructor(name: string, TiledMapGrid, ElementSize<"tile">): void;

  getTiledMapGrid(): TiledMapGrid;
}
