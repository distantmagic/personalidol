// @flow

import type { BufferGeometry, MeshLambertMaterial } from "three";
import type { MorphBlendMesh } from "three/examples/jsm/misc/MorphBlendMesh";

export type MD2CharacterMesh = MorphBlendMesh<BufferGeometry, MeshLambertMaterial>;
