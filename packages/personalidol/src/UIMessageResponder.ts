import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { ViewBag } from "@personalidol/loading-manager/src/ViewBag";
import { ViewBagScene } from "@personalidol/loading-manager/src/ViewBagScene";

import { MapScene } from "./MapScene";

import type { Logger } from "loglevel";

import type { CSS2DRenderer } from "@personalidol/three-renderer/src/CSS2DRenderer.interface";
import type { DirectorState } from "@personalidol/loading-manager/src/DirectorState.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { ViewBag as IViewBag } from "@personalidol/loading-manager/src/ViewBag.interface";

import type { UIMessageResponder as IUIMessageResponder } from "./UIMessageResponder.interface";

export function UIMessageResponder(
  logger: Logger,
  effectComposer: EffectComposer,
  css2DRenderer: CSS2DRenderer,
  directorState: DirectorState,
  eventBus: EventBus,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiMessagePort: MessagePort
): IUIMessageResponder {
  const _domMessageRouter = createRouter({
    navigateToMap: _navigateToMap,
  });

  function start() {
    uiMessagePort.onmessage = _domMessageRouter;
  }

  function stop() {
    uiMessagePort.onmessage = null;
  }

  function update(delta: number, elapsedTime: number): void {}

  function _navigateToMap(mapName: string): void {
    const filename = `${__ASSETS_BASE_PATH}/maps/${mapName}.map?${__CACHE_BUST}`;
    const viewBag: IViewBag = ViewBag(logger);

    // prettier-ignore
    const mapScene = MapScene(
      logger,
      effectComposer,
      css2DRenderer,
      eventBus,
      viewBag.views,
      dimensionsState,
      inputState,
      md2MessagePort,
      progressMessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      filename,
    );

    directorState.next = ViewBagScene(logger, viewBag, mapScene);
  }

  return Object.seal({
    id: MathUtils.generateUUID(),
    name: "UIMessageResponder",

    start: start,
    stop: stop,
    update: update,
  });
}
