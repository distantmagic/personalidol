import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "../CanvasView";
import { default as MD2CharacterQuery } from "../Query/MD2Character";
import { default as QuakeMapException } from "../Exception/QuakeMap";
import { default as RemoteJSONQuery } from "../Query/RemoteJSON";
import { default as THREEMD2Character } from "../MD2Character";

import { CancelToken } from "../../interfaces/CancelToken";
import { CanvasViewBag } from "../../interfaces/CanvasViewBag";
import { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import { MD2Character as THREEMD2CharacterInterface } from "../../interfaces/MD2Character";
import { MD2CharacterConfig } from "../../types/MD2CharacterConfig";
import { QuakeWorkerMD2Model } from "../../types/QuakeWorkerMD2Model";
import { QueryBus } from "../../interfaces/QueryBus";

export default class MD2Character extends CanvasView {
  readonly angle: number;
  readonly animationOffset: number;
  readonly baseUrl: string;
  readonly group: THREE.Group;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly origin: THREE.Vector3;
  readonly queryBus: QueryBus;
  readonly skin: number;
  readonly threeLoadingManager: THREE.LoadingManager;
  private baseCharacter: null | THREEMD2CharacterInterface = null;
  private character: null | THREEMD2CharacterInterface = null;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    canvasViewBag: CanvasViewBag,
    origin: THREE.Vector3,
    queryBus: QueryBus,
    group: THREE.Group,
    threeLoadingManager: THREE.LoadingManager,
    baseUrl: string,
    animationOffset: number,
    entity: QuakeWorkerMD2Model,
  ) {
    super(canvasViewBag);
    autoBind(this);

    this.angle = entity.angle;
    this.animationOffset = animationOffset;
    this.baseUrl = baseUrl;
    this.group = group;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.origin = origin;
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

    const characterQuery = new MD2CharacterQuery(this.threeLoadingManager, configMerged);
    const baseCharacter: THREEMD2CharacterInterface = await this.queryBus.enqueue(cancelToken, characterQuery).whenExecuted();
    const character: THREEMD2CharacterInterface = new THREEMD2Character(this.threeLoadingManager);

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
    this.group.add(this.children);

    this.character = character;
  }

  async dispose(cancelToken: CancelToken): Promise<void> {
    await super.dispose(cancelToken);

    this.group.remove(this.children);

    const character = this.character;

    if (character) {
      character.dispose();
    }

    const baseCharacter = this.baseCharacter;

    if (baseCharacter) {
      baseCharacter.dispose();
    }
  }

  getCharacter(): THREEMD2CharacterInterface {
    const character = this.character;

    if (!character) {
      throw new QuakeMapException(this.loggerBreadcrumbs.add("getCharacter"), "Character is not set, but it was expected.");
    }

    return character;
  }

  update(delta: number): void {
    super.update(delta);

    this.getCharacter().update(delta / 1000);
  }

  useUpdate(): boolean {
    return true;
  }
}
