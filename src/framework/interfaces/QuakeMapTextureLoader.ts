import * as THREE from "three";

import CancelToken from "src/framework/interfaces/CancelToken";

export default interface QuakeMapTextureLoader {
  dispose(): void;

  getTextureIndex(textureName: string): number;

  getTextureSource(textureName: string): string;

  loadTexture(cancelToken: CancelToken, textureName: string): Promise<THREE.Texture>;

  loadTextures(cancelToken: CancelToken, textureNames: ReadonlyArray<string>): Promise<ReadonlyArray<THREE.Texture>>;

  loadRegisteredTextures(cancelToken: CancelToken): Promise<ReadonlyArray<THREE.Texture>>;

  registerTexture(textureName: string, src: string): void;
}
