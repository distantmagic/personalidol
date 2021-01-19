import { MathUtils } from "three/src/math/MathUtils";

// import type { Mesh } from "three/src/objects/Mesh";

import type { EntityProperties } from "@personalidol/quakemaps/src/EntityProperties.type";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { WorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function RotateScriptedBlockController(entityProperties: EntityProperties, blockView: WorldspawnGeometryView): ScriptedBlockController {
  function update(delta: number) {
    blockView.viewRotation.y += 0.1 * delta;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "RotateScriptedBlockController",
    isExpectingTargets: false,
    isScriptedBlockController: true,
    needsUpdates: true,

    update: update,
  });
}
