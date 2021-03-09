import { MouseIndices } from "./MouseIndices.enum";

function createEmptyState(usesSharedBuffer: boolean): Int32Array {
  if (usesSharedBuffer) {
    // Int32Array takes 4 bytes per value.
    return new Int32Array(new SharedArrayBuffer(MouseIndices.__TOTAL * 4));
  }

  return new Int32Array(MouseIndices.__TOTAL);
}

export const MouseState = Object.freeze({
  vector_scale: 32000,

  createEmptyState: createEmptyState,
});
