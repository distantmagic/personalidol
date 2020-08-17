import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import { Director } from "@personalidol/framework/src/Director";
import { LoadingManager } from "@personalidol/framework/src/LoadingManager";
import { LoadingScreenScene } from "@personalidol/personalidol/src/LoadingScreenScene";
import { MapScene } from "@personalidol/personalidol/src/MapScene";
import { Renderer } from "@personalidol/framework/src/Renderer";
import { SceneLoader } from "@personalidol/framework/src/SceneLoader";

import type { Logger } from "loglevel";

import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { LoadingManagerState } from "@personalidol/framework/src/LoadingManagerState.type";
import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { RendererState } from "@personalidol/framework/src/RendererState.type";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";

export function createScenes(
  devicePixelRatio: number,
  eventBus: EventBus,
  mainLoop: MainLoop,
  serviceManager: ServiceManager,
  canvas: HTMLCanvasElement | OffscreenCanvas,
  dimensionsState: Uint16Array,
  inputState: Int16Array,
  logger: Logger,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort
): void {
  const loadingManagerState: LoadingManagerState = Object.seal({
    comment: "",
    expectsAtLeast: 0,
    itemsLoaded: new Set(),
    itemsToLoad: new Set(),
    progress: 0,
  });
  const loadingManager = LoadingManager(loadingManagerState);

  const rendererState: RendererState = Object.seal({
    camera: null,
    renderer: new WebGLRenderer({
      alpha: false,
      antialias: false,
      canvas: canvas,
    }),
    scene: null,
  });

  // rendererState.renderer.gammaOutput = true;
  // rendererState.renderer.gammaFactor = 2.2;
  rendererState.renderer.setPixelRatio(devicePixelRatio);
  rendererState.renderer.shadowMap.enabled = false;
  rendererState.renderer.shadowMap.autoUpdate = false;

  const renderer = Renderer(rendererState, dimensionsState);
  const currentSceneDirector = Director(logger);
  const loadingSceneDirector = Director(logger);
  const sceneLoader = SceneLoader(logger, rendererState, currentSceneDirector, loadingSceneDirector);

  // const mapFilename = "/maps/map-box.map";
  // const mapFilename = "/maps/map-cube-chipped.map";
  // const mapFilename = "/maps/map-cube.map";
  // const mapFilename = "/maps/map-desert-hut.map";
  // const mapFilename = "/maps/map-flatiron.map";
  // const mapFilename = "/maps/map-flint.map";
  const mapFilename = "/maps/map-mountain-caravan.map";
  // const mapFilename = "/maps/map-zagaj.map";
  const currentSceneDirectorState = currentSceneDirector.state;

  // prettier-ignore
  currentSceneDirector.state.next = MapScene(
    logger,
    currentSceneDirectorState,
    eventBus,
    inputState,
    domMessagePort,
    md2MessagePort,
    quakeMapsMessagePort,
    texturesMessagePort,
    loadingManagerState,
    rendererState,
    mapFilename
  );

  loadingSceneDirector.state.next = LoadingScreenScene(domMessagePort, loadingManagerState, rendererState);

  serviceManager.services.add(loadingManager);
  serviceManager.services.add(currentSceneDirector);
  serviceManager.services.add(loadingSceneDirector);
  serviceManager.services.add(renderer);
  serviceManager.services.add(sceneLoader);

  mainLoop.updatables.add(serviceManager);
  mainLoop.updatables.add(loadingManager);
  mainLoop.updatables.add(currentSceneDirector);
  mainLoop.updatables.add(loadingSceneDirector);
  mainLoop.updatables.add(sceneLoader);
  mainLoop.updatables.add(renderer);
}
