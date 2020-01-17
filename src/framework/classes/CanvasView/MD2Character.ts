import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "src/framework/classes/CanvasView";
import { default as MD2CharacterQuery } from "src/framework/classes/Query/MD2Character";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";
import { default as RemoteJSONQuery } from "src/framework/classes/Query/RemoteJSON";
import { default as THREEMD2Character } from "src/framework/classes/MD2Character";

import CancelToken from "src/framework/interfaces/CancelToken";
import CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QueryBus from "src/framework/interfaces/QueryBus";
import { default as IMD2Character } from "src/framework/interfaces/MD2Character";

import MD2CharacterConfig from "src/framework/types/MD2CharacterConfig";
import QuakeWorkerMD2Model from "src/framework/types/QuakeWorkerMD2Model";

export default class MD2Character extends CanvasView {
  readonly angle: number;
  readonly animationOffset: number;
  readonly baseUrl: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly origin: THREE.Vector3;
  readonly queryBus: QueryBus;
  readonly skin: number;
  readonly threeLoadingManager: THREE.LoadingManager;
  private baseCharacter: null | IMD2Character = null;
  private character: null | IMD2Character = null;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    canvasViewBag: CanvasViewBag,
    group: THREE.Group,
    queryBus: QueryBus,
    threeLoadingManager: THREE.LoadingManager,
    baseUrl: string,
    animationOffset: number,
    entity: QuakeWorkerMD2Model
  ) {
    super(loggerBreadcrumbs, canvasViewBag, group);
    autoBind(this);

    this.angle = entity.angle;
    this.animationOffset = animationOffset;
    this.baseUrl = baseUrl;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.origin = new THREE.Vector3(entity.origin[0], entity.origin[1], entity.origin[2]);
    this.queryBus = queryBus;
    this.skin = entity.skin;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(cancelToken: CancelToken): Promise<void> {
    await super.attach(cancelToken);

    const configQuery = new RemoteJSONQuery<MD2CharacterConfig>(`${this.baseUrl}parts.json`);
    const config = await this.queryBus.enqueue(cancelToken, configQuery).whenExecuted();
    const configMerged = {
      ...config,
      baseUrl: this.baseUrl,
    };

    const characterQuery = new MD2CharacterQuery(this.loggerBreadcrumbs.add("attach"), this.threeLoadingManager, configMerged);
    const baseCharacter: IMD2Character = await this.queryBus.enqueue(cancelToken, characterQuery).whenExecuted();
    const character: IMD2Character = new THREEMD2Character(this.loggerBreadcrumbs.add("attach"), this.threeLoadingManager);

    character.controls = {
      attack: false,
      crouch: false,
      jump: false,
      moveBackward: false,
      moveForward: false,
      moveLeft: false,
      moveRight: false,
    };

    character.shareParts(baseCharacter);

    character.enableShadows(true);
    character.setWeapon(0);
    character.setSkin(this.skin);
    character.update(this.animationOffset);

    character.root.position.copy(this.origin);
    character.root.rotation.y = THREE.Math.degToRad(this.angle);

    this.children.add(character.root);

    this.character = character;
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    const baseCharacter = this.baseCharacter;

    if (baseCharacter) {
      baseCharacter.dispose();
    }
  }

  getCharacter(): IMD2Character {
    const character = this.character;

    if (!character) {
      throw new QuakeMapException(this.loggerBreadcrumbs.add("getCharacter"), "Character is not set, but it was expected.");
    }

    return character;
  }

  getName(): "MD2Character" {
    return "MD2Character";
  }

  update(delta: number): void {
    super.update(delta);

    this.getCharacter().update(delta / 1000);
  }

  useUpdate(): boolean {
    return true;
  }
}
