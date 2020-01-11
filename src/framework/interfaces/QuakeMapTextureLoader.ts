import { Texture } from "three";

import { CancelToken } from "./CancelToken";

export interface QuakeMapTextureLoader {
  dispose(): void;

  getTextureIndex(textureName: string): number;

  getTextureSource(textureName: string): string;

  loadTexture(cancelToken: CancelToken, textureName: string): Promise<Texture>;

  loadTextures(cancelToken: CancelToken, textureNames: ReadonlyArray<string>): Promise<ReadonlyArray<Texture>>;

  loadRegisteredTextures(cancelToken: CancelToken): Promise<ReadonlyArray<Texture>>;

  registerTexture(textureName: string, src: string): void;
}
