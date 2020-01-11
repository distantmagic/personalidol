import { Object3D, Texture } from "three";
import { MorphBlendMesh } from "three/examples/jsm/misc/MorphBlendMesh";

import { MD2CharacterAnimations } from "../types/MD2CharacterAnimations";
import { MD2CharacterControls } from "../types/MD2CharacterControls";

export interface MD2Character {
  readonly weapons: ReadonlyArray<MorphBlendMesh>;
  readonly meshBody: null | MorphBlendMesh;
  readonly meshWeapon: null | MorphBlendMesh;
  readonly root: Object3D;
  animationFPS: number;
  animations: null | MD2CharacterAnimations;
  controls: null | MD2CharacterControls;
  loadCounter: number;
  onLoadComplete: () => void;
  skinsBody: Texture[];
  skinsWeapon: Texture[];

  dispose(): void;

  enableShadows(enabled: boolean): void;

  setSkin(skinId: number): void;

  setWeapon(weaponId: number): void;

  shareParts(character: MD2Character): void;

  update(delta: number): void;
}
