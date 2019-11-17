// @flow

import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import type { QuakeBrushHalfSpaceTrio as QuakeBrushHalfSpaceTrioInterface } from "../interfaces/QuakeBrushHalfSpaceTrio";

export default class QuakeBrushHalfSpaceTrio implements QuakeBrushHalfSpaceTrioInterface {
  +hs1: QuakeBrushHalfSpace;
  +hs2: QuakeBrushHalfSpace;
  +hs3: QuakeBrushHalfSpace;

  constructor(hs1: QuakeBrushHalfSpace, hs2: QuakeBrushHalfSpace, hs3: QuakeBrushHalfSpace) {
    this.hs1 = hs1;
    this.hs2 = hs2;
    this.hs3 = hs3;
  }
}
