import { MathUtils } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";

import { onlyOne } from "@personalidol/framework/src/onlyOne";

import type { Vector3 as IVector3 } from "three/src/math/Vector3";

import type { View } from "@personalidol/framework/src/View.interface";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ScriptedBlockControllerState } from "./ScriptedBlockControllerState.type";
import type { WorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function FollowScriptedBlockController(blockView: WorldspawnGeometryView, targetedViews: Set<View>): ScriptedBlockController {
  if (targetedViews.size > 1) {
    throw new Error(`Can follow more than one target. Got: "${targetedViews.size}"`);
  }

  const state: ScriptedBlockControllerState = Object.seal({
    isPaused: false,
    needsUpdates: true,
  });

  const _direction: IVector3 = new Vector3();
  let _followed: View = onlyOne(targetedViews, "Target supposed to be followed does not exist.");
  let _velocity: number = 100;

  function pause(): void {
    state.isPaused = true;
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number) {
    if (state.isPaused) {
      return;
    }

    const _frameDistance: number = _velocity * delta;

    _direction.subVectors(_followed.object3D.position, blockView.object3D.position);

    if (_direction.length() > _frameDistance) {
      _direction.normalize().multiplyScalar(_frameDistance);
      blockView.object3D.position.add(_direction);
    } else {
      blockView.object3D.position.copy(_followed.object3D.position);
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isExpectingTargets: true,
    isScriptedBlockController: true,
    name: "FollowScriptedBlockController",
    state: state,

    pause: pause,
    unpause: unpause,
    update: update,
  });
}
