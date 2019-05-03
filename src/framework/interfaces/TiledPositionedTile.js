// @flow

import type { ElementPosition } from "./ElementPosition";
import type { Equatable } from "./Equatable";

export interface TiledPositionedTile extends Equatable<TiledPositionedTile> {
  constructor(id: number, ElementPosition<"tile">): void;

  getElementPosition(): ElementPosition<"tile">;

  getId(): number;

  isEqual(TiledPositionedTile): boolean;
}
