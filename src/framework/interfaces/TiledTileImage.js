// @flow

import type { ElementSize } from "./ElementSize";

export interface TiledTileImage {
  constructor(src: string, size: ElementSize<"px">): void;

  getSource(): string;
}
