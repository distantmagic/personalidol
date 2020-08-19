import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import { Director } from "@personalidol/framework/src/Director";
import { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer";
import { LoadingScreenScene } from "@personalidol/personalidol/src/LoadingScreenScene";
import { MapScene } from "@personalidol/personalidol/src/MapScene";
import { Renderer } from "@personalidol/three-renderer/src/Renderer";
import { SceneLoader } from "@personalidol/framework/src/SceneLoader";

import type { Logger } from "loglevel";

import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";

export function createScenes(
  devicePixelRatio: number,
  eventBus: EventBus,
  mainLoop: MainLoop,
  serviceManager: ServiceManager,
  canvas: HTMLCanvasElement | OffscreenCanvas,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  logger: Logger,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort
): void {
  const webGLRenderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    canvas: canvas,
  });

  // webGLRenderer.gammaOutput = true;
  // webGLRenderer.gammaFactor = 2.2;
  webGLRenderer.setPixelRatio(devicePixelRatio);
  webGLRenderer.shadowMap.enabled = false;
  webGLRenderer.shadowMap.autoUpdate = false;

  const effectComposer = new EffectComposer(webGLRenderer);

  const renderer = Renderer(dimensionsState, effectComposer, webGLRenderer);
  const currentSceneDirector = Director(logger, "Scene");
  const loadingSceneDirector = Director(logger, "LoadingScreen");
  const sceneLoader = SceneLoader(logger, currentSceneDirector, loadingSceneDirector);

  // const mapFilename = "/maps/map-box.map";
  const mapFilename = "/maps/map-cube-chipped.map";
  // const mapFilename = "/maps/map-cube.map";
  // const mapFilename = "/maps/map-desert-hut.map";
  // const mapFilename = "/maps/map-flatiron.map";
  // const mapFilename = "/maps/map-flint.map";
  // const mapFilename = "/maps/map-mountain-caravan.map";
  // const mapFilename = "/maps/map-zagaj.map";
  const currentSceneDirectorState = currentSceneDirector.state;

  // prettier-ignore
  currentSceneDirector.state.next = MapScene(
    logger,
    effectComposer,
    currentSceneDirectorState,
    eventBus,
    dimensionsState,
    inputState,
    domMessagePort,
    md2MessagePort,
    progressMessagePort,
    quakeMapsMessagePort,
    texturesMessagePort,
    mapFilename
  );

  // prettier-ignore
  loadingSceneDirector.state.next = LoadingScreenScene(
    effectComposer,
    dimensionsState,
    domMessagePort,
    progressMessagePort
  );

  serviceManager.services.add(currentSceneDirector);
  serviceManager.services.add(loadingSceneDirector);
  serviceManager.services.add(renderer);
  serviceManager.services.add(sceneLoader);

  mainLoop.updatables.add(serviceManager);
  mainLoop.updatables.add(currentSceneDirector);
  mainLoop.updatables.add(loadingSceneDirector);
  mainLoop.updatables.add(sceneLoader);
  mainLoop.updatables.add(renderer);
}
