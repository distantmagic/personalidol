import { MathUtils } from "three/src/math/MathUtils";

import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { mount as fMount } from "@personalidol/framework/src/mount";
import { name } from "@personalidol/framework/src/name";
import { pause as fPause } from "@personalidol/framework/src/pause";
import { preload as fPreload } from "@personalidol/framework/src/preload";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";
import { unpause as fUnpause } from "@personalidol/framework/src/unpause";

import { MD2ModelView } from "./MD2ModelView";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";

import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { ViewState } from "@personalidol/views/src/ViewState.type";

import type { CharacterView } from "./CharacterView.interface";
import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { EntityPlayer } from "./EntityPlayer.type";
import type { UserSettings } from "./UserSettings.type";

export function PlayerView(
  logger: Logger,
  userSettings: UserSettings,
  scene: Scene,
  entity: EntityPlayer,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  rpcLookupTable: RPCLookupTable
): CharacterView<EntityPlayer> {
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    isRayIntersecting: false,
    needsRaycast: false,
    needsUpdates: true,
  });

  const _md2Entity: EntityMD2Model = Object.freeze({
    id: MathUtils.generateUUID(),
    angle: 0,
    classname: "model_md2",
    model_name: "ogro",
    origin: entity.origin,
    properties: entity.properties,
    skin: 1,
    transferables: [],
  });

  const _playerModel = MD2ModelView(logger, userSettings, scene, _md2Entity, domMessagePort, md2MessagePort, texturesMessagePort, rpcLookupTable);

  function dispose(): void {
    state.isDisposed = true;
    fDispose(logger, _playerModel);
  }

  function mount(): void {
    state.isMounted = true;
    fMount(logger, _playerModel);
  }

  function pause(): void {
    state.isPaused = true;
    fPause(logger, _playerModel);
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    await fPreload(logger, _playerModel);

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;
    fUnmount(logger, _playerModel);
  }

  function unpause(): void {
    state.isPaused = false;
    fUnpause(logger, _playerModel);
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    _playerModel.state.isRayIntersecting = state.isRayIntersecting;
    _playerModel.update(delta, elapsedTime, tickTimerState);
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isCharacterView: true,
    isDisposable: true,
    isEntityView: true,
    isExpectingTargets: false,
    isMountable: true,
    isPreloadable: true,
    isRaycastable: true,
    isView: true,
    name: `PlayerView(${name(_playerModel)})`,
    object3D: _playerModel.object3D,
    raycasterObject3D: _playerModel.raycasterObject3D,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    transition: _playerModel.transition,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
