import type { Loader, LoadingManagerOnLoadCallback } from "three";

declare module "three/examples/jsm/loaders/OBJLoader2" {
  declare export interface OBJLoader2 extends Loader<Object3D> {
    setCallbackOnLoad(LoadingManagerOnLoadCallback): void;
  }
}
