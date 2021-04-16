import type { Disposable } from "@personalidol/framework/src/Disposable.interface";
import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Mountable } from "@personalidol/framework/src/Mountable.interface";
import type { Pauseable } from "@personalidol/framework/src/Pauseable.interface";
import type { Preloadable } from "@personalidol/framework/src/Preloadable.interface";

import type { SimulantState } from "./SimulantState.type";

export interface Simulant extends Disposable, MainLoopUpdatable, Mountable, Pauseable, Preloadable {
  readonly isSimulant: true;
  readonly state: SimulantState;
}
