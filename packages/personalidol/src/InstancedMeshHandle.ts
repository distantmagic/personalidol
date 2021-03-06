import { MathUtils } from "three/src/math/MathUtils";

import type { Logger } from "loglevel";
import type { InstancedMesh } from "three/src/objects/InstancedMesh";
import type { Object3D } from "three/src/core/Object3D";

import type { InstancedMeshHandle as IInstancedMeshHandle } from "./InstancedMeshHandle.interface";
import type { InstancedMeshHandleState } from "./InstancedMeshHandleState.type";
import type { UserSettings } from "./UserSettings.type";

export function InstancedMeshHandle(logger: Logger, userSettings: UserSettings, mesh: InstancedMesh, index: number, reference: Object3D): IInstancedMeshHandle {
  const state: InstancedMeshHandleState = Object.seal({
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  let _needsUpdate: boolean = false;

  function _updateMatrix(): void {
    reference.updateMatrix();

    mesh.setMatrixAt(index, reference.matrix);
    mesh.instanceMatrix.needsUpdate = true;
  }

  function preload(): void {
    state.isPreloading = true;

    _updateMatrix();

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function update(): void {
    if (!_needsUpdate) {
      return;
    }

    _needsUpdate = false;
    _updateMatrix();
  }

  return Object.freeze({
    set needsUpdate(needsUpdate: boolean) {
      _needsUpdate = needsUpdate;
    },

    id: MathUtils.generateUUID(),
    isInstancedMeshHandle: true,
    name: "InstancedMeshHandle",
    object3D: reference,
    state: state,

    preload: preload,
    update: update,
  });
}
