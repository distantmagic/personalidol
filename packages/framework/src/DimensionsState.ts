import { DimensionsIndices } from "./DimensionsIndices.enum";

const UINT32_BYTES: 4 = 4;

function createEmptyState(usesSharedBuffer: boolean): Uint32Array {
  if (usesSharedBuffer) {
    // Uint32Array takes 4 bytes per value.
    return new Uint32Array(new SharedArrayBuffer(DimensionsIndices.__TOTAL * UINT32_BYTES));
  }

  return new Uint32Array(DimensionsIndices.__TOTAL);
}

export const DimensionsState = Object.freeze({
  createEmptyState: createEmptyState,
});
