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

const planeSide = 128;

export default class Entity implements CanvasView {
  +keyboardState: KeyboardState;
  +personAnimationState: PersonAnimationInstance;
  +threeLoadingManager: THREELoadingManager;
  +threeScene: THREE.Scene;
  guy: THREE.Object3D;
  mixer: ?THREE.AnimationMixer;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    threeLoadingManager: THREELoadingManager,
    threeScene: THREE.Scene,
    keyboardState: KeyboardState
  ) {
    this.guy = new THREE.Group();
    this.personAnimationState = new PersonAnimation(
      exceptionHandler,
      loggerBreadcrumbs
    );
    this.keyboardState = keyboardState;
    this.threeLoadingManager = threeLoadingManager;
    this.threeScene = threeScene;
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    const loader = new FBXLoader(this.threeLoadingManager.getLoadingManager());

    loader.setResourcePath("/assets/mesh-default-character/");

    const defaultCharacter = await new Promise((resolve, reject) => {
      loader.load("/assets/mesh-default-character.fbx", resolve, null, reject);
    });
    // const attack = await new Promise((resolve, reject) => {
    //   loader.load("/assets/animation-attack-01.fbx", resolve, null, reject);
    // });
    const idle = await new Promise((resolve, reject) => {
      loader.load(
        "/assets/animation-idle-normal-01.fbx",
        resolve,
        null,
        reject
      );
    });
    const run = await new Promise((resolve, reject) => {
      loader.load(
        "/assets/animation-run-forward-normal-01.fbx",
        resolve,
        null,
        reject
      );
    });
    const walk = await new Promise((resolve, reject) => {
      loader.load(
        "/assets/animation-walk-forward-normal-01.fbx",
        resolve,
        null,
        reject
      );
    });
    const bones = defaultCharacter.children[0];

    this.guy.add(bones);

    const body = defaultCharacter.children[7];

    this.guy.add(body);

    const head = defaultCharacter.children[9];

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
    this.guy.scale.set(0.1, 0.1, 0.1);

    this.threeScene.add(this.guy);
  }

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    this.threeScene.remove(this.guy);
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  begin(): void {}

  update(delta: number): void {
    const mixer = this.mixer;

    if (mixer) {
      mixer.update(delta / 1000);
    }

    // const stepSize = 0.4;
    const stepSize = this.keyboardState.isPressed("Shift") ? 0.6 : 0.1;

    // this.guy.rotation.x = -1 * Math.PI / 2;
    // this.guy.rotation.x += 0.01;
    this.guy.rotation.x = 0;

    if (this.keyboardState.isArrowPressed()) {
      if (this.keyboardState.isPressed("Shift")) {
        this.personAnimationState.run();
      } else {
        this.personAnimationState.walk();
      }
    } else {
      this.personAnimationState.idle();
    }

    if (this.keyboardState.isPressed("ArrowLeft")) {
      this.guy.position.x -= stepSize;
      this.guy.rotation.y = (-1 * Math.PI) / 2;
    }
    if (this.keyboardState.isPressed("ArrowRight")) {
      this.guy.position.x += stepSize;
      this.guy.rotation.y = Math.PI / 2;
    }
    if (this.keyboardState.isPressed("ArrowUp")) {
      this.guy.position.z -= stepSize;
      this.guy.rotation.y = Math.PI;
    }
    if (
      this.keyboardState.isPressed("ArrowUp") &&
      this.keyboardState.isPressed("ArrowLeft")
    ) {
      this.guy.rotation.y = -1 * Math.PI * 0.75;
    }
    if (
      this.keyboardState.isPressed("ArrowUp") &&
      this.keyboardState.isPressed("ArrowRight")
    ) {
      this.guy.rotation.y = Math.PI * 0.75;
    }
    if (this.keyboardState.isPressed("ArrowDown")) {
      this.guy.position.z += stepSize;
      this.guy.rotation.y = 0;
    }
    if (
      this.keyboardState.isPressed("ArrowDown") &&
      this.keyboardState.isPressed("ArrowLeft")
    ) {
      this.guy.rotation.y = (-1 * Math.PI) / 4;
    }
    if (
      this.keyboardState.isPressed("ArrowDown") &&
      this.keyboardState.isPressed("ArrowRight")
    ) {
      this.guy.rotation.y = Math.PI / 4;
    }

    this.guy.position.x = clamp(
      this.guy.position.x,
      -1 * (planeSide / 2),
      planeSide / 2
    );
    this.guy.position.z = clamp(
      this.guy.position.z,
      -1 * (planeSide / 2),
      planeSide / 2
    );
  }
}
