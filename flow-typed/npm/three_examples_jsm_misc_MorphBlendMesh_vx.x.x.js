import type { BufferGeometry, Geometry, Material, Mesh } from "three";

declare module "three/examples/jsm/misc/MorphBlendMesh" {
  declare export interface MorphBlendMesh<T: BufferGeometry | Geometry, U: Material> extends Mesh<T, U> {}
}
