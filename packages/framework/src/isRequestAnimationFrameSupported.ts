export function isRequestAnimationFrameSupported(): boolean {
  return "function" === typeof globalThis.requestAnimationFrame;
}
