import * as THREE from "three";

import { Texture as THREETexture, TextureLoader } from "three";

import { CancelToken } from "../../interfaces/CancelToken";
import { Query } from "../../interfaces/Query";

export default class Texture implements Query<THREETexture> {
  readonly textureLoader: TextureLoader;
  readonly textureSource: string;

  constructor(textureLoader: TextureLoader, textureSource: string) {
    this.textureLoader = textureLoader;
    this.textureSource = textureSource;
  }

  async execute(cancelToken: CancelToken): Promise<THREETexture> {
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
