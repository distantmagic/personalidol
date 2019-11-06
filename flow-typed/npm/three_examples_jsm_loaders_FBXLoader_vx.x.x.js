import type {
  LoadingManager,
  LoadingManagerOnErrorCallback,
  LoadingManagerOnLoadCallback,
  LoadingManagerOnProgressCallback,
} from "three";

declare module "three/examples/jsm/loaders/FBXLoader" {
  declare export interface FBXLoader {
    constructor(LoadingManager): void;

    load(
      url: string,
      LoadingManagerOnLoadCallback,
      LoadingManagerOnProgressCallback,
      LoadingManagerOnErrorCallback
    ): void;

    setResourcePath(string): void;
  }
}
