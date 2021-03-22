import { MathUtils } from "three/src/math/MathUtils";
import { Object3D } from "three/src/core/Object3D";

import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { mountAll } from "@personalidol/framework/src/mountAll";
import { noop } from "@personalidol/framework/src/noop";
import { unmountAll } from "@personalidol/framework/src/unmountAll";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";

import type { ViewState } from "@personalidol/views/src/ViewState.type";

import type { EntityScriptedZone } from "./EntityScriptedZone.type";
import type { EntityView } from "./EntityView.interface";
import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";

import type { UserSettings } from "./UserSettings.type";

export function ScriptedZoneView(logger: Logger, userSettings: UserSettings, scene: Scene, entity: EntityScriptedZone): EntityView {
  const state: ViewState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    isRayIntersecting: false,
    needsRaycast: false,
    needsUpdates: false,
  });

  const _disposables: Set<DisposableCallback> = new Set();
  const _mountables: Set<MountableCallback> = new Set();
  const _unmountables: Set<UnmountableCallback> = new Set();

  function dispose(): void {
    state.isDisposed = true;

    disposeAll(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    mountAll(_mountables);
  }

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    unmountAll(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isRaycastable: true,
    isView: true,
    name: `ScriptedZoneView()`,
    object3D: new Object3D(),
    raycasterObject3D: new Object3D(),
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: noop,
  });
}
