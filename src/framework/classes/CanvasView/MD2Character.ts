import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasView from "src/framework/classes/CanvasView";
import { default as MD2CharacterQuery } from "src/framework/classes/Query/MD2Character";
import { default as QuakeMapException } from "src/framework/classes/Exception/QuakeMap";
import { default as RemoteJSONQuery } from "src/framework/classes/Query/RemoteJSON";
import { default as THREEMD2Character } from "src/framework/classes/MD2Character";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasViewBag from "src/framework/interfaces/CanvasViewBag";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type QueryBus from "src/framework/interfaces/QueryBus";
import type { default as IMD2Character } from "src/framework/interfaces/MD2Character";
import type { default as IMD2CharacterView } from "src/framework/interfaces/CanvasView/MD2Character";

import type MD2CharacterConfig from "src/framework/types/MD2CharacterConfig";
import type QuakeWorkerMD2Model from "src/framework/types/QuakeWorkerMD2Model";

const BOUNDING_BOX_SIZE = new THREE.Vector3(32, 56, 32);
const LOOK_AT_DISTANCE = 256 * 3;

export default class MD2Character extends CanvasView implements IMD2CharacterView {
  readonly angle: number;
  readonly animationOffset: number;
  readonly baseUrl: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly queryBus: QueryBus;
  readonly skin: number;
  readonly threeLoadingManager: THREE.LoadingManager;
  protected boundingBox: THREE.Box3;
  private accumulatedDelta: number = 0;
  private baseCharacter: null | IMD2Character = null;
  private character: null | IMD2Character = null;
  private characterGroup: THREE.Group = new THREE.Group();

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
    this.queryBus = queryBus;
    this.skin = entity.skin;
    this.threeLoadingManager = threeLoadingManager;

    this.children.position.set(entity.origin[0], entity.origin[1], entity.origin[2]);
    this.boundingBox = new THREE.Box3().setFromCenterAndSize(this.children.position, BOUNDING_BOX_SIZE);
  }

  @cancelable()
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

    this.characterGroup.add(character.root);
    this.children.add(this.characterGroup);
    this.character = character;

    this.setRotationY(THREE.MathUtils.degToRad(this.angle));
  }

  attachCamera(camera: THREE.Camera): void {
    super.attachCamera(camera);

    camera.position.set(LOOK_AT_DISTANCE, LOOK_AT_DISTANCE, LOOK_AT_DISTANCE);
    camera.lookAt(this.getPosition());
  }

  @cancelable()
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

  isStatic(): false {
    return false;
  }

  setAnimationIdle(): void {
    const controls = this.getCharacter().controls;

    if (controls) {
      controls.moveForward = false;
    }
  }

  setAnimationRunning(): void {
    const controls = this.getCharacter().controls;

    if (controls) {
      controls.moveForward = true;
    }
  }

  setRotationY(rotationRadians: number): void {
    this.characterGroup.rotation.y = rotationRadians;
  }

  setVelocity(velocity: THREE.Vector3): void {
    this.getPhysicsBody().linearVelocity.set(velocity.x, velocity.y, velocity.z);
  }

  update(delta: number): void {
    if (!this.isInCameraFrustum()) {
      this.accumulatedDelta += delta;

      return;
    }

    this.getCharacter().update(this.accumulatedDelta + delta);
    this.accumulatedDelta = 0;
  }

  useCameraFrustum(): true {
    return true;
  }

  usePhysics(): true {
    return true;
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
