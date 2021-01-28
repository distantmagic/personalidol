import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import { CSS2DRenderer } from "@personalidol/three-renderer/src/CSS2DRenderer";
import { Director } from "@personalidol/loading-manager/src/Director";
import { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer";
import { LoadingScreenScene } from "@personalidol/personalidol/src/LoadingScreenScene";
import { MainMenuScene } from "@personalidol/personalidol/src/MainMenuScene";
import { RendererDimensionsManager } from "@personalidol/three-renderer/src/RendererDimensionsManager";
import { SceneTransition } from "@personalidol/loading-manager/src/SceneTransition";
import { UIMessageResponder } from "@personalidol/personalidol/src/UIMessageResponder";
import { ViewBagSceneObserver } from "@personalidol/loading-manager/src/ViewBagSceneObserver";

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
  fontPreloadMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  statsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiMessagePort: MessagePort
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
  const css2DRenderer = CSS2DRenderer(domMessagePort);

  const rendererDimensionsManager = RendererDimensionsManager(dimensionsState);

  rendererDimensionsManager.state.renderers.add(css2DRenderer);
  rendererDimensionsManager.state.renderers.add(effectComposer);
  rendererDimensionsManager.state.renderers.add(webGLRenderer);

  const currentSceneDirector = Director(logger, mainLoop.tickTimerState, "Scene");
  const loadingSceneDirector = Director(logger, mainLoop.tickTimerState, "LoadingScreen");
  const sceneTransition = SceneTransition(logger, currentSceneDirector.state, loadingSceneDirector.state);
  const viewBagSceneObserver = ViewBagSceneObserver(currentSceneDirector.state);

  const uiMessageResponder = UIMessageResponder(
    logger,
    effectComposer,
    css2DRenderer,
    currentSceneDirector.state,
    eventBus,
    dimensionsState,
    inputState,
    domMessagePort,
    md2MessagePort,
    progressMessagePort,
    quakeMapsMessagePort,
    texturesMessagePort,
    uiMessagePort
  );

  // prettier-ignore
  currentSceneDirector.state.next = MainMenuScene(
    logger,
    domMessagePort,
    fontPreloadMessagePort,
    progressMessagePort,
  );

  // prettier-ignore
  loadingSceneDirector.state.next = LoadingScreenScene(
    effectComposer,
    dimensionsState,
    domMessagePort,
    progressMessagePort
  );

  serviceManager.services.add(viewBagSceneObserver);
  serviceManager.services.add(currentSceneDirector);
  serviceManager.services.add(uiMessageResponder);
  serviceManager.services.add(loadingSceneDirector);
  serviceManager.services.add(rendererDimensionsManager);
  serviceManager.services.add(sceneTransition);

  mainLoop.updatables.add(serviceManager);
  mainLoop.updatables.add(viewBagSceneObserver);
  mainLoop.updatables.add(currentSceneDirector);
  mainLoop.updatables.add(loadingSceneDirector);
  mainLoop.updatables.add(uiMessageResponder);
  mainLoop.updatables.add(sceneTransition);
  mainLoop.updatables.add(rendererDimensionsManager);
}
