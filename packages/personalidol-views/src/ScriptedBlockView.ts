import { MathUtils } from "three/src/math/MathUtils";

import { name } from "@personalidol/framework/src/name";

import { FollowScriptedBlockController } from "./FollowScriptedBlockController";
import { RotateScriptedBlockController } from "./RotateScriptedBlockController";
import { WorldspawnGeometryView } from "./WorldspawnGeometryView";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";

import type { WorldspawnGeometryView as IWorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function ScriptedBlockView(logger: Logger, scene: Scene, entity: EntityScriptedBlock, worldspawnTexture: ITexture, views: Set<View>): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _worldspawnGeometryView: IWorldspawnGeometryView = WorldspawnGeometryView(logger, scene, entity, worldspawnTexture, true);
  const _controller: ScriptedBlockController = _getController(entity.controller);

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

  function _getController(controllerName: string): ScriptedBlockController {
    switch (controllerName) {
      case "follow":
        return FollowScriptedBlockController();
      case "rotate_y":
        return RotateScriptedBlockController(_worldspawnGeometryView.viewGeometry);
      default:
        throw new Error(`View controller does not exist: "${controllerName}"`);
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isScene: false,
    isView: true,
    name: `ScriptedBlockView("${entity.controller}", ${name(_worldspawnGeometryView)})`,
    needsUpdates: true,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: _controller.update,
  });
}
