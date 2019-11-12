// @flow

import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfPlane } from "../interfaces/QuakeBrushHalfPlane";

export default class QuakeBrush implements QuakeBrushInterface {
  +halfPlanes: $ReadOnlyArray<QuakeBrushHalfPlane>;

  constructor(halfPlanes: $ReadOnlyArray<QuakeBrushHalfPlane>) {
    this.halfPlanes = halfPlanes;
  }
}
