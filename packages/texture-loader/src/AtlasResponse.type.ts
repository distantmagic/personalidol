import type { AtlasTextureDimensions } from "./AtlasTextureDimensions.type";
import type { ImageDataBufferResponse } from "./ImageDataBufferResponse.type";

export type AtlasResponse = ImageDataBufferResponse & {
  textureDimensions: AtlasTextureDimensions;
};
