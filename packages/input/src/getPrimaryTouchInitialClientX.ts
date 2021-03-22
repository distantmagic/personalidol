import { TouchIndices } from "./TouchIndices.enum";

export function getPrimaryTouchInitialClientX(touchState: Int32Array): number {
  return touchState[TouchIndices.T0_DOWN_INITIAL_CLIENT_X];
}
