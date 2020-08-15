/**
 * This function is just for consistency with `isImageBitmap`.
 *
 * @see isImageBitmap
 */
export function isImageData(image: any): image is ImageData {
  return image instanceof ImageData;
}
