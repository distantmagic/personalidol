import type * as THREE from "three";

import type Parser from "src/framework/interfaces/Parser";

export default interface QuakePointParser extends Parser<THREE.Vector3> {}
