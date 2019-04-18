// @flow

import type { ElementSize } from "./ElementSize";

export interface TiledTileImage {
  constructor(src: string, size: ElementSize): void;
}
