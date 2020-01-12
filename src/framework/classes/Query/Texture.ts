import * as THREE from "three";

import { CancelToken } from "../../interfaces/CancelToken";
import { Query } from "../../interfaces/Query";

export default class Texture implements Query<THREE.Texture> {
  readonly textureLoader: THREE.TextureLoader;
  readonly textureSource: string;

  constructor(textureLoader: THREE.TextureLoader, textureSource: string) {
    this.textureLoader = textureLoader;
    this.textureSource = textureSource;
  }

  async execute(cancelToken: CancelToken): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        this.textureSource,
        texture => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  isEqual(other: Texture): boolean {
    return this.textureSource === other.textureSource;
  }
}
