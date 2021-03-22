import { computePointerStretchVector } from "./computePointerStretchVector";
import { getPrimaryPointerClientX } from "./getPrimaryPointerClientX";
import { getPrimaryPointerClientY } from "./getPrimaryPointerClientY";
import { getPrimaryPointerInitialClientX } from "./getPrimaryPointerInitialClientX";
import { getPrimaryPointerInitialClientY } from "./getPrimaryPointerInitialClientY";

import type { Vector2 } from "three/src/math/Vector2";

export function computePrimaryPointerStretchVector(target: Vector2, dimensionsState: Uint32Array, mouseState: Int32Array, touchState: Int32Array, stretch: number = 200): void {
  computePointerStretchVector(
    target,
    getPrimaryPointerInitialClientX(mouseState, touchState),
    getPrimaryPointerClientX(mouseState, touchState),
    getPrimaryPointerInitialClientY(mouseState, touchState),
    getPrimaryPointerClientY(mouseState, touchState),
    stretch
  );
}
