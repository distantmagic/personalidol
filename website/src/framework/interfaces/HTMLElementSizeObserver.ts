import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type ElementSize from "src/framework/interfaces/ElementSize";
import type EventListenerSet from "src/framework/interfaces/EventListenerSet";
import type Observer from "src/framework/interfaces/Observer";

export default interface HTMLElementSizeObserver extends Observer {
  readonly onResize: EventListenerSet<[ElementSize<ElementPositionUnit.Px>]>;
}
