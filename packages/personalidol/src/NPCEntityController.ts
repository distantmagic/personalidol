import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { name } from "@personalidol/framework/src/name";

import type { Logger } from "loglevel";

import type { MessageSimulantDispose } from "@personalidol/dynamics/src/MessageSimulantDispose.type";
import type { MessageSimulantRegister } from "@personalidol/dynamics/src/MessageSimulantRegister.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { CharacterView } from "./CharacterView.interface";
import type { EntityControllerState } from "./EntityControllerState.type";
import type { NPCEntity } from "./NPCEntity.type";
import type { NPCEntityController } from "./NPCEntityController.interface";
import type { SimulantsLookup } from "./SimulantsLookup.type";

export function NPCEntityController<E extends NPCEntity>(logger: Logger, view: CharacterView<E>, dynamicsMessagePort: MessagePort): NPCEntityController<E> {
  const state: EntityControllerState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloading: false,
    isPreloaded: false,
    needsUpdates: true,
  });

  const _simulantFeedbackMessageRouter = createRouter({
    origin: _onSimulantOriginChange,
    preloaded: _onSimulantPreloaded,
  });

  let _internalDynamicsMessageChannel: MessageChannel = new MessageChannel();
  let _simulantId: string = MathUtils.generateUUID();

  function _onSimulantOriginChange(origin: Vector3Simple): void {
    view.object3D.position.set(origin.x, origin.y, origin.z);
  }

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

  function applyCentralImpulse(x: number, y: number, z: number): void {
    _internalDynamicsMessageChannel.port1.postMessage({
      applyCentralImpulse: {
        x: x,
        y: y,
        z: z,
      },
    });
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
        registerSimulant: <MessageSimulantRegister<SimulantsLookup, "npc">>{
          id: _simulantId,
          simulant: "npc",
          simulantFeedbackMessagePort: _internalDynamicsMessageChannel.port2,
        },
      },
      [_internalDynamicsMessageChannel.port2]
    );

    _internalDynamicsMessageChannel.port1.postMessage({
      entity: view.entity,
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
    id: MathUtils.generateUUID(),
    isDisposable: true,
    isEntityController: true,
    isMountable: true,
    isPreloadable: true,
    name: `NPCEntityController(${name(view)})`,
    state: state,
    view: view,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,

    applyCentralImpulse: applyCentralImpulse,
  });
}
