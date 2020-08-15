/**
 * This is just a convenience function. We can't just
 * use 'image instanceof ImageBitmap' because ImageData may not be present in a
 * global scope. If it's not present in the global scope, then it would throw
 * an error instead of checking the type.
 */
export function isImageBitmap(image: any): image is ImageBitmap {
  return globalThis.ImageBitmap && image instanceof ImageBitmap;
}
