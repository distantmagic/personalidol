import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryTouchInitialClientY(touchState: Int32Array): number {
  return touchState[TouchIndices.T0_DOWN_INITIAL_CLIENT_Y];
}
