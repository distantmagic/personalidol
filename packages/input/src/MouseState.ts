import { MouseIndices } from "./MouseIndices.enum";

const M_VECTOR_SCALE = 32000;

function createStateArray(usesSharedBuffer: boolean): Int32Array {
  if (usesSharedBuffer) {
    return new Int32Array(new SharedArrayBuffer(MouseIndices.__TOTAL * Int32Array.BYTES_PER_ELEMENT));
  }

  return new Int32Array(MouseIndices.__TOTAL);
}

function createEmptyState(usesSharedBuffer: boolean): Int32Array {
  return resetStateArray(createStateArray(usesSharedBuffer));
}

function resetStateArray(stateArray: Int32Array): Int32Array {
  stateArray.fill(0);
  stateArray[MouseIndices.M_VECTOR_SCALE] = M_VECTOR_SCALE;

  return stateArray;
}

export const MouseState = Object.freeze({
  createEmptyState: createEmptyState,
  resetStateArray: resetStateArray,
});
