// @flow

import type { Equatable } from "./Equatable";
import type { HasElementPosition } from "./HasElementPosition";

export interface TiledPositionedTile extends Equatable<TiledPositionedTile>, HasElementPosition<"tile"> {
  getId(): number;
}
