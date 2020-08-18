import type { TypedArrayMap } from "./TypedArrayMap.type";

let index = 0;

const code: TypedArrayMap = {};

code["LAST_UPDATE"] = index++;
code["D_HEIGHT"] = index++;
code["D_WIDTH"] = index++;
code["P_BOTTOM"] = index++;
code["P_LEFT"] = index++;
code["P_RIGHT"] = index++;
code["P_TOP"] = index++;

function createEmptyState(usesSharedBuffer: boolean): Uint32Array {
  const itemsLength = Object.keys(code).length;

  if (usesSharedBuffer) {
    // Uint32Array takes 4 bytes per value.
    return new Uint32Array(new SharedArrayBuffer(itemsLength * 4));
  }

  return new Uint32Array(itemsLength);
}

export const Dimensions = Object.freeze({
  code: Object.freeze(code),

  createEmptyState: createEmptyState,
});
