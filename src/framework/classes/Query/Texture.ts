import * as THREE from "three";

import Query from "src/framework/classes/Query";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";

export default class Texture extends Query<THREE.Texture> {
  readonly textureLoader: THREE.TextureLoader;
  readonly textureSource: string;
  private static uuid = THREE.MathUtils.generateUUID();

  constructor(textureLoader: THREE.TextureLoader, textureSource: string) {
    super();

    this.textureLoader = textureLoader;
    this.textureSource = textureSource;
  }

  @cancelable(true)
  async execute(cancelToken: CancelToken): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        this.textureSource,
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  getQueryUUID(): string {
    return Texture.uuid;
  }

  isEqual(other: Texture): boolean {
    return this.textureSource === other.textureSource;
  }
}
