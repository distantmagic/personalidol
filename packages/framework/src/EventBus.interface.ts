import type { EventBusZoomAmountCallback } from "./EventBusZoomAmountCallback.type";

export interface EventBus {
  readonly POINTER_ZOOM_REQUEST: Set<EventBusZoomAmountCallback>;
}
