import { MouseIndices } from "./MouseIndices.enum";

function createEmptyState(usesSharedBuffer: boolean): Int32Array {
  if (usesSharedBuffer) {
    return new Int32Array(new SharedArrayBuffer(MouseIndices.__TOTAL * Int32Array.BYTES_PER_ELEMENT));
  }

  return new Int32Array(MouseIndices.__TOTAL);
}

export const MouseState = Object.freeze({
  vector_scale: 32000,

  createEmptyState: createEmptyState,
});
