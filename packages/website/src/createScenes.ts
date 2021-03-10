import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

import { CSS2DRenderer } from "@personalidol/three-renderer/src/CSS2DRenderer";
import { CSS2DRendererStatsHook } from "@personalidol/three-renderer/src/CSS2DRendererStatsHook";
import { Director } from "@personalidol/framework/src/Director";
import { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer";
import { LoadingScreenScene } from "@personalidol/personalidol/src/LoadingScreenScene";
import { MultiThreadUserSettingsSync } from "@personalidol/framework/src/MultiThreadUserSettingsSync";
import { RendererDimensionsManager } from "@personalidol/three-renderer/src/RendererDimensionsManager";
import { SceneTransition } from "@personalidol/framework/src/SceneTransition";
import { UIStateController } from "@personalidol/personalidol/src/UIStateController";
import { ViewBagSceneObserver } from "@personalidol/framework/src/ViewBagSceneObserver";
import { WebGLRendererStatsHook } from "@personalidol/framework/src/WebGLRendererStatsHook";
import { WebGLRendererUserSettingsManager } from "@personalidol/personalidol/src/WebGLRendererUserSettingsManager";

import type { Logger } from "loglevel";

import type { DOMElementsLookup } from "@personalidol/personalidol/src/DOMElementsLookup.type";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";
import type { StatsReporter } from "@personalidol/framework/src/StatsReporter.interface";
import type { UIState } from "@personalidol/personalidol/src/UIState.type";
import type { UserSettings } from "@personalidol/personalidol/src/UserSettings.type";

export function createScenes(
  threadDebugName: string,
  devicePixelRatio: number,
  eventBus: EventBus,
  mainLoop: MainLoop,
  serviceManager: ServiceManager,
  canvas: HTMLCanvasElement | OffscreenCanvas,
  dimensionsState: Uint32Array,
  keyboardState: Uint8Array,
  mouseState: Int32Array,
  touchState: Int32Array,
  logger: Logger,
  statsReporter: StatsReporter,
  userSettings: UserSettings,
  domMessagePort: MessagePort,
  fontPreloadMessagePort: MessagePort,
  gltfMessagePort: MessagePort,
  internationalizationMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  statsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiMessagePort: MessagePort,
  userSettingsMessagePort: MessagePort
): void {
  const multiThreadUserSettingsSync = MultiThreadUserSettingsSync(userSettings, userSettingsMessagePort, threadDebugName);
  const rendererDimensionsManager = RendererDimensionsManager(dimensionsState);

  const webGLRenderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    canvas: canvas,
  });

  // This should be enabled regardless of `userSettings.useShadows`. If shadows
  // are disabled, all individual shadows maps and shadow emitting lights
  // are turned off. Leaving this renderer option as enabled makes re-enabling
  // shadow maps much easier and does not perceivably affect performance.
  webGLRenderer.shadowMap.enabled = true;
  webGLRenderer.shadowMap.autoUpdate = true;

  const effectComposer = new EffectComposer(webGLRenderer);
  const css2DRenderer = CSS2DRenderer<DOMElementsLookup>(domMessagePort);

  rendererDimensionsManager.state.renderers.add(css2DRenderer);
  rendererDimensionsManager.state.renderers.add(effectComposer);
  rendererDimensionsManager.state.renderers.add(webGLRenderer);

  const webGLRendererUserSettingsManager = WebGLRendererUserSettingsManager(userSettings, webGLRenderer);

  statsReporter.hooks.add(CSS2DRendererStatsHook(css2DRenderer));
  statsReporter.hooks.add(WebGLRendererStatsHook(webGLRenderer));

  const currentSceneDirector = Director(logger, mainLoop.tickTimerState, "Scene");
  const loadingSceneDirector = Director(logger, mainLoop.tickTimerState, "LoadingScreen");
  const sceneTransition = SceneTransition(logger, currentSceneDirector.state, loadingSceneDirector.state);
  const viewBagSceneObserver = ViewBagSceneObserver(currentSceneDirector.state);

  const uiState: UIState = {
    currentMap: null,
    isInGameMenuOpened: false,
    isLanguageSettingsScreenOpened: false,
    isUserSettingsScreenOpened: false,
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
    keyboardState,
    mouseState,
    touchState,
    domMessagePort,
    fontPreloadMessagePort,
    gltfMessagePort,
    internationalizationMessagePort,
    md2MessagePort,
    progressMessagePort,
    quakeMapsMessagePort,
    texturesMessagePort,
    uiMessagePort,
    uiState
  );

  loadingSceneDirector.state.next = LoadingScreenScene(userSettings, effectComposer, dimensionsState, domMessagePort, progressMessagePort);

  serviceManager.services.add(multiThreadUserSettingsSync);
  serviceManager.services.add(viewBagSceneObserver);
  serviceManager.services.add(currentSceneDirector);
  serviceManager.services.add(uiStateController);
  serviceManager.services.add(loadingSceneDirector);
  serviceManager.services.add(rendererDimensionsManager);
  serviceManager.services.add(sceneTransition);

  mainLoop.updatables.add(multiThreadUserSettingsSync);
  mainLoop.updatables.add(webGLRendererUserSettingsManager);
  mainLoop.updatables.add(serviceManager);
  mainLoop.updatables.add(viewBagSceneObserver);
  mainLoop.updatables.add(currentSceneDirector);
  mainLoop.updatables.add(loadingSceneDirector);
  mainLoop.updatables.add(uiStateController);
  mainLoop.updatables.add(sceneTransition);
  mainLoop.updatables.add(rendererDimensionsManager);
}
