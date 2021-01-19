import { BoxBufferGeometry } from "three/src/geometries/BoxBufferGeometry";
import { MathUtils } from "three/src/math/MathUtils";
import { Mesh } from "three/src/objects/Mesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";

import { noop } from "@personalidol/framework/src/noop";

import type { Scene } from "three/src/scenes/Scene";

import type { EntityTarget } from "@personalidol/personalidol-mapentities/src/EntityTarget.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";

import type { EntityView } from "./EntityView.interface";

// "target" is an abstract entity. At this point it won't be used with brushes,
// so the view is barebone.

export function TargetView(scene: Scene, entity: EntityTarget): EntityView {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _boxGeometry = new BoxBufferGeometry(10, 10, 10);
  const _boxMaterial = new MeshBasicMaterial();
  const _boxMesh = new Mesh(_boxGeometry, _boxMaterial);

  function dispose(): void {
    state.isDisposed = true;

    _boxGeometry.dispose();
    _boxMaterial.dispose();
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_boxMesh);
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;

    _boxMesh.position.set(entity.origin.x, entity.origin.y, entity.origin.z);
  }

  function unmount(): void {
    state.isMounted = false;

    scene.remove(_boxMesh);
  }

  return Object.freeze({
    entity: entity,
    id: MathUtils.generateUUID(),
    isEntityView: true,
    isExpectingTargets: false,
    isScene: false,
    isView: true,
    name: `TargetView(${entity.properties.targetname})`,
    needsUpdates: false,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
