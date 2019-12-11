// @flow

import autoBind from "auto-bind";
import { MD2Character as MD2CharacterLoader } from "three/examples/jsm/misc/MD2Character";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";
import disposeTexture from "../../helpers/disposeTexture";
import { default as RemoteJSONQuery } from "../Query/RemoteJSON";

import type { Config } from "three/examples/jsm/misc/MD2Character";
import type { Group, LoadingManager as THREELoadingManager, Vector3 } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class MD2Character extends CanvasView {
  +baseUrl: string;
  +group: Group;
  +origin: Vector3;
  +queryBus: QueryBus;
  +skin: number;
  +threeLoadingManager: THREELoadingManager;
  character: ?Object;

  constructor(canvasViewBag: CanvasViewBag, origin: Vector3, queryBus: QueryBus, group: Group, threeLoadingManager: THREELoadingManager, baseUrl: string, skin: number) {
    super(canvasViewBag);
    autoBind(this);

    this.baseUrl = baseUrl;
    this.origin = origin;
    this.queryBus = queryBus;
    this.group = group;
    this.skin = skin;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const query = new RemoteJSONQuery<Config>(`${this.baseUrl}parts.json`);
    const config: Config = await this.queryBus.enqueue(cancelToken, query).whenExecuted();
    const configMerged: Config = {
      ...config,
      baseUrl: this.baseUrl,
    };
    const character = new MD2CharacterLoader();

    return new Promise(resolve => {
      character.onLoadComplete = () => {
        // character.setAnimation(character.meshBody.geometry.animations[8].name);
        character.setAnimation(character.meshBody.geometry.animations[0].name);
        character.setPlaybackRate(1000);
        character.setWeapon(0);
        character.setSkin(this.skin);
        this.character = character;
        this.character.root.position.copy(this.origin);

        this.group.add(character.root);

        resolve();
      };
      character.loadParts(configMerged);
    });
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const character = this.character;

    if (!character) {
      return;
    }

    character.skinsBody.forEach(disposeTexture);
    character.skinsWeapon.forEach(disposeTexture);
    character.weapons.forEach(function(child) {
      disposeObject3D(child, true);
    });
    disposeObject3D(character.meshBody, true);
    disposeObject3D(character.meshWeapon, true);
    disposeObject3D(character.root, true);
    this.group.remove(character.root);
  }

  update(delta: number): void {
    const character = this.character;

    if (character) {
      character.update(delta);
    }
  }

  useUpdate(): boolean {
    return true;
  }
}
