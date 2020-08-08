import type { EventBus } from "./EventBus.interface";
import type { EventBusZoomAmountCallback } from "./EventBusZoomAmountCallback.type";

export function EventBus(): EventBus {
  return Object.freeze({
    POINTER_ZOOM_REQUEST: new Set<EventBusZoomAmountCallback>(),
  });
}
