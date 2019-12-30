// @flow

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import type {  LoadingManager, Object3D } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class FBXModel implements Query<Object3D> {
  +loadingManager: LoadingManager;
  +resourcesPath: string;
  +url: string;

  constructor(loadingManager: LoadingManager, resourcesPath: string, url: string) {
    this.loadingManager = loadingManager;
    this.resourcesPath = resourcesPath;
    this.url = url;
  }

  execute(cancelToken: CancelToken): Promise<Object3D> {
    const loader = new FBXLoader(this.loadingManager);

    return new Promise((resolve, reject) => {
      loader.setResourcePath(this.resourcesPath);
      loader.load(this.url, resolve, null, reject);
    });
  }

  isEqual(other: FBXModel): boolean {
    return this.url === other.url;
  }
}
