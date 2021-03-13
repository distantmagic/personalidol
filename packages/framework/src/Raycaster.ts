import { Raycaster as THREERaycaster } from "three/src/core/Raycaster";
import { Vector2 } from "three/src/math/Vector2";

import { getPrimaryPointerVectorX } from "./getPrimaryPointerVectorX";
import { getPrimaryPointerVectorY } from "./getPrimaryPointerVectorY";

import type { Raycaster as ITHREERaycaster } from "three/src/core/Raycaster";
import type { Vector2 as IVector2 } from "three/src/math/Vector2";

import type { CameraController } from "./CameraController.interface";
import type { MainLoopUpdatableState } from "./MainLoopUpdatableState.type";
import type { Raycastable } from "./Raycastable.interface";
import type { Raycaster as IRaycaster } from "./Raycaster.interface";

export function Raycaster(camerController: CameraController, mouseState: Int32Array, touchState: Int32Array): IRaycaster {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });
  const raycastables: Set<Raycastable> = new Set();

  const _threeRaycaster: ITHREERaycaster = new THREERaycaster();
  const _vector2: IVector2 = new Vector2();

  function _raycast(raycastable: Raycastable): void {
    raycastable.state.isRayIntersecting = _threeRaycaster.intersectObject(raycastable.object3D, false).length > 0;
  }

  function _updateRaycasterCamera(): void {
    _vector2.x = getPrimaryPointerVectorX(mouseState, touchState);
    _vector2.y = getPrimaryPointerVectorY(mouseState, touchState);
    _threeRaycaster.setFromCamera(_vector2, camerController.camera);
  }

  function update(): void {
    _updateRaycasterCamera();
    raycastables.forEach(_raycast);
  }

  return Object.freeze({
    isRaycaster: true,
    raycastables: raycastables,
    state: state,

    update: update,
  });
}
