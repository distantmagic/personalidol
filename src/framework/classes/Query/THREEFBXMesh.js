// @flow

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import type { Mesh } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { Query } from "../../interfaces/Query";

export default class THREEFBXMesh implements Query<Mesh> {
  +source: string;
  +fbxLoader: FBXLoader;

  constructor(fbxLoader: FBXLoader, source: string) {
    this.fbxLoader = fbxLoader;
    this.source = source;
  }

  execute(cancelToken: CancelToken): Promise<Mesh> {
    return new Promise((resolve, reject) => {
      this.fbxLoader.load(this.source, resolve, null, reject);
    });
  }

  isEqual(other: THREEFBXMesh): boolean {
    return this.source === other.source;
  }
}
