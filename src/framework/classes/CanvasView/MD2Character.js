// @flow

import autoBind from "auto-bind";
import { MD2Character as MD2CharacterLoader } from "three/examples/jsm/misc/MD2Character";

import CanvasView from "../CanvasView";

import type { LoadingManager as THREELoadingManager, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";

export default class MD2Character extends CanvasView {
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  character: ?Object;

  constructor(canvasViewBag: CanvasViewBag, scene: Scene, threeLoadingManager: THREELoadingManager) {
    super(canvasViewBag);
    autoBind(this);

    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const character = new MD2CharacterLoader(this.threeLoadingManager);
    // const config = {
    //   baseUrl: "/assets/model-md2-ratamahatta/",
    //   body: "ratamahatta.md2",
    //   skins: [
    //     "ratamahatta.png",
    //     "ctf_b.png",
    //     "ctf_r.png",
    //     "dead.png",
    //     "gearwhore.png"
    //   ],
    //   weapons: [
    //     ["weapon.md2", "weapon.png"],
    //     ["w_bfg.md2", "w_bfg.png"],
    //     ["w_blaster.md2", "w_blaster.png"],
    //     ["w_chaingun.md2", "w_chaingun.png"],
    //     ["w_glauncher.md2", "w_glauncher.png"],
    //     ["w_hyperblaster.md2", "w_hyperblaster.png"],
    //     ["w_machinegun.md2", "w_machinegun.png"],
    //     ["w_railgun.md2", "w_railgun.png"],
    //     ["w_rlauncher.md2", "w_rlauncher.png"],
    //     ["w_shotgun.md2", "w_shotgun.png"],
    //     ["w_sshotgun.md2", "w_sshotgun.png"],
    //   ],
    // };
    const config = {
      baseUrl: "/assets/model-md2-ogro/",
      body: "ogro.md2",
      skins: [
        "arboshak.png",
        "ctf_b.png",
        "ctf_r.png",
        "darkam.png",
        "freedom.png",
        "gib.png",
        "gordogh.png",
        "grok.jpg",
        "igdosh.png",
        "khorne.png",
        "nabogro.png",
        "ogrobase.png",
        "sharokh.png",
      ],
      weapons: [["weapon.md2", "weapon.jpg"]],
    };

    return new Promise(resolve => {
      character.onLoadComplete = () => {
        character.setAnimation(character.meshBody.geometry.animations[0].name);
        character.setWeapon(0);
        character.setSkin(7);
        this.character = character;

        this.scene.add(character.root);

        resolve();
      };
      character.loadParts(config);
    });
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const character = this.character;

    if (!character) {
      return;
    }

    this.scene.remove(character.root);
  }

  update(delta: number): void {
    const character = this.character;

    if (character) {
      character.update(delta / 1000);
    }
  }

  useBegin(): boolean {
    return super.useBegin() && false;
  }

  useEnd(): boolean {
    return super.useEnd() && false;
  }
}
