import { KeyboardIndices } from "./KeyboardIndices.enum";

function createEmptyState(usesSharedBuffer: boolean): Uint8Array {
  if (usesSharedBuffer) {
    return new Uint8Array(new SharedArrayBuffer(KeyboardIndices.__TOTAL * Uint8Array.BYTES_PER_ELEMENT));
  }

  return new Uint8Array(KeyboardIndices.__TOTAL);
}

export const KeyboardState = Object.freeze({
  createEmptyState: createEmptyState,
});
