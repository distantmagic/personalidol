import { BoxBufferGeometry } from "three/src/geometries/BoxBufferGeometry";
import { MathUtils } from "three/src/math/MathUtils";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";

import { createEmptyMesh } from "@personalidol/framework/src/createEmptyMesh";
import { disposableGeneric } from "@personalidol/framework/src/disposableGeneric";
import { disposableMaterial } from "@personalidol/framework/src/disposableMaterial";
import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { noop } from "@personalidol/framework/src/noop";

import type { Scene } from "three/src/scenes/Scene";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
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

  const _boxMesh = createEmptyMesh();
  const _disposables: Set<DisposableCallback> = new Set();

  function dispose(): void {
    state.isDisposed = true;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    scene.add(_boxMesh);
  }

  function preload(): void {
    state.isPreloading = false;
    state.isPreloaded = true;

    const _boxGeometry = new BoxBufferGeometry(10, 10, 10);
    const _boxMaterial = new MeshBasicMaterial();

    _boxMesh.geometry = _boxGeometry;
    _boxMesh.material = _boxMaterial;

    _disposables.add(disposableGeneric(_boxGeometry));
    _disposables.add(disposableMaterial(_boxMaterial));

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
    viewPosition: _boxMesh.position,
    viewRotation: _boxMesh.rotation,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: noop,
  });
}
