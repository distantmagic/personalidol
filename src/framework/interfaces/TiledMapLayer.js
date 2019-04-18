// @flow

import type { ElementSize } from "./ElementSize";
import type { TiledMapGrid } from "./TiledMapGrid";

export interface TiledMapLayer {
  constructor(
    id: number,
    name: string,
    TiledMapGrid,
    ElementSize<"tile">
  ): void;

  getId(): number;
}
