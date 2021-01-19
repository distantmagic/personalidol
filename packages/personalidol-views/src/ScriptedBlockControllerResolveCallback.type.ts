import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { WorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export type ScriptedBlockControllerResolveCallback = (entity: EntityScriptedBlock, blockView: WorldspawnGeometryView, targetedViews: Set<View>) => ScriptedBlockController;
