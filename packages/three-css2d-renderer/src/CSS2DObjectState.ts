import { CSS2DObjectStateIndices } from "./CSS2DObjectStateIndices.enum";

function createEmptyState(usesSharedBuffer: boolean): Float32Array {
  if (usesSharedBuffer) {
    return new Float32Array(new SharedArrayBuffer(CSS2DObjectStateIndices.__TOTAL * Float32Array.BYTES_PER_ELEMENT));
  }

  return new Float32Array(CSS2DObjectStateIndices.__TOTAL);
}

export const CSS2DObjectState = Object.freeze({
  createEmptyState: createEmptyState,
});
