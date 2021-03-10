export function isSharedArrayBufferSupported(): boolean {
  return "function" === typeof globalThis.SharedArrayBuffer;
}
