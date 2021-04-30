import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { UIState } from "./UIState.type";
import type { UIStateControllerInfo } from "./UIStateControllerInfo.type";

export interface UIStateController extends MainLoopUpdatable, Service {
  readonly info: UIStateControllerInfo;
  readonly uiState: UIState;
}
