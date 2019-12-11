// @flow

import type { Texture } from "three";

import type { CancelToken } from "./CancelToken";

export interface TextureLoader {
  dispose(): void;

  getTextureSource(textureName: string): string;

  loadTexture(CancelToken, textureName: string): Promise<Texture>;

  loadTextures(CancelToken, textureNames: $ReadOnlyArray<string>): Promise<$ReadOnlyArray<Texture>>;

  registerTexture(textureName: string, src: string): void;
}
