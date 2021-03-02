import { PointerIndices } from "./PointerIndices.enum";

import type { PointerTouch } from "./PointerTouch.type";

const touches: ReadonlyArray<PointerTouch> = [
  {
    CLIENT_X: PointerIndices.T0_CLIENT_X,
    CLIENT_Y: PointerIndices.T0_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: PointerIndices.T0_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: PointerIndices.T0_DOWN_INITIAL_CLIENT_Y,
    STRETCH_X: PointerIndices.T0_STRETCH_X,
    STRETCH_Y: PointerIndices.T0_STRETCH_Y,
    IN_BOUNDS: PointerIndices.T0_IN_BOUNDS,
    PRESSURE: PointerIndices.T0_PRESSURE,
    RELATIVE_X: PointerIndices.T0_RELATIVE_X,
    RELATIVE_Y: PointerIndices.T0_RELATIVE_Y,
    STRETCH_VECTOR_X: PointerIndices.T0_STRETCH_VECTOR_X,
    STRETCH_VECTOR_Y: PointerIndices.T0_STRETCH_VECTOR_Y,
    VECTOR_X: PointerIndices.T0_VECTOR_X,
    VECTOR_Y: PointerIndices.T0_VECTOR_Y,
  },
  {
    CLIENT_X: PointerIndices.T1_CLIENT_X,
    CLIENT_Y: PointerIndices.T1_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: PointerIndices.T1_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: PointerIndices.T1_DOWN_INITIAL_CLIENT_Y,
    STRETCH_X: PointerIndices.T1_STRETCH_X,
    STRETCH_Y: PointerIndices.T1_STRETCH_Y,
    IN_BOUNDS: PointerIndices.T1_IN_BOUNDS,
    PRESSURE: PointerIndices.T1_PRESSURE,
    RELATIVE_X: PointerIndices.T1_RELATIVE_X,
    RELATIVE_Y: PointerIndices.T1_RELATIVE_Y,
    STRETCH_VECTOR_X: PointerIndices.T1_STRETCH_VECTOR_X,
    STRETCH_VECTOR_Y: PointerIndices.T1_STRETCH_VECTOR_Y,
    VECTOR_X: PointerIndices.T1_VECTOR_X,
    VECTOR_Y: PointerIndices.T1_VECTOR_Y,
  },
  {
    CLIENT_X: PointerIndices.T2_CLIENT_X,
    CLIENT_Y: PointerIndices.T2_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: PointerIndices.T2_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: PointerIndices.T2_DOWN_INITIAL_CLIENT_Y,
    STRETCH_X: PointerIndices.T2_STRETCH_X,
    STRETCH_Y: PointerIndices.T2_STRETCH_Y,
    IN_BOUNDS: PointerIndices.T2_IN_BOUNDS,
    PRESSURE: PointerIndices.T2_PRESSURE,
    RELATIVE_X: PointerIndices.T2_RELATIVE_X,
    RELATIVE_Y: PointerIndices.T2_RELATIVE_Y,
    STRETCH_VECTOR_X: PointerIndices.T2_STRETCH_VECTOR_X,
    STRETCH_VECTOR_Y: PointerIndices.T2_STRETCH_VECTOR_Y,
    VECTOR_X: PointerIndices.T2_VECTOR_X,
    VECTOR_Y: PointerIndices.T2_VECTOR_Y,
  },
];

function createEmptyState(usesSharedBuffer: boolean): Int32Array {
  if (usesSharedBuffer) {
    // Int32Array takes 2 bytes per value.
    return new Int32Array(new SharedArrayBuffer(PointerIndices.__TOTAL * 4));
  }

  return new Int32Array(PointerIndices.__TOTAL);
}

export const Pointer = Object.freeze({
  range: Object.freeze({
    mouse_min: PointerIndices.M_BUTTON_L,
    mouse_max: PointerIndices.M_VECTOR_Y,

    touches_min: PointerIndices.T_INITIATED_BY_ROOT_ELEMENT,
    touches_max: PointerIndices.T2_VECTOR_Y,
    touches_total: touches.length,

    touch1_min: PointerIndices.T0_CLIENT_X,
    touch1_max: PointerIndices.T0_VECTOR_Y,

    touch2_min: PointerIndices.T1_CLIENT_X,
    touch2_max: PointerIndices.T1_VECTOR_Y,

    touch3_min: PointerIndices.T2_CLIENT_X,
    touch3_max: PointerIndices.T2_VECTOR_Y,
  }),
  touches: touches,
  vector_scale: 32000,

  createEmptyState: createEmptyState,
});
