import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { CancelToken } from "../../interfaces/CancelToken";
import { Query } from "../../interfaces/Query";

type GLTFLoaderResponse = {
  scene: THREE.Scene;
};

export default class GLTFModel implements Query<GLTFLoaderResponse> {
  readonly loadingManager: THREE.LoadingManager;
  readonly resourcesPath: string;
  readonly url: string;

  constructor(loadingManager: THREE.LoadingManager, resourcesPath: string, url: string) {
    this.loadingManager = loadingManager;
    this.resourcesPath = resourcesPath;
    this.url = url;
  }

  execute(cancelToken: CancelToken): Promise<GLTFLoaderResponse> {
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
