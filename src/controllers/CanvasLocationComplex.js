// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import {
  Howl
  // Howler
} from "howler";

import THREEPointerInteraction from "../framework/classes/THREEPointerInteraction";
import { default as CubeView } from "../views/Cube";
import { default as EntityView } from "../views/Entity";
import { default as PlaneView } from "../views/Plane";

import type { CanvasController } from "../framework/interfaces/CanvasController";
import type { Debugger } from "../framework/interfaces/Debugger";
import type { ElementSize } from "../framework/interfaces/ElementSize";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { THREELoadingManager } from "../framework/interfaces/THREELoadingManager";
import type { THREEPointerInteraction as THREEPointerInteractionInterface } from "../framework/interfaces/THREEPointerInteraction";

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.OrthographicCamera;
  +cubeView: CubeView;
  +debug: Debugger;
  +entityView: EntityView;
  +keyboardState: KeyboardState;
  +light: THREE.SpotLight;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +planeSide: number;
  +planeView: PlaneView;
  +scene: THREE.Scene;
  +sound: Howl;
  +threeLoadingManager: THREELoadingManager;
  threePointerInteraction: ?THREEPointerInteractionInterface;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    threeLoadingManager: THREELoadingManager,
    keyboardState: KeyboardState,
    debug: Debugger
  ) {
    autoBind(this);

    this.debug = debug;
    this.keyboardState = keyboardState;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    // (36x36), (72x72), (108x108), (144x144), (216,216), (252, 252)
    this.planeSide = 108;
    this.threeLoadingManager = threeLoadingManager;
    this.scene = new THREE.Scene();
    // this.scene.rotation.y = Math.PI / 1.6;

    this.sound = new Howl({
      distanceModel: "exponential",
      loop: true,
      rolloffFactor: 0.2,
      src: ["/assets/track-lithium.mp3"]
      // volume: 0.1,
    });

    this.camera = new THREE.OrthographicCamera();
    this.camera.position.set(20, 20, 20);
    this.camera.lookAt(this.scene.position);

    // this.light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.light = new THREE.SpotLight(0xffffff);
    // this.light.position.set(planeSide / 2, planeSide / 2, planeSide / 2);
    this.light.position.set(
      this.planeSide * 2,
      this.planeSide * 2,
      this.planeSide * 2
    );

    this.cubeView = new CubeView(
      exceptionHandler,
      loggerBreadcrumbs.add("CubeView"),
      this.scene,
      threeLoadingManager
    );
    this.entityView = new EntityView(
      exceptionHandler,
      loggerBreadcrumbs.add("EntityView"),
      this.scene,
      threeLoadingManager,
      keyboardState,
      this.planeSide
    );
    this.planeView = new PlaneView(
      exceptionHandler,
      loggerBreadcrumbs.add("PlaneView"),
      this.scene,
      this.planeSide
    );
  }

  async attach(renderer: THREE.WebGLRenderer): Promise<void> {
    // this.sound.pos(0, 0, 0);
    // this.sound.play();

    const threePointerInteraction = new THREEPointerInteraction(
      renderer,
      this.camera
    );

    this.threePointerInteraction = threePointerInteraction;
    threePointerInteraction.observe();

    this.scene.add(this.light);

    await Promise.all([
      this.cubeView.attach(renderer),
      this.entityView.attach(renderer),
      this.planeView.attach(renderer)
    ]);
  }

  begin(): void {
    this.cubeView.begin();
    this.entityView.begin();
    this.planeView.begin();

    const threePointerInteraction = this.threePointerInteraction;

    if (threePointerInteraction) {
      threePointerInteraction.begin();
    }
  }

  async detach(renderer: THREE.WebGLRenderer): Promise<void> {
    const threePointerInteraction = this.threePointerInteraction;

    if (!threePointerInteraction) {
      throw new Error(
        "Controller lifecycle error: THREEPointerInteraction was expected while unmounting."
      );
    }

    threePointerInteraction.disconnect();

    this.scene.remove(this.light);

    await Promise.all([
      this.cubeView.detach(renderer),
      this.entityView.detach(renderer),
      this.planeView.detach(renderer)
    ]);
  }

  draw(renderer: THREE.WebGLRenderer, interpolationPercentage: number): void {
    // renderer.setPixelRatio(window.devicePixelRatio / 2);
    // renderer.setPixelRatio(window.devicePixelRatio * 2);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(1);
    renderer.render(this.scene, this.camera);
  }

  end(fps: number, isPanicked: boolean): void {
    this.debug.updateState(this.loggerBreadcrumbs.add("end").add("fps"), fps);
  }

  resize(elementSize: ElementSize): void {
    const zoom = 20;
    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.camera.left = (-1 * width) / zoom;
    this.camera.far = 195;
    this.camera.near = -195;
    this.camera.right = width / zoom;
    this.camera.top = height / zoom;
    this.camera.bottom = (-1 * height) / zoom;
    this.camera.updateProjectionMatrix();

    const threePointerInteraction = this.threePointerInteraction;

    if (threePointerInteraction) {
      threePointerInteraction.resize(elementSize);
    }
  }

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  update(delta: number): void {
    // Howler.pos(guy.position.x, guy.position.z, 0);

    this.cubeView.update(delta);
    this.entityView.update(delta);
    this.planeView.update(delta);

    this.camera.position.set(
      1 * this.entityView.guy.position.x + 16,
      20,
      1 * this.entityView.guy.position.z + 16
    );

    const threePointerInteraction = this.threePointerInteraction;

    if (threePointerInteraction) {
      threePointerInteraction.update(delta);
    }
  }
}
