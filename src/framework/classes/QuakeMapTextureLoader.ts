import * as THREE from "three";

import { default as QuakeMapException } from "./Exception/QuakeMap";
import { default as TextureQuery } from "./Query/Texture";

import { CancelToken } from "../interfaces/CancelToken";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { QueryBus } from "../interfaces/QueryBus";
import { QuakeMapTextureLoader as QuakeMapTextureLoaderInterface } from "../interfaces/QuakeMapTextureLoader";

export default class QuakeMapTextureLoader implements QuakeMapTextureLoaderInterface {
  readonly loadedTextures: Set<THREE.Texture>;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly queryBus: QueryBus;
  readonly textureLoader: THREE.TextureLoader;
  readonly texturesIndex: string[];
  readonly texturesSources: Map<string, string>;
  private _lastId: number;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, loadingManager: THREE.LoadingManager, queryBus: QueryBus) {
    this._lastId = 0;
    this.loadedTextures = new Set<THREE.Texture>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.queryBus = queryBus;
    this.textureLoader = new THREE.TextureLoader(loadingManager);
    this.texturesIndex = [];
    this.texturesSources = new Map<string, string>();
  }

  dispose(): void {
    for (let texture of this.loadedTextures.values()) {
      texture.dispose();
    }
  }

  getTextureIndex(textureName: string): number {
    const index = this.texturesIndex.findIndex(storedTextureName => storedTextureName === textureName);

    if (-1 === index) {
      throw new QuakeMapException(this.loggerBreadcrumbs.add("getTextureIndex"), `Texture is not indexed: ${textureName}`);
    }

    return index;
  }

  getTextureSource(textureName: string): string {
    const textureSource = this.texturesSources.get(textureName);

    if ("string" !== typeof textureSource) {
      throw new QuakeMapException(this.loggerBreadcrumbs.add("getTextureSource"), `Texture is not registered: ${textureName}`);
    }

    return textureSource;
  }

  async loadTexture(cancelToken: CancelToken, textureName: string): Promise<THREE.Texture> {
    const src = this.getTextureSource(textureName);

    const texture = await this.queryBus.enqueue(cancelToken, new TextureQuery(this.textureLoader, src)).whenExecuted();

    texture.name = textureName;
    this.loadedTextures.add(texture);

    return texture;
  }

  loadRegisteredTextures(cancelToken: CancelToken): Promise<ReadonlyArray<THREE.Texture>> {
    return this.loadTextures(cancelToken, this.texturesIndex);
  }

  loadTextures(cancelToken: CancelToken, textureNames: ReadonlyArray<string>): Promise<ReadonlyArray<THREE.Texture>> {
    const loadedTextures = textureNames.map(this.loadTexture.bind(this, cancelToken));

    return Promise.all(loadedTextures);
  }

  registerTexture(textureName: string, src: string): void {
    if (this.texturesSources.has(textureName)) {
      if (src !== this.getTextureSource(textureName)) {
        throw new QuakeMapException(this.loggerBreadcrumbs.add("registerTexture"), `Texture data is inconsistent: "${textureName}": "${src}"`);
      }

      return;
    }

    this.texturesIndex.push(textureName);
    this.texturesSources.set(textureName, src);

    this._lastId += 1;
  }
}
