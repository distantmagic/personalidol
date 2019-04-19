// @flow

import type { ElementPosition } from "./ElementPosition";

export interface TiledPositionedTile {
  constructor(id: number, ElementPosition<"tile">): void;

  getElementPosition(): ElementPosition<"tile">;

  getId(): number;
}
