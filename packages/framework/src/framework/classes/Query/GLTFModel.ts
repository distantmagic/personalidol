import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import Query from "src/framework/classes/Query";

import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";

export default class GLTFModel extends Query<GLTF> {
  readonly loadingManager: THREE.LoadingManager;
  readonly resourcesPath: string;
  readonly url: string;

  constructor(loadingManager: THREE.LoadingManager, resourcesPath: string, url: string) {
    super();

    this.loadingManager = loadingManager;
    this.resourcesPath = resourcesPath;
    this.url = url;
  }

  // @cancelable(true)
  execute(cancelToken: CancelToken): Promise<GLTF> {
    const loader = new GLTFLoader(this.loadingManager);

    return new Promise((resolve, reject) => {
      loader.setResourcePath(this.resourcesPath);
      loader.load(this.url, resolve, undefined, reject);
    });
  }

  isEqual(other: GLTFModel): boolean {
    return this.url === other.url;
  }
}
