// @flow

import type {
  Mesh,
  Object3D,
  Texture,
} from "three";
import type { MorphBlendMesh } from "three/examples/jsm/misc/MorphBlendMesh";

export interface MD2Character {
  +weapons: $ReadOnlyArray<Mesh>;
  +meshBody: ?MorphBlendMesh;
  +meshWeapon: ?MorphBlendMesh;
  +root: Object3D;
  animationFPS: number;
  animations: Object;
  controls: ?Object;
  loadCounter: number;
  onLoadComplete: () => void;
  skinsBody: Texture[];
  skinsWeapon: Texture[];

  enableShadows(bool): void;

  setPlaybackRate(number): void;

  setSkin(number): void;

  setWeapon(number): void;

  shareParts(MD2Character): void;

  update(number): void;
}
