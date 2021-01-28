import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityScriptedBlock } from "./EntityScriptedBlock.type";
import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { WorldspawnGeometryView } from "./WorldspawnGeometryView.interface";

export type ScriptedBlockControllerResolveCallback = (entity: EntityScriptedBlock, blockView: WorldspawnGeometryView, targetedViews: Set<View>) => ScriptedBlockController;
