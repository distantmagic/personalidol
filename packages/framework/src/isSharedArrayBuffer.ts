import { isSharedArrayBufferSupported } from "./isSharedArrayBufferSupported";

export function isSharedArrayBuffer(item: any): item is SharedArrayBuffer {
  return isSharedArrayBufferSupported() && item instanceof globalThis.SharedArrayBuffer;
}
