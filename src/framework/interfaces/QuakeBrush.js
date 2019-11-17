// @flow

import type { Equatable } from "./Equatable";
import type { QuakeBrushHalfSpace } from "./QuakeBrushHalfSpace";

export interface QuakeBrush extends Equatable<QuakeBrush> {
  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace>;
}
