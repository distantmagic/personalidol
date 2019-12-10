import type { Mesh, Object3D, Texture } from "three";

declare module "three/examples/jsm/misc/MD2Character" {
  declare export type Config = {|
    baseUrl?: string,
    body: string,
    skins: $ReadOnlyArray<string>,
    weapons: $ReadOnlyArray<$ReadOnlyArray<string>>,
  |};

  declare export interface MD2Character {
    onLoadComplete: () => void;
    +meshBody: Mesh;
    +meshWeapon: Mesh;
    +skinsBody: $ReadOnlyArray<Texture>;
    +skinsWeapon: $ReadOnlyArray<Texture>;
    +weapons: $ReadOnlyArray<Object3D>;
    +root: Object3D;

    constructor(): void;

    loadParts(Config): void;

    setAnimation(string): void;

    setPlaybackRate(number): void;

    setSkin(number): void;

    setWeapon(number): void;
  }
}
