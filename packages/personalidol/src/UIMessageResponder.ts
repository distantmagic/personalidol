import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { ViewBag } from "@personalidol/loading-manager/src/ViewBag";
import { ViewBagScene } from "@personalidol/loading-manager/src/ViewBagScene";

import { MapScene } from "./MapScene";

import type { Logger } from "loglevel";

import type { DirectorState } from "@personalidol/loading-manager/src/DirectorState.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { ViewBag as IViewBag } from "@personalidol/loading-manager/src/ViewBag.interface";
import type { ViewBagScene as IViewBagScene } from "@personalidol/loading-manager/src/ViewBagScene.interface";

import type { UIMessageResponder as IUIMessageResponder } from "./UIMessageResponder.interface";

export function UIMessageResponder(
  logger: Logger,
  effectComposer: EffectComposer,
  directorState: DirectorState,
  eventBus: EventBus,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort
): IUIMessageResponder {
  const _domMessageRouter = createRouter({
    navigateToMap({ mapName }: { mapName: string }) {
      _navigateToMap(`${__ASSETS_BASE_PATH}/maps/${mapName}.map`);
    },
  });

  let _viewBagScene: null | IViewBagScene = null;

  function start() {
    domMessagePort.onmessage = _domMessageRouter;
  }

  function stop() {
    domMessagePort.onmessage = null;
  }

  function update(delta: number, elapsedTime: number): void {
    if (_viewBagScene === null) {
      return;
    }

    if (_viewBagScene.state.isDisposed || _viewBagScene.state.isPreloaded) {
      // If the scene state manager reference can be disposed also so it can be
      // garbage collected.
      // If the scene state manager is already preloaded it doesn't need state
      // polling anymore.
      _viewBagScene = null;

      return;
    }

    if (_viewBagScene.state.isPreloading) {
      _viewBagScene.updatePreloadingState();
    }
  }

  function _navigateToMap(filename: string): void {
    const viewBag: IViewBag = ViewBag(logger);

    // prettier-ignore
    const mapScene = MapScene(
      logger,
      effectComposer,
      eventBus,
      viewBag,
      dimensionsState,
      inputState,
      domMessagePort,
      md2MessagePort,
      progressMessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      filename,
    );

    if (_viewBagScene !== null) {
      throw new Error("Can't set up a new scene while the current one is still alive.");
    }

    _viewBagScene = ViewBagScene(logger, viewBag, mapScene);

    // let the director suck in the new scene
    directorState.next = _viewBagScene;
  }

  return Object.seal({
    id: MathUtils.generateUUID(),
    name: "UIMessageResponder",

    start: start,
    stop: stop,
    update: update,
  });
}
