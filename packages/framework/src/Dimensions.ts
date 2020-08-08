import type { TypedArrayMap } from "./TypedArrayMap.type";

let index = 0;

const code: TypedArrayMap = {};

code["D_HEIGHT"] = index++;
code["D_WIDTH"] = index++;
code["P_BOTTOM"] = index++;
code["P_LEFT"] = index++;
code["P_RIGHT"] = index++;
code["P_TOP"] = index++;

function createEmptyState(): Uint16Array {
  return new Uint16Array(Object.keys(code).length);
}

export const Dimensions = Object.freeze({
  code: Object.freeze(code),

  createEmptyState: createEmptyState,
});
