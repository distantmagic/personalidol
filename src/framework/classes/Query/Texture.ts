// @flow strict

import * as THREE from "three";

import type { Texture as THREETexture, TextureLoader } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class Texture implements Query<THREETexture> {
  +textureLoader: TextureLoader;
  +textureSource: string;

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
        null,
        reject
      );
    });
  }

  isEqual(other: Texture): boolean {
    return this.textureSource === other.textureSource;
  }
}
