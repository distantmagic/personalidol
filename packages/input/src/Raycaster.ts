import { Raycaster as THREERaycaster } from "three/src/core/Raycaster";
import { Vector2 } from "three/src/math/Vector2";

import { getPrimaryPointerVectorX } from "./getPrimaryPointerVectorX";
import { getPrimaryPointerVectorY } from "./getPrimaryPointerVectorY";

import type { Raycaster as ITHREERaycaster } from "three/src/core/Raycaster";
import type { Vector2 as IVector2 } from "three/src/math/Vector2";

import type { CameraController } from "@personalidol/framework/src/CameraController.interface";

import type { Raycastable } from "./Raycastable.interface";
import type { Raycaster as IRaycaster } from "./Raycaster.interface";
import type { RaycasterState } from "./RaycasterState.type";

export function Raycaster(camerController: CameraController, dimensionsState: Uint32Array, mouseState: Int32Array, touchState: Int32Array): IRaycaster {
  const state: RaycasterState = Object.seal({
    hasIntersections: false,
    needsUpdates: true,
    intersections: new Set(),
  });
  const raycastables: Set<Raycastable> = new Set();

  const _threeRaycaster: ITHREERaycaster = new THREERaycaster();
  const _vector2: IVector2 = new Vector2();

  function _clearIntersections(): void {
    state.hasIntersections = false;
    state.intersections.clear();
  }

  function _raycast(raycastable: Raycastable): void {
    raycastable.state.isRayIntersecting = _threeRaycaster.intersectObject(raycastable.raycasterObject3D, false).length > 0;

    if (raycastable.state.isRayIntersecting) {
      state.intersections.add(raycastable);
    }

    if (!state.hasIntersections) {
      state.hasIntersections = raycastable.state.isRayIntersecting;
    }
  }

  function _resetRaycastable(raycastable: Raycastable): void {
    raycastable.state.isRayIntersecting = false;
  }

  function _updateRaycasterCamera(): void {
    _vector2.x = getPrimaryPointerVectorX(dimensionsState, mouseState, touchState);
    _vector2.y = getPrimaryPointerVectorY(dimensionsState, mouseState, touchState);
    _threeRaycaster.setFromCamera(_vector2, camerController.camera);
  }

  function reset(): void {
    _clearIntersections();
    raycastables.forEach(_resetRaycastable);
  }

  function update(): void {
    _updateRaycasterCamera();
    _clearIntersections();
    raycastables.forEach(_raycast);
  }

  return Object.freeze({
    isRaycaster: true,
    raycastables: raycastables,
    state: state,

    reset: reset,
    update: update,
  });
}
