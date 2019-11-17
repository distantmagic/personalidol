// @flow

import type { Equatable } from "./Equatable";
import type { QuakeBrushHalfSpace } from "./QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio } from "./QuakeBrushHalfSpaceTrio";

export interface QuakeBrush extends Equatable<QuakeBrush> {
  generateHalfSpaceTrios(): Generator<QuakeBrushHalfSpaceTrio, void, void>;

  getHalfSpaces(): $ReadOnlyArray<QuakeBrushHalfSpace>;
}
