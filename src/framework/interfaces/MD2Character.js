// @flow

import type { Object3D, Texture } from "three";

import type { MD2CharacterMesh } from "../types/MD2CharacterMesh";

export interface MD2Character {
  +weapons: $ReadOnlyArray<MD2CharacterMesh>;
  +meshBody: ?MD2CharacterMesh;
  +meshWeapon: ?MD2CharacterMesh;
  +root: Object3D;
  animationFPS: number;
  animations: Object;
  controls: ?Object;
  loadCounter: number;
  onLoadComplete: () => void;
  skinsBody: Texture[];
  skinsWeapon: Texture[];

  dispose(): void;

  enableShadows(boolean): void;

  setSkin(number): void;

  setWeapon(number): void;

  shareParts(MD2Character): void;

  update(number): void;
}
