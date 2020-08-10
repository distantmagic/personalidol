import type { ImageDataBufferResponse } from "./ImageDataBufferResponse.type";

export function imageDataBufferResponseToImageData({ imageDataBuffer, imageDataHeight, imageDataWidth }: ImageDataBufferResponse) {
  return new ImageData(new Uint8ClampedArray(imageDataBuffer), imageDataWidth, imageDataHeight);
}
