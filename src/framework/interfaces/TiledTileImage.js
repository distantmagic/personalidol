// @flow

import type { Equatable } from "./Equatable";
import type { HasElementSize } from "./HasElementSize";

export interface TiledTileImage extends Equatable<TiledTileImage>, HasElementSize<"px"> {
  getSource(): string;
}
