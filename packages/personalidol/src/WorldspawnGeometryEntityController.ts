import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { name } from "@personalidol/framework/src/name";

import type { MessageSimulantRegister } from "@personalidol/dynamics/src/MessageSimulantRegister.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { EntityController } from "./EntityController.interface";
import type { EntityControllerState } from "./EntityControllerState.type";
import type { EntityView } from "./EntityView.interface";
import type { EntityWorldspawn } from "./EntityWorldspawn.type";
import type { SimulantsLookup } from "./SimulantsLookup.type";

export function WorldspawnGeometryEntityController(view: EntityView<EntityWorldspawn>, physicsMessagePort: MessagePort): EntityController<EntityWorldspawn> {
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

  let _internalPhysicsMessageChannel: MessageChannel = new MessageChannel();
  let _notifyPreloaded: null | Function = null;

  function _onSimulantPreloaded(): void {
    if (!_notifyPreloaded) {
      throw new Error("Controller must be preloaded before simulant.");
    }

    state.isPreloading = false;
    state.isPreloaded = true;

    _notifyPreloaded();
    _notifyPreloaded = null;
  }

  function dispose(): void {
    state.isDisposed = true;

    _internalPhysicsMessageChannel.port1.close();
    // _internalPhysicsMessageChannel.port2.close();
  }

  function mount(): void {
    state.isMounted = true;
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): Promise<void> {
    state.isPreloading = true;
    state.isPreloaded = false;

    const ret: Promise<void> = new Promise(function (resolve) {
      _notifyPreloaded = resolve;
    });

    _internalPhysicsMessageChannel.port1.onmessage = _simulantFeedbackMessageRouter;

    physicsMessagePort.postMessage(
      {
        registerSimulant: <MessageSimulantRegister<SimulantsLookup, "worldspawn-geoemetry">>{
          id: MathUtils.generateUUID(),
          simulant: "worldspawn-geoemetry",
          simulantFeedbackMessagePort: _internalPhysicsMessageChannel.port2,
        },
      },
      [_internalPhysicsMessageChannel.port2]
    );

    return ret;
  }

  function unmount(): void {
    state.isMounted = false;
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {}

  return Object.freeze({
    id: MathUtils.generateUUID(),
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
