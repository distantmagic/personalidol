import { DimensionsIndices } from "./DimensionsIndices.enum";

function createEmptyState(usesSharedBuffer: boolean): Uint32Array {
  if (usesSharedBuffer) {
    return new Uint32Array(new SharedArrayBuffer(DimensionsIndices.__TOTAL * Uint32Array.BYTES_PER_ELEMENT));
  }

  return new Uint32Array(DimensionsIndices.__TOTAL);
}

export const DimensionsState = Object.freeze({
  createEmptyState: createEmptyState,
});
