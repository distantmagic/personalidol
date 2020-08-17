import type { HTMLElementResizeObserverState } from "./HTMLElementResizeObserverState.type";
import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface HTMLElementResizeObserver extends MainLoopUpdatable, Service {
  readonly state: HTMLElementResizeObserverState;
}
