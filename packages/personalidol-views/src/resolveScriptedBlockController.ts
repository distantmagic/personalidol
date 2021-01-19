import { FollowScriptedBlockController } from "./FollowScriptedBlockController";
import { RotateScriptedBlockController } from "./RotateScriptedBlockController";

import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ViewGeometry } from "./ViewGeometry.type";

export function resolveScriptedBlockController(entity: EntityScriptedBlock, viewGeometry: ViewGeometry): ScriptedBlockController {
  switch (entity.controller) {
    case "follow":
      return FollowScriptedBlockController();
    case "rotate":
      return RotateScriptedBlockController(entity.properties, viewGeometry);
    default:
      throw new Error(`View controller does not exist: "${entity.controller}"`);
  }
}
