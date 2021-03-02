import { KeyboardIndices } from "./KeyboardIndices.enum";

function createEmptyState(usesSharedBuffer: boolean): Uint32Array {
  if (usesSharedBuffer) {
    // Int32Array takes 4 bytes per value.
    return new Uint32Array(new SharedArrayBuffer(KeyboardIndices.__TOTAL * 4));
  }

  return new Uint32Array(KeyboardIndices.__TOTAL);
}

export const Keyboard = Object.freeze({
  createEmptyState: createEmptyState,
});
