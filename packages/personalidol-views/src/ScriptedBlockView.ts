import { MathUtils } from "three/src/math/MathUtils";

import { name } from "@personalidol/framework/src/name";

import { WorldspawnGeometryView } from "./WorldspawnGeometryView";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityView } from "./EntityView.interface";
import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ScriptedBlockControllerResolveCallback } from "./ScriptedBlockControllerResolveCallback.type";

import type { WorldspawnGeometryView as IWorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function ScriptedBlockView(
  logger: Logger,
  scene: Scene,
  entity: EntityScriptedBlock,
  worldspawnTexture: ITexture,
  views: Set<View>,
  targetedViews: Set<View>,
  resolveScriptedBlockController: ScriptedBlockControllerResolveCallback
): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _worldspawnGeometryView: IWorldspawnGeometryView = WorldspawnGeometryView(logger, scene, entity, worldspawnTexture, true);
  const _controller: ScriptedBlockController = resolveScriptedBlockController(entity, _worldspawnGeometryView, targetedViews);

  function dispose(): void {
    state.isDisposed = true;
  }

  function mount(): void {
    state.isMounted = true;
  }

  function preload(): void {
    views.add(_worldspawnGeometryView);

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: _controller.isExpectingTargets,
    isScene: false,
    isView: true,
    name: `ScriptedBlockView("${entity.controller}", ${name(_worldspawnGeometryView)})`,
    needsUpdates: _controller.needsUpdates,
    state: state,
    viewPosition: _worldspawnGeometryView.viewPosition,
    viewRotation: _worldspawnGeometryView.viewRotation,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: _controller.update,
  });
}
