import type { Loader } from "three";

declare module "three/examples/jsm/loaders/FBXLoader" {
  declare export interface FBXLoader extends Loader<Object3D> {
    setResourcePath(string): void;
  }
}
