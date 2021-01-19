import { Mesh } from "three/src/objects/Mesh";

import { disposableGeneric } from "./disposableGeneric";
import { disposableMaterial } from "./disposableMaterial";

import type { Mesh as IMesh } from "three/src/objects/Mesh";

export function createEmptyMesh(): IMesh {
  const _mesh: IMesh = new Mesh();

  disposableGeneric(_mesh.geometry)();
  disposableMaterial(_mesh.material)();

  return _mesh;
}
