import { TouchIndices } from "./TouchIndices.enum";

import type { PointerTouch } from "./PointerTouch.type";

const T_VECTOR_SCALE = 32000;

const touches: ReadonlyArray<PointerTouch> = [
  {
    CLIENT_X: TouchIndices.T0_CLIENT_X,
    CLIENT_Y: TouchIndices.T0_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: TouchIndices.T0_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: TouchIndices.T0_DOWN_INITIAL_CLIENT_Y,
    IN_BOUNDS: TouchIndices.T0_IN_BOUNDS,
    PRESSURE: TouchIndices.T0_PRESSURE,
    RELATIVE_X: TouchIndices.T0_RELATIVE_X,
    RELATIVE_Y: TouchIndices.T0_RELATIVE_Y,
    VECTOR_X: TouchIndices.T0_VECTOR_X,
    VECTOR_Y: TouchIndices.T0_VECTOR_Y,
  },
  {
    CLIENT_X: TouchIndices.T1_CLIENT_X,
    CLIENT_Y: TouchIndices.T1_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: TouchIndices.T1_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: TouchIndices.T1_DOWN_INITIAL_CLIENT_Y,
    IN_BOUNDS: TouchIndices.T1_IN_BOUNDS,
    PRESSURE: TouchIndices.T1_PRESSURE,
    RELATIVE_X: TouchIndices.T1_RELATIVE_X,
    RELATIVE_Y: TouchIndices.T1_RELATIVE_Y,
    VECTOR_X: TouchIndices.T1_VECTOR_X,
    VECTOR_Y: TouchIndices.T1_VECTOR_Y,
  },
  {
    CLIENT_X: TouchIndices.T2_CLIENT_X,
    CLIENT_Y: TouchIndices.T2_CLIENT_Y,
    DOWN_INITIAL_CLIENT_X: TouchIndices.T2_DOWN_INITIAL_CLIENT_X,
    DOWN_INITIAL_CLIENT_Y: TouchIndices.T2_DOWN_INITIAL_CLIENT_Y,
    IN_BOUNDS: TouchIndices.T2_IN_BOUNDS,
    PRESSURE: TouchIndices.T2_PRESSURE,
    RELATIVE_X: TouchIndices.T2_RELATIVE_X,
    RELATIVE_Y: TouchIndices.T2_RELATIVE_Y,
    VECTOR_X: TouchIndices.T2_VECTOR_X,
    VECTOR_Y: TouchIndices.T2_VECTOR_Y,
  },
];

function createStateArray(usesSharedBuffer: boolean): Int32Array {
  if (usesSharedBuffer) {
    return new Int32Array(new SharedArrayBuffer(TouchIndices.__TOTAL * Int32Array.BYTES_PER_ELEMENT));
  }

  return new Int32Array(TouchIndices.__TOTAL);
}

function createEmptyState(usesSharedBuffer: boolean): Int32Array {
  return resetStateArray(createStateArray(usesSharedBuffer));
}

function resetStateArray(stateArray: Int32Array): Int32Array {
  stateArray.fill(0);
  stateArray[TouchIndices.T_VECTOR_SCALE] = T_VECTOR_SCALE;

  return stateArray;
}

export const TouchState = Object.freeze({
  touches: touches,
  touches_total: touches.length,

  createEmptyState: createEmptyState,
  resetStateArray: resetStateArray,
});
