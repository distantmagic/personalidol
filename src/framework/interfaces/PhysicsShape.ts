import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";
import type ElementRotationUnit from "src/framework/enums/ElementRotationUnit";

import type ElementPosition from "src/framework/interfaces/ElementPosition";
import type ElementRotation from "src/framework/interfaces/ElementRotation";
import type ElementSize from "src/framework/interfaces/ElementSize";

export default interface PhysicsShape {
  getOrigin(): ElementPosition<ElementPositionUnit.Px>;

  getRotation(): ElementRotation<ElementRotationUnit.Radians>;

  getSize(): ElementSize<ElementPositionUnit.Px>;
}
