import { KeyboardIndices } from "./KeyboardIndices.enum";

function createEmptyState(usesSharedBuffer: boolean): Uint8Array {
  if (usesSharedBuffer) {
    // Uint8Array takes 1 bytes per value.
    return new Uint8Array(new SharedArrayBuffer(KeyboardIndices.__TOTAL));
  }

  return new Uint8Array(KeyboardIndices.__TOTAL);
}

export const KeyboardState = Object.freeze({
  createEmptyState: createEmptyState,
});
