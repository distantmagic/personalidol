import { MathUtils } from "three/src/math/MathUtils";

import { name } from "@personalidol/framework/src/name";

import { WorldspawnGeometryView } from "./WorldspawnGeometryView";

import type { Logger } from "loglevel";
import type { Mesh } from "three/src/objects/Mesh";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { WorldspawnGeometryView as IWorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function ScriptedBlockView(logger: Logger, scene: Scene, entity: EntityScriptedBlock, worldspawnTexture: ITexture, views: Set<View>): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  let _mesh: null | Mesh = null;
  let _worldspawnGeometryView: IWorldspawnGeometryView = WorldspawnGeometryView(logger, scene, entity, worldspawnTexture, true);

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

  function update(delta: number) {
    _mesh = _worldspawnGeometryView.three.mesh;

    if (!_mesh) {
      throw new Error("Worldspawn geometry mesh is not preloaded.");
    }

    _mesh.rotation.y += 0.1 * delta;
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
    update: update,
  });
}
