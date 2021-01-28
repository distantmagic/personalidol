import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { RendererDimensionsManagerState } from "./RendererDimensionsManagerState.type";

export interface RendererDimensionsManager extends MainLoopUpdatable, Service {
  state: RendererDimensionsManagerState;
}
