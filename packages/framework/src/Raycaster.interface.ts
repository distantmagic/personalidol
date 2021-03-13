import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Raycastable } from "./Raycastable.interface";

export interface Raycaster extends MainLoopUpdatable {
  readonly isRaycaster: true;
  readonly raycastables: Set<Raycastable>;
}
