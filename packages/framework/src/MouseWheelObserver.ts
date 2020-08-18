import { isPrimaryPointerInDimensionsBounds } from "./isPrimaryPointerInDimensionsBounds";
import { passiveEventListener } from "./passiveEventListener";

import type { EventBus } from "./EventBus.interface";
import type { MouseWheelObserver as IMouseWheelObserver } from "./MouseWheelObserver.interface";

export function MouseWheelObserver(htmlElement: HTMLElement, eventBus: EventBus, dimensionsState: Uint32Array, inputState: Int32Array): IMouseWheelObserver {
  let _zoomAmount = 0;

  function start(): void {
    document.addEventListener("wheel", _onMouseWheel, passiveEventListener);
  }

  function stop(): void {
    document.removeEventListener("wheel", _onMouseWheel);
  }

  function _notifyMessageDelta(callback: (zoomAmount: number) => void): void {
    callback(_zoomAmount);
  }

  function _onMouseWheel(evt: WheelEvent): void {
    if (!isPrimaryPointerInDimensionsBounds(dimensionsState, inputState)) {
      return;
    }

    _zoomAmount = evt.deltaY;

    // scrolling negative values should bring the camera closer
    eventBus.POINTER_ZOOM_REQUEST.forEach(_notifyMessageDelta);
  }

  return Object.freeze({
    name: "MouseWheelObserver",

    start: start,
    stop: stop,
  });
}
