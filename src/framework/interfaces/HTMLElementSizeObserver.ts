import ElementSize from "src/framework/interfaces/ElementSize";
import EventListenerSet from "src/framework/interfaces/EventListenerSet";
import Observer from "src/framework/interfaces/Observer";
import Resizeable from "src/framework/interfaces/Resizeable";

export default interface HTMLElementSizeObserver extends Observer {
  readonly onResize: EventListenerSet<[ElementSize<"px">]>;
}
