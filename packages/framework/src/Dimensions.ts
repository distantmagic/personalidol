import { isSharedArrayBufferSupported } from "./isSharedArrayBufferSupported";

import type { TypedArrayMap } from "./TypedArrayMap.type";

let index = 0;

const code: TypedArrayMap = {};

code["D_HEIGHT"] = index++;
code["D_WIDTH"] = index++;
code["P_BOTTOM"] = index++;
code["P_LEFT"] = index++;
code["P_RIGHT"] = index++;
code["P_TOP"] = index++;

const createEmptyState = (function () {
  const itemsLength = Object.keys(code).length;

  if (isSharedArrayBufferSupported()) {
    // Uint16Array takes 2 bytes per value.
    const byteLength = itemsLength * 2;

    return function (): Uint16Array {
      return new Uint16Array(new SharedArrayBuffer(byteLength));
    };
  } else {
    return function (): Uint16Array {
      return new Uint16Array(itemsLength);
    };
  }
})();

export const Dimensions = Object.freeze({
  code: Object.freeze(code),

  createEmptyState: createEmptyState,
});
