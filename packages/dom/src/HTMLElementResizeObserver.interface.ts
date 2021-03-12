import type { MainLoopUpdatable } from "./MainLoopUpdatable.interface";
import type { Service } from "./Service.interface";

export interface HTMLElementResizeObserver extends MainLoopUpdatable, Service {
  isHTMLElementResizeObserver: true;
}
