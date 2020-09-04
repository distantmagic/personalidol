import { createRouter } from "@personalidol/workers/src/createRouter";

import { MapScene } from "./MapScene";

import type { Logger } from "loglevel";

import type { DirectorState } from "@personalidol/loading-manager/src/DirectorState.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";

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
      _navigateToMap(`${__STATIC_BASE_PATH}/maps/${mapName}.map`);
    },
  });

  function start() {
    domMessagePort.onmessage = _domMessageRouter;
  }

  function stop() {
    domMessagePort.onmessage = null;
  }

  function _navigateToMap(filename: string): void {
    // prettier-ignore
    directorState.next = MapScene(
      logger,
      effectComposer,
      eventBus,
      dimensionsState,
      inputState,
      domMessagePort,
      md2MessagePort,
      progressMessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      filename,
    );
  }

  return Object.seal({
    name: "UIMessageResponder",

    start: start,
    stop: stop,
  });
}
