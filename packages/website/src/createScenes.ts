import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import { CSS2DRenderer } from "@personalidol/three-renderer/src/CSS2DRenderer";
import { CSS2DRendererStatsHook } from "@personalidol/three-renderer/src/CSS2DRendererStatsHook";
import { Director } from "@personalidol/loading-manager/src/Director";
import { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer";
import { LoadingScreenScene } from "@personalidol/personalidol/src/LoadingScreenScene";
import { RendererDimensionsManager } from "@personalidol/three-renderer/src/RendererDimensionsManager";
import { SceneTransition } from "@personalidol/loading-manager/src/SceneTransition";
import { UIStateController } from "@personalidol/personalidol/src/UIStateController";
import { UserSettings } from "@personalidol/personalidol/src/UserSettings";
import { UserSettingsSync } from "@personalidol/framework/src/UserSettingsSync";
import { ViewBagSceneObserver } from "@personalidol/loading-manager/src/ViewBagSceneObserver";
import { WebGLRendererStatsHook } from "@personalidol/framework/src/WebGLRendererStatsHook";

import type { Logger } from "loglevel";

import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";
import type { StatsReporter } from "@personalidol/framework/src/StatsReporter.interface";
import type { UIState } from "@personalidol/personalidol/src/UIState.type";

export function createScenes(
  threadDebugName: string,
  devicePixelRatio: number,
  eventBus: EventBus,
  mainLoop: MainLoop,
  serviceManager: ServiceManager,
  canvas: HTMLCanvasElement | OffscreenCanvas,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  logger: Logger,
  statsReporter: StatsReporter,
  domMessagePort: MessagePort,
  fontPreloadMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  statsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiMessagePort: MessagePort,
  userSettingsMessagePort: MessagePort
): void {
  const userSettings = UserSettings.createEmptyState();
  const userSettingsSync = UserSettingsSync(userSettings, userSettingsMessagePort, threadDebugName);

  const rendererDimensionsManager = RendererDimensionsManager(dimensionsState);

  const webGLRenderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    canvas: canvas,
  });

  webGLRenderer.setPixelRatio(devicePixelRatio);
  webGLRenderer.shadowMap.enabled = true;
  webGLRenderer.shadowMap.autoUpdate = true;

  const effectComposer = new EffectComposer(webGLRenderer);
  const css2DRenderer = CSS2DRenderer(domMessagePort);

  rendererDimensionsManager.state.renderers.add(css2DRenderer);
  rendererDimensionsManager.state.renderers.add(effectComposer);
  rendererDimensionsManager.state.renderers.add(webGLRenderer);

  const css2DRendererStatsHook = CSS2DRendererStatsHook(css2DRenderer);
  const webGLRendererStatsHook = WebGLRendererStatsHook(webGLRenderer);

  statsReporter.hooks.add(css2DRendererStatsHook);
  statsReporter.hooks.add(webGLRendererStatsHook);

  const currentSceneDirector = Director(logger, mainLoop.tickTimerState, "Scene");
  const loadingSceneDirector = Director(logger, mainLoop.tickTimerState, "LoadingScreen");
  const sceneTransition = SceneTransition(logger, currentSceneDirector.state, loadingSceneDirector.state);
  const viewBagSceneObserver = ViewBagSceneObserver(currentSceneDirector.state);

  const uiState: UIState = {
    currentMap: null,
    isInGameMenuOpened: false,
    isOptionsScreenOpened: false,
    isScenePaused: false,
  };

  const uiStateController = UIStateController(
    logger,
    userSettings,
    effectComposer,
    css2DRenderer,
    currentSceneDirector.state,
    eventBus,
    dimensionsState,
    inputState,
    domMessagePort,
    fontPreloadMessagePort,
    md2MessagePort,
    progressMessagePort,
    quakeMapsMessagePort,
    texturesMessagePort,
    uiMessagePort,
    uiState
  );

  loadingSceneDirector.state.next = LoadingScreenScene(userSettings, effectComposer, dimensionsState, domMessagePort, progressMessagePort);

  serviceManager.services.add(userSettingsSync);
  serviceManager.services.add(viewBagSceneObserver);
  serviceManager.services.add(currentSceneDirector);
  serviceManager.services.add(uiStateController);
  serviceManager.services.add(loadingSceneDirector);
  serviceManager.services.add(rendererDimensionsManager);
  serviceManager.services.add(sceneTransition);

  mainLoop.updatables.add(userSettingsSync);
  mainLoop.updatables.add(serviceManager);
  mainLoop.updatables.add(viewBagSceneObserver);
  mainLoop.updatables.add(currentSceneDirector);
  mainLoop.updatables.add(loadingSceneDirector);
  mainLoop.updatables.add(uiStateController);
  mainLoop.updatables.add(sceneTransition);
  mainLoop.updatables.add(rendererDimensionsManager);
  mainLoop.updatables.add(css2DRendererStatsHook);
  mainLoop.updatables.add(webGLRendererStatsHook);
}
