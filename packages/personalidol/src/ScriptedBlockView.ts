import { MathUtils } from "three/src/math/MathUtils";

import { name } from "@personalidol/framework/src/name";
import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { mountAll } from "@personalidol/framework/src/mountAll";
import { unmountAll } from "@personalidol/framework/src/unmountAll";

import { useObjectLabel } from "./useObjectLabel";
import { WorldspawnGeometryView } from "./WorldspawnGeometryView";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { View } from "@personalidol/framework/src/View.interface";
import type { ViewState } from "@personalidol/framework/src/ViewState.type";

import type { EntityScriptedBlock } from "./EntityScriptedBlock.type";
import type { EntityView } from "./EntityView.interface";
import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ScriptedBlockControllerResolveCallback } from "./ScriptedBlockControllerResolveCallback.type";
import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { MountableCallback } from "@personalidol/framework/src/MountableCallback.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";

import type { UserSettings } from "./UserSettings.type";
import type { WorldspawnGeometryView as IWorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function ScriptedBlockView(
  logger: Logger,
  userSettings: UserSettings,
  scene: Scene,
  entity: EntityScriptedBlock,
  domMessagePort: MessagePort,
  worldspawnTexture: ITexture,
  views: Set<View>,
  targetedViews: Set<View>,
  resolveScriptedBlockController: ScriptedBlockControllerResolveCallback
): EntityView {
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

  const _worldspawnGeometryView: IWorldspawnGeometryView = WorldspawnGeometryView(logger, userSettings, scene, entity, worldspawnTexture, true);
  const _controller: ScriptedBlockController = resolveScriptedBlockController(entity, _worldspawnGeometryView, targetedViews);

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
    _controller.pause();
  }

  function preload(): void {
    views.add(_worldspawnGeometryView);

    useObjectLabel(domMessagePort, _worldspawnGeometryView.object3D, entity, _mountables, _unmountables, _disposables);

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    unmountAll(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;
    _controller.unpause();
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: _controller.isExpectingTargets,
    isRaycastable: true,
    isView: true,
    name: `ScriptedBlockView("${entity.controller}", ${name(_worldspawnGeometryView)})`,
    object3D: _worldspawnGeometryView.object3D,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: _controller.update,
  });
}
