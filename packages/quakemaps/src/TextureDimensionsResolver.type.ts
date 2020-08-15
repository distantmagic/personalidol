import type { AtlasTextureDimension } from "@personalidol/texture-loader/src/AtlasTextureDimension.type";

export type TextureDimensionsResolver = (textureName: string) => AtlasTextureDimension;
