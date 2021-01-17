import { MathUtils } from "three/src/math/MathUtils";

import type { Mesh } from "three/src/objects/Mesh";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ViewGeometry } from "./ViewGeometry.type";

export function RotateScriptedBlockController(viewGeometry: ViewGeometry): ScriptedBlockController {
  let _mesh: null | Mesh = null;

  function update(delta: number) {
    _mesh = viewGeometry.mesh;

    if (!_mesh) {
      throw new Error("View geometry mesh is not preloaded.");
    }

    _mesh.rotation.y += 0.1 * delta;
  }

  return Object.seal({
    id: MathUtils.generateUUID(),
    name: "RotateScriptedBlockController",
    isScriptedBlockController: true,

    update: update,
  });
}
