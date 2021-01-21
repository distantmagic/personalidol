import { NearestFilter, RepeatWrapping, RGBAFormat } from "three/src/constants";

import { CanvasTexture } from "three/src/textures/CanvasTexture";

import type { Texture as ITexture } from "three";

export function imageToTexture(image: ImageData | ImageBitmap): ITexture {
  // this typecasting is a hack to make it work with threejs
  const texture = new CanvasTexture((image as unknown) as HTMLImageElement);

  texture.format = RGBAFormat;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.magFilter = texture.minFilter = NearestFilter;
  texture.needsUpdate = true;

  return texture;
}
