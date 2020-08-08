import { CanvasTexture } from "three/src/textures/CanvasTexture";
import { RepeatWrapping, RGBAFormat } from "three/src/constants";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";

import type { Texture as ITexture } from "three";

import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";

type ImageBitmapResponse = {
  imageBitmap: ImageBitmap;
  rpc: string;
};

type ImageDataBufferResponse = {
  imageDataBuffer: ArrayBuffer;
  imageNaturalHeight: number;
  imageNaturalWidth: number;
  rpc: string;
};

function _onImageBitmap({ imageBitmap }: ImageBitmapResponse) {
  return _onTextureDataLoaded(imageBitmap);
}

function _onImageDataBuffer({ imageDataBuffer, imageNaturalHeight, imageNaturalWidth }: ImageDataBufferResponse) {
  const imageData = new ImageData(new Uint8ClampedArray(imageDataBuffer), imageNaturalWidth, imageNaturalHeight);

  return _onTextureDataLoaded(imageData);
}

function _onTextureDataLoaded(image: ImageData | ImageBitmap): ITexture {
  // this typecasting is a hack to make it work with threejs
  const texture = new CanvasTexture((image as unknown) as HTMLImageElement);

  texture.format = RGBAFormat;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;

  return texture;
}

export function createTextureReceiverMessagesRouter(rpcLookupTable: RPCLookupTable) {
  return createRouter({
    imageBitmap: handleRPCResponse<ImageBitmapResponse, ITexture>(rpcLookupTable, _onImageBitmap),

    imageData: handleRPCResponse<ImageDataBufferResponse, ITexture>(rpcLookupTable, _onImageDataBuffer),
  });
}
