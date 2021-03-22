import { computePointerStretchVector } from "./computePointerStretchVector";
import { TouchIndices } from "./TouchIndices.enum";

import type { Vector2 } from "three/src/math/Vector2";

export function computePrimaryTouchStretchVector(target: Vector2, touchState: Int32Array, spread: number = 200): void {
  computePointerStretchVector(
    target,
    touchState[TouchIndices.T0_DOWN_INITIAL_CLIENT_X],
    touchState[TouchIndices.T0_CLIENT_X],
    touchState[TouchIndices.T0_DOWN_INITIAL_CLIENT_Y],
    touchState[TouchIndices.T0_CLIENT_Y],
    spread
  );
}
