import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Raycastable } from "./Raycastable.interface";
import type { RaycasterState } from "./RaycasterState.type";

export interface Raycaster extends MainLoopUpdatable {
  readonly isRaycaster: true;
  readonly raycastables: Set<Raycastable>;
  readonly state: RaycasterState;

  reset(): void;
}
