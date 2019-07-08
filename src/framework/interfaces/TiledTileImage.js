// @flow

import type { ElementSize } from "./ElementSize";
import type { Equatable } from "./Equatable";

export interface TiledTileImage extends Equatable<TiledTileImage> {
  getElementSize(): ElementSize<"px">;

  getSource(): string;
}
