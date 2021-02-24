import { MathUtils } from "three/src/math/MathUtils";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ScriptedBlockControllerState } from "./ScriptedBlockControllerState.type";
import type { WorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function RotateScriptedBlockController(blockView: WorldspawnGeometryView): ScriptedBlockController {
  const state: ScriptedBlockControllerState = Object.seal({
    isPaused: false,
    needsUpdates: true,
  });

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

    blockView.object3D.rotation.y += 0.1 * delta;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    isExpectingTargets: false,
    isScriptedBlockController: true,
    name: "RotateScriptedBlockController",
    state: state,

    pause: pause,
    unpause: unpause,
    update: update,
  });
}
