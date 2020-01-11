import { Observer } from "./Observer";
import { Resizeable } from "./Resizeable";

export interface HTMLElementResizeObserver extends Observer {
  off(resizeable: Resizeable<"px">): void;

  notify(resizeable: Resizeable<"px">): void;
}
