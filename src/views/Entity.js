// @flow

import * as THREE from "three";
import clamp from "clamp";

import FBXLoader from "../three/FBXLoader";
import PersonAnimation from "../framework/machines/PersonAnimation";

import type { CanvasView } from "../framework/interfaces/CanvasView";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { PersonAnimationInstance } from "../framework/types/PersonAnimationInstance";
import type { THREELoadingManager } from "../framework/interfaces/THREELoadingManager";

export default class Entity implements CanvasView {
  +keyboardState: KeyboardState;
  +personAnimationState: PersonAnimationInstance;
  +planeSide: number;
  +threeLoadingManager: THREELoadingManager;
  +scene: THREE.Scene;
  rotationY: number;
  velocityX: number;
  velocityZ: number;
  guy: THREE.Object3D;
  mixer: ?THREE.AnimationMixer;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    scene: THREE.Scene,
    threeLoadingManager: THREELoadingManager,
    keyboardState: KeyboardState,
    planeSide: number
  ) {
    this.guy = new THREE.Group();
    this.keyboardState = keyboardState;
    this.personAnimationState = new PersonAnimation(
      exceptionHandler,
      loggerBreadcrumbs
    );
    this.planeSide = planeSide;
    this.rotationY = 0;
    this.scene = scene;
    this.threeLoadingManager = threeLoadingManager;
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    const loader = new FBXLoader(this.threeLoadingManager.getLoadingManager());

    loader.setResourcePath("/assets/mesh-default-character/");

    // const attack = await new Promise((resolve, reject) => {
    //   loader.load("/assets/animation-attack-01.fbx", resolve, null, reject);
    // });
    const [defaultCharacter, idle, run, walk] = await Promise.all([
      new Promise((resolve, reject) => {
        loader.load(
          "/assets/mesh-default-character.fbx",
          resolve,
          null,
          reject
        );
      }),
      new Promise((resolve, reject) => {
        loader.load(
          "/assets/animation-idle-normal-01.fbx",
          resolve,
          null,
          reject
        );
      }),
      new Promise((resolve, reject) => {
        loader.load(
          "/assets/animation-run-forward-normal-01.fbx",
          resolve,
          null,
          reject
        );
      }),
      new Promise((resolve, reject) => {
        loader.load(
          "/assets/animation-walk-forward-normal-01.fbx",
          resolve,
          null,
          reject
        );
      })
    ]);
    const bones = defaultCharacter.children[0];

    this.guy.add(bones);

    const body = defaultCharacter.children[7];

    this.guy.add(body);

    const head = defaultCharacter.children[11];

    this.guy.add(head);

    const mixer = new THREE.AnimationMixer(this.guy);

    this.mixer = mixer;

    const actions = {
      idling: mixer.clipAction(idle.animations[0]),
      running: mixer.clipAction(run.animations[0]),
      walking: mixer.clipAction(walk.animations[0])
    };

    this.personAnimationState.addEventListenerAny(evt => {
      if ("none" === evt.from) {
        return;
      }

      // console.log(evt.from, evt.to);

      // console.log(evt.from, evt.to);
      const from = actions[evt.from].play();
      const to = actions[evt.to].play();

      from.enabled = true;
      to.enabled = true;

      from.crossFadeTo(to, 0.1);
    });

    actions.idling.play();

    this.guy.position.set(0, 0, 0);
    this.guy.scale.set(0.01, 0.01, 0.01);

    this.scene.add(this.guy);
  }

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.scene.remove(this.guy);
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  begin(): void {
    // const stepSize = 0.4;
    // const stepSize = this.keyboardState.isPressed("Shift") ? 0.1 : 2;
    const stepSize = this.keyboardState.isPressed("Shift") ? 0.01 : 0.08;

    this.velocityX = 0;
    this.velocityZ = 0;

    if (this.keyboardState.isPressed("ArrowLeft")) {
      this.velocityX -= stepSize;
    }
    if (this.keyboardState.isPressed("ArrowRight")) {
      this.velocityX += stepSize;
    }
    if (this.keyboardState.isPressed("ArrowUp")) {
      this.velocityZ -= stepSize;
    }
    if (this.keyboardState.isPressed("ArrowDown")) {
      this.velocityZ += stepSize;
    }

    if (this.velocityX && this.velocityZ) {
      this.velocityX /= Math.SQRT2;
      this.velocityZ /= Math.SQRT2;
    }

    if (
      this.keyboardState.isArrowPressed() &&
      (this.velocityX || this.velocityZ)
    ) {
      if (this.keyboardState.isPressed("Shift")) {
        this.personAnimationState.walk();
      } else {
        this.personAnimationState.run();
      }
    } else {
      this.personAnimationState.idle();
    }

    if (this.velocityX < 0 && this.velocityZ === 0) {
      // left
      this.rotationY = (-1 * Math.PI) / 2;
    } else if (this.velocityX > 0 && this.velocityZ === 0) {
      // right
      this.rotationY = Math.PI / 2;
    } else if (this.velocityX === 0 && this.velocityZ < 0) {
      // up
      this.rotationY = Math.PI;
    } else if (this.velocityX === 0 && this.velocityZ > 0) {
      // down
      this.rotationY = 0;
    } else if (this.velocityX < 0 && this.velocityZ < 0) {
      // left + up
      this.rotationY = -1 * Math.PI * 0.75;
    } else if (this.velocityX > 0 && this.velocityZ < 0) {
      // right + up
      this.rotationY = Math.PI * 0.75;
    } else if (this.velocityX < 0 && this.velocityZ > 0) {
      // left + down
      this.rotationY = (-1 * Math.PI) / 4;
    } else if (this.velocityX > 0 && this.velocityZ > 0) {
      // right + down
      this.rotationY = Math.PI / 4;
    }
  }

  update(delta: number): void {
    const mixer = this.mixer;

    if (mixer) {
      mixer.update(delta / 1000);
    }

    // this.guy.rotation.x = -1 * Math.PI / 2;
    // this.guy.rotation.x += 0.01;
    this.guy.rotation.x = 0;

    this.guy.rotation.y = this.rotationY;
    this.guy.position.x = clamp(
      this.guy.position.x + this.velocityX,
      -1 * (this.planeSide * 5),
      this.planeSide * 5
    );
    this.guy.position.z = clamp(
      this.guy.position.z + this.velocityZ,
      -1 * (this.planeSide * 5),
      this.planeSide * 5
    );
  }
}
