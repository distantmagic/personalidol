import { MathUtils } from "three/src/math/MathUtils";
import { Vector3 } from "three/src/math/Vector3";

import type { Vector3 as IVector3 } from "three/src/math/Vector3";

import type { View } from "@personalidol/framework/src/View.interface";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { WorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function FollowScriptedBlockController(blockView: WorldspawnGeometryView, targetedViews: Set<View>): ScriptedBlockController {
  if (targetedViews.size > 1) {
    throw new Error(`Can follow more than one target. Got: "${targetedViews.size}"`);
  }

  const _direction: IVector3 = new Vector3();
  let _followed: null | View = null;
  let _velocity: number = 1;

  for (let view of targetedViews) {
    _followed = view;
  }

  function update(delta: number) {
    if (!_followed) {
      throw new Error("Target supposed to be followed does not exist.");
    }

    _direction.subVectors(_followed.viewPosition, blockView.viewPosition);

    if (_direction.length() > _velocity) {
      _direction.normalize().multiplyScalar(_velocity);
      blockView.viewPosition.add(_direction);
    } else {
      blockView.viewPosition.copy(_followed.viewPosition);
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "FollowScriptedBlockController",
    isExpectingTargets: true,
    isScriptedBlockController: true,
    needsUpdates: true,

    update: update,
  });
}
