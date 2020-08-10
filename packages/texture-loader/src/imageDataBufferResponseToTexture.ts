import { imageDataBufferResponseToImageData } from "./imageDataBufferResponseToImageData";
import { imageToTexture } from "./imageToTexture";

import type { Texture as ITexture } from "three";

import type { ImageDataBufferResponse } from "./ImageDataBufferResponse.type";

export function imageDataBufferResponseToTexture(response: ImageDataBufferResponse): ITexture {
  return imageToTexture(imageDataBufferResponseToImageData(response));
}
