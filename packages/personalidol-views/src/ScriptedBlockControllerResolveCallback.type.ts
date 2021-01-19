import type { EntityScriptedBlock } from "@personalidol/personalidol-mapentities/src/EntityScriptedBlock.type";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";
import type { ViewGeometry } from "./ViewGeometry.type";

export type ScriptedBlockControllerResolveCallback = (entity: EntityScriptedBlock, viewGeometry: ViewGeometry) => ScriptedBlockController;
