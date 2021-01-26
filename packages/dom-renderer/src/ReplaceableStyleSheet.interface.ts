import type { Scene } from "@personalidol/framework/src/Scene.interface";

import type { ReplaceableStyleSheetState } from "./ReplaceableStyleSheetState.type";

export interface ReplaceableStyleSheet extends Scene {
  state: ReplaceableStyleSheetState;
}
