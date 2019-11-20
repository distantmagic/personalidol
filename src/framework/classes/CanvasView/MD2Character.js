// @flow

import autoBind from "auto-bind";
import { MD2Character as MD2CharacterLoader } from "three/examples/jsm/misc/MD2Character";

import CanvasView from "../CanvasView";
import { default as RemoteJSONQuery } from "../Query/RemoteJSON";

import type { LoadingManager as THREELoadingManager, Vector3, Scene } from "three";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import type { QueryBus } from "../../interfaces/QueryBus";

export default class MD2Character extends CanvasView {
  +baseUrl: string;
  +origin: Vector3;
  +queryBus: QueryBus;
  +scene: Scene;
  +threeLoadingManager: THREELoadingManager;
  character: ?Object;

  constructor(canvasViewBag: CanvasViewBag, origin: Vector3, queryBus: QueryBus, scene: Scene, threeLoadingManager: THREELoadingManager, baseUrl: string) {
    super(canvasViewBag);
    autoBind(this);

    this.baseUrl = baseUrl;
    this.origin = origin;
    this.queryBus = queryBus;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const config = await this.queryBus.enqueue(cancelToken, new RemoteJSONQuery(`${this.baseUrl}parts.json`));
    const configMerged = {
      ...config,
      baseUrl: this.baseUrl,
    };
    const character = new MD2CharacterLoader(this.threeLoadingManager);

    return new Promise(resolve => {
      character.onLoadComplete = () => {
        // character.setAnimation(character.meshBody.geometry.animations[8].name);
        character.setAnimation(character.meshBody.geometry.animations[0].name);
        character.setWeapon(0);
        character.setSkin(0);
        this.character = character;
        this.character.root.position.copy(this.origin);

        this.scene.add(character.root);

        resolve();
      };
      character.loadParts(configMerged);
    });
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const character = this.character;

    if (character) {
      this.scene.remove(character.root);
    }
  }

  update(delta: number): void {
    const character = this.character;

    if (character) {
      character.update(delta / 1000);
    }
  }

  useUpdate(): boolean {
    return true;
  }
}
