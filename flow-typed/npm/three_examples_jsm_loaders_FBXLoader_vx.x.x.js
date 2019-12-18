import type { Loader, Mesh } from "three";

declare module "three/examples/jsm/loaders/FBXLoader" {
  declare export interface FBXLoader extends Loader<Mesh> {
    setResourcePath(string): void;
  }
}
