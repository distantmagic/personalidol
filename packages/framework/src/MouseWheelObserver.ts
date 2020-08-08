import { passiveEventListener } from "./passiveEventListener";

import type { EventBus } from "./EventBus.interface";
import type { MouseWheelObserver as IMouseWheelObserver } from "./MouseWheelObserver.interface";

export function MouseWheelObserver(htmlElement: HTMLElement, eventBus: EventBus): IMouseWheelObserver {
  let _zoomAmount = 0;

  function start(): void {
    htmlElement.addEventListener("wheel", _onMouseWheel, passiveEventListener);
  }

  function stop(): void {
    htmlElement.removeEventListener("wheel", _onMouseWheel);
  }

  function _notifyMessageDelta(callback: (zoomAmount: number) => void): void {
    callback(_zoomAmount);
  }

  function _onMouseWheel(evt: WheelEvent): void {
    _zoomAmount = evt.deltaY;

    // scrolling negative values should bring the camera closer
    eventBus.POINTER_ZOOM_REQUEST.forEach(_notifyMessageDelta);
  }

  return Object.freeze({
    start: start,
    stop: stop,
  });
}
