// @flow

import * as THREE from "three";
import autoBind from "auto-bind";
import {
  Howl
  // Howler
} from "howler";

import Cancelled from "../../framework/classes/Exception/Cancelled";
import CanvasViewGroup from "../../framework/classes/CanvasViewGroup";
import THREEPointerInteraction from "../../framework/classes/THREEPointerInteraction";
import TiledMapLoader from "../../framework/classes/TiledMapLoader";
import TiledTilesetLoader from "../../framework/classes/TiledTilesetLoader";
import URLTextContentQueryBuilder from "../../framework/classes/URLTextContentQueryBuilder";
import { default as GameboardView } from "../views/Gameboard";
import { default as PlayerModel } from "../models/Player";
import { default as PlayerView } from "../views/Player";
// import { default as THREEHelpersView } from "../views/THREEHelpers";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasController } from "../../framework/interfaces/CanvasController";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../../framework/interfaces/CanvasViewGroup";
import type { Debugger } from "../../framework/interfaces/Debugger";
import type { ElementSize } from "../../framework/interfaces/ElementSize";
import type { ExceptionHandler } from "../../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { Player as PlayerModelInterface } from "../models/Player.type";
import type { PointerState } from "../../framework/interfaces/PointerState";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { THREEPointerInteraction as THREEPointerInteractionInterface } from "../../framework/interfaces/THREEPointerInteraction";

export default class CanvasLocationComplex implements CanvasController {
  +camera: THREE.OrthographicCamera;
  +canvasViewGroup: CanvasViewGroupInterface;
  +exceptionHandler: ExceptionHandler;
  +debug: Debugger;
  +keyboardState: KeyboardState;
  +light: THREE.SpotLight;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +playerModel: PlayerModelInterface;
  +pointerState: PointerState;
  +queryBus: QueryBus;
  +scene: THREE.Scene;
  +sound: Howl;
  +threeLoadingManager: THREELoadingManager;
  threePointerInteraction: ?THREEPointerInteractionInterface;
  tiledWorker: ?Worker;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    threeLoadingManager: THREELoadingManager,
    keyboardState: KeyboardState,
    pointerState: PointerState,
    queryBus: QueryBus,
    debug: Debugger
  ) {
    autoBind(this);

    this.canvasViewGroup = new CanvasViewGroup(loggerBreadcrumbs);
    this.debug = debug;
    this.exceptionHandler = exceptionHandler;
    this.keyboardState = keyboardState;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.playerModel = new PlayerModel();
    // (36x36), (72x72), (108x108), (144x144), (216,216), (252, 252)
    this.pointerState = pointerState;
    this.queryBus = queryBus;
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
    this.camera.position.set(32, 32, 32);
    this.camera.lookAt(this.scene.position);

    // this.light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.light = new THREE.SpotLight(0xffffff);
    this.light.position.set(512, 512, 512);
  }

  async attach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("attach");

    if (cancelToken.isCancelled()) {
      throw new Cancelled(
        breadcrumbs,
        "Cancel token was cancelled before attaching canvas location controller."
      );
    }

    // this.sound.pos(0, 0, 0);
    // this.sound.play();

    const threePointerInteraction = new THREEPointerInteraction(
      renderer,
      this.camera
    );

    this.threePointerInteraction = threePointerInteraction;
    threePointerInteraction.observe();

    this.scene.add(this.light);

    this.canvasViewGroup.add(
      new PlayerView(
        this.exceptionHandler,
        breadcrumbs.add("PlayerView"),
        this.playerModel,
        this.scene,
        this.threeLoadingManager,
        this.keyboardState
      )
    );

    const queryBuilder = new URLTextContentQueryBuilder();
    const tiledTilesetLoader = new TiledTilesetLoader(
      breadcrumbs.add("TiledTilesetLoader"),
      this.queryBus,
      queryBuilder
    );
    const tiledMapLoader = new TiledMapLoader(
      breadcrumbs.add("TiledMapLoader"),
      this.queryBus,
      queryBuilder,
      tiledTilesetLoader
    );

    const tiledMap = await tiledMapLoader.load(
      cancelToken,
      "/assets/map-outlands-01.tmx"
    );

    this.canvasViewGroup.add(
      new GameboardView(
        this.exceptionHandler,
        breadcrumbs.add("GameboardView"),
        this.playerModel,
        this.scene,
        this.pointerState,
        this.camera,
        this.threeLoadingManager,
        threePointerInteraction,
        tiledMap
      )
    );

    // this.camera.lookAt(this.playerModel.position);
    this.updateCameraPosition();

    // this.canvasViewGroup.add(
    //   new THREEHelpersView(
    //     this.exceptionHandler,
    //     breadcrumbs.add("THREEHelpersView"),
    //     this.scene,
    //     tiledMap
    //   )
    // );

    return this.canvasViewGroup.attach(cancelToken, renderer);
  }

  begin(): void {
    const threePointerInteraction = this.threePointerInteraction;

    if (threePointerInteraction) {
      threePointerInteraction.begin();
    }

    this.canvasViewGroup.begin();
  }

  async detach(
    cancelToken: CancelToken,
    renderer: THREE.WebGLRenderer
  ): Promise<void> {
    const breadcrumbs = this.loggerBreadcrumbs.add("detach");
    const threePointerInteraction = this.threePointerInteraction;

    if (!threePointerInteraction) {
      throw new Error(
        "Controller lifecycle error: THREEPointerInteraction was expected while unmounting."
      );
    }

    if (cancelToken.isCancelled()) {
      throw new Cancelled(
        breadcrumbs,
        "Cancel token was cancelled before detaching canvas location controller."
      );
    }

    threePointerInteraction.disconnect();

    this.scene.remove(this.light);

    const tiledWorker = this.tiledWorker;

    if (!tiledWorker) {
      throw new Error("Tiled worker was expected to be instanciated.");
    }

    tiledWorker.terminate();

    return this.canvasViewGroup.detach(cancelToken, renderer);
  }

  draw(renderer: THREE.WebGLRenderer, interpolationPercentage: number): void {
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(1);
    renderer.render(this.scene, this.camera);
  }

  end(fps: number, isPanicked: boolean): void {
    this.debug.updateState(this.loggerBreadcrumbs.add("end").add("fps"), fps);
  }

  resize(elementSize: ElementSize<"px">): void {
    const zoom = 200;
    const height = elementSize.getHeight();
    const width = elementSize.getWidth();

    this.camera.left = -1 * (width / zoom);
    this.camera.far = 100;
    this.camera.near = 0;
    this.camera.right = width / zoom;
    this.camera.top = height / zoom;
    this.camera.bottom = -1 * (height / zoom);
    this.camera.updateProjectionMatrix();

    const threePointerInteraction = this.threePointerInteraction;

    if (threePointerInteraction) {
      threePointerInteraction.resize(elementSize);
    }
  }

  async start(): Promise<void> {
    await this.canvasViewGroup.start();
  }

  async stop(): Promise<void> {
    await this.canvasViewGroup.stop();
  }

  update(delta: number): void {
    const threePointerInteraction = this.threePointerInteraction;

    if (threePointerInteraction) {
      // update pointer interaction first, as it may be used internally by
      // other views
      threePointerInteraction.update(delta);
    }

    this.canvasViewGroup.update(delta);
    this.updateCameraPosition();
  }

  updateCameraPosition(): void {
    const currentPlayerPosition = this.playerModel.getCurrentPosition();

    // top-down
    // this.camera.position.set(this.player.position.x, 20, this.player.position.z + 16);

    // angled
    this.camera.position.set(
      currentPlayerPosition.x + 8,
      8,
      currentPlayerPosition.z + 8
    );
  }
}
