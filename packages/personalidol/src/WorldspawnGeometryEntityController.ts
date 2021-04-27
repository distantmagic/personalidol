import { createRouter } from "@personalidol/framework/src/createRouter";
import { generateUUID } from "@personalidol/math/src/generateUUID";
import { name } from "@personalidol/framework/src/name";

import type { MessageSimulantDispose } from "@personalidol/dynamics/src/MessageSimulantDispose.type";
import type { MessageSimulantRegister } from "@personalidol/dynamics/src/MessageSimulantRegister.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { EntityController } from "./EntityController.interface";
import type { EntityControllerState } from "./EntityControllerState.type";
import type { EntityView } from "./EntityView.interface";
import type { EntityWorldspawn } from "./EntityWorldspawn.type";
import type { SimulantsLookup } from "./SimulantsLookup.type";

export function WorldspawnGeometryEntityController(view: EntityView<EntityWorldspawn>, dynamicsMessagePort: MessagePort): EntityController<EntityWorldspawn> {
  const state: EntityControllerState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  const _simulantFeedbackMessageRouter = createRouter({
    preloaded: _onSimulantPreloaded,
  });

  let _internalDynamicsMessageChannel: MessageChannel = new MessageChannel();
  let _simulantId: string = generateUUID();

  function _onSimulantPreloaded(): void {
    if (!state.isPreloading) {
      throw new Error("Controller is not preloading, but simulant reported preloaded state.");
    }

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function dispose(): void {
    state.isDisposed = true;

    dynamicsMessagePort.postMessage({
      disposeSimulant: <MessageSimulantDispose>[_simulantId],
    });

    _internalDynamicsMessageChannel.port1.close();
    // _internalDynamicsMessageChannel.port2.close();
  }

  function mount(): void {
    state.isMounted = true;
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = true;
    state.isPreloaded = false;

    _internalDynamicsMessageChannel.port1.onmessage = _simulantFeedbackMessageRouter;

    dynamicsMessagePort.postMessage(
      {
        registerSimulant: <MessageSimulantRegister<SimulantsLookup, "worldspawn-geoemetry">>{
          id: _simulantId,
          simulant: "worldspawn-geoemetry",
          simulantFeedbackMessagePort: _internalDynamicsMessageChannel.port2,
        },
      },
      [_internalDynamicsMessageChannel.port2]
    );

    // Send an entity copy and do not use transferables as View may be already
    // using those parameters.
    _internalDynamicsMessageChannel.port1.postMessage({
      brushes: view.entity.brushes,
    });
  }

  function unmount(): void {
    state.isMounted = false;
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {}

  return Object.freeze({
    id: generateUUID(),
    isDisposable: true,
    isEntityController: true,
    isMountable: true,
    isPreloadable: true,
    name: `WorldspawnGeometryEntityController(${name(view)})`,
    state: state,
    view: view,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
