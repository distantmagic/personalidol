import { MathUtils } from "three/src/math/MathUtils";

import { noop } from "@personalidol/framework/src/noop";

import type { ScriptedBlockController } from "./ScriptedBlockController.interface";

export function FollowScriptedBlockController(): ScriptedBlockController {
  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "FollowScriptedBlockController",
    isExpectingTargets: true,
    isScriptedBlockController: true,

    update: noop,
  });
}
