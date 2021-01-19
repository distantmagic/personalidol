import { MathUtils } from "three/src/math/MathUtils";

// import { must } from "@personalidol/framework/src/must";

import type { Mesh } from "three/src/objects/Mesh";

import type { EntityProperties } from "@personalidol/quakemaps/src/EntityProperties.type";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ViewGeometry } from "./ViewGeometry.type";

export function RotateScriptedBlockController(entityProperties: EntityProperties, viewGeometry: ViewGeometry): ScriptedBlockController {
  let _mesh: null | Mesh = null;

  function update(delta: number) {
    _mesh = viewGeometry.mesh;

    if (!_mesh) {
      throw new Error("View geometry mesh is not preloaded.");
    }

    _mesh.rotation.y += 0.1 * delta;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "RotateScriptedBlockController",
    isExpectingTargets: false,
    isScriptedBlockController: true,

    update: update,
  });
}
