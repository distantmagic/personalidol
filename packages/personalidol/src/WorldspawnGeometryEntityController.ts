import { MathUtils } from "three/src/math/MathUtils";

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

  let _simulantId: null | string = null;

  function dispose(): void {
    state.isDisposed = true;
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

    _simulantId = MathUtils.generateUUID();

    physicsMessagePort.postMessage({
      registerSimulant: <MessageSimulantRegister<SimulantsLookup, "worldspawn-geoemetry">>{
        id: _simulantId,
        rpc: MathUtils.generateUUID(),
        simulant: "worldspawn-geoemetry",
      },
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
