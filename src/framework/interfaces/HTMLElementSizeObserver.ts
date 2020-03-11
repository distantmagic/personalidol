import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import ElementSize from "src/framework/interfaces/ElementSize";
import EventListenerSet from "src/framework/interfaces/EventListenerSet";
import Observer from "src/framework/interfaces/Observer";

export default interface HTMLElementSizeObserver extends Observer {
  readonly onResize: EventListenerSet<[ElementSize<ElementPositionUnit.Px>]>;
}
