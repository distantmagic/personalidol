import { InputIndices } from "./InputIndices.enum";

import type { InputTouch } from "./InputTouch.type";

const touches: ReadonlyArray<InputTouch> = [
  {
    CLIENT_X: InputIndices.T0_CLIENT_X,
    CLIENT_Y: InputIndices.T0_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: InputIndices.T0_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: InputIndices.T0_DOWN_INITIAL_CLIENT_Y,
    STRETCH_X: InputIndices.T0_STRETCH_X,
    STRETCH_Y: InputIndices.T0_STRETCH_Y,
    IN_BOUNDS: InputIndices.T0_IN_BOUNDS,
    PRESSURE: InputIndices.T0_PRESSURE,
    RELATIVE_X: InputIndices.T0_RELATIVE_X,
    RELATIVE_Y: InputIndices.T0_RELATIVE_Y,
    STRETCH_VECTOR_X: InputIndices.T0_STRETCH_VECTOR_X,
    STRETCH_VECTOR_Y: InputIndices.T0_STRETCH_VECTOR_Y,
    VECTOR_X: InputIndices.T0_VECTOR_X,
    VECTOR_Y: InputIndices.T0_VECTOR_Y,
  },
  {
    CLIENT_X: InputIndices.T1_CLIENT_X,
    CLIENT_Y: InputIndices.T1_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: InputIndices.T1_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: InputIndices.T1_DOWN_INITIAL_CLIENT_Y,
    STRETCH_X: InputIndices.T1_STRETCH_X,
    STRETCH_Y: InputIndices.T1_STRETCH_Y,
    IN_BOUNDS: InputIndices.T1_IN_BOUNDS,
    PRESSURE: InputIndices.T1_PRESSURE,
    RELATIVE_X: InputIndices.T1_RELATIVE_X,
    RELATIVE_Y: InputIndices.T1_RELATIVE_Y,
    STRETCH_VECTOR_X: InputIndices.T1_STRETCH_VECTOR_X,
    STRETCH_VECTOR_Y: InputIndices.T1_STRETCH_VECTOR_Y,
    VECTOR_X: InputIndices.T1_VECTOR_X,
    VECTOR_Y: InputIndices.T1_VECTOR_Y,
  },
  {
    CLIENT_X: InputIndices.T2_CLIENT_X,
    CLIENT_Y: InputIndices.T2_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: InputIndices.T2_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: InputIndices.T2_DOWN_INITIAL_CLIENT_Y,
    STRETCH_X: InputIndices.T2_STRETCH_X,
    STRETCH_Y: InputIndices.T2_STRETCH_Y,
    IN_BOUNDS: InputIndices.T2_IN_BOUNDS,
    PRESSURE: InputIndices.T2_PRESSURE,
    RELATIVE_X: InputIndices.T2_RELATIVE_X,
    RELATIVE_Y: InputIndices.T2_RELATIVE_Y,
    STRETCH_VECTOR_X: InputIndices.T2_STRETCH_VECTOR_X,
    STRETCH_VECTOR_Y: InputIndices.T2_STRETCH_VECTOR_Y,
    VECTOR_X: InputIndices.T2_VECTOR_X,
    VECTOR_Y: InputIndices.T2_VECTOR_Y,
  },
];

function createEmptyState(usesSharedBuffer: boolean): Int32Array {
  if (usesSharedBuffer) {
    // Int32Array takes 2 bytes per value.
    return new Int32Array(new SharedArrayBuffer(InputIndices.__TOTAL * 4));
  }

  return new Int32Array(InputIndices.__TOTAL);
}

export const Input = Object.freeze({
  range: Object.freeze({
    mouse_min: InputIndices.M_BUTTON_L,
    mouse_max: InputIndices.M_VECTOR_Y,

    touches_min: InputIndices.T_TOTAL,
    touches_max: InputIndices.T2_VECTOR_Y,
    touches_total: touches.length,

    touch1_min: InputIndices.T0_CLIENT_X,
    touch1_max: InputIndices.T0_VECTOR_Y,

    touch2_min: InputIndices.T1_CLIENT_X,
    touch2_max: InputIndices.T1_VECTOR_Y,

    touch3_min: InputIndices.T2_CLIENT_X,
    touch3_max: InputIndices.T2_VECTOR_Y,
  }),
  touches: touches,
  vector_scale: 32000,

  createEmptyState: createEmptyState,
});
