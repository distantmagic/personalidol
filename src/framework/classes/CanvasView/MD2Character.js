// @flow

import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import disposeObject3D from "../../helpers/disposeObject3D";
import disposeTexture from "../../helpers/disposeTexture";
import { default as MD2CharacterQuery } from "../Query/MD2Character";
import { default as RemoteJSONQuery } from "../Query/RemoteJSON";
import { default as THREEMD2Character } from "../MD2Character";

import type { Group, LoadingManager as THREELoadingManager, Vector3 } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { MD2Character as THREEMD2CharacterInterface } from "../../interfaces/MD2Character";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class MD2Character extends CanvasView {
  +baseUrl: string;
  +group: Group;
  +origin: Vector3;
  +queryBus: QueryBus;
  +skin: number;
  +threeLoadingManager: THREELoadingManager;
  character: ?THREEMD2CharacterInterface;

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

    const configQuery = new RemoteJSONQuery<Object>(`${this.baseUrl}parts.json`);
    const config = await this.queryBus.enqueue(cancelToken, configQuery).whenExecuted();
    const configMerged = {
      ...config,
      baseUrl: this.baseUrl,
    };

    const characterQuery = new MD2CharacterQuery(this.threeLoadingManager, configMerged);
    const baseCharacter: THREEMD2CharacterInterface = await this.queryBus.enqueue(cancelToken, characterQuery).whenExecuted();
    const character: THREEMD2CharacterInterface = new THREEMD2Character(this.threeLoadingManager);

    character.controls = {
      crouch: true,
      moveForward: false,
      moveBackward: false,
      moveLeft: false,
      moveRight: false,
    };

    character.shareParts(baseCharacter);

    character.enableShadows(true);
    character.setWeapon(0);
    character.setSkin(this.skin);
    character.setPlaybackRate(1000);

    character.root.position.copy(this.origin);

    this.group.add(character.root);

    this.character = character;
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const character = this.character;

    if (!character) {
      return;
    }

    // character.skinsBody.forEach(disposeTexture);
    // character.skinsWeapon.forEach(disposeTexture);
    // character.weapons.forEach(function(child) {
    //   disposeObject3D(child, true);
    // });
    // disposeObject3D(character.meshBody, true);
    // disposeObject3D(character.meshWeapon, true);
    // disposeObject3D(character.root, true);
    // this.group.remove(character.root);
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
