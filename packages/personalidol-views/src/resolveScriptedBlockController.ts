import { FollowScriptedBlockController } from "./FollowScriptedBlockController";
import { RotateScriptedBlockController } from "./RotateScriptedBlockController";

import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { WorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export function resolveScriptedBlockController(entity: EntityScriptedBlock, blockView: WorldspawnGeometryView, targetedViews: Set<View>): ScriptedBlockController {
  switch (entity.controller) {
    case "follow":
      return FollowScriptedBlockController(blockView, targetedViews);
    case "rotate":
      return RotateScriptedBlockController(blockView);
    default:
      throw new Error(`View controller does not exist: "${entity.controller}"`);
  }
}
