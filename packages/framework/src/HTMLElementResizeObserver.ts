import { Dimensions } from "./Dimensions";

import type { HTMLElementResizeObserver as IHTMLElementResizeObserver } from "./HTMLElementResizeObserver.interface";
import type { HTMLElementResizeObserverState } from "./HTMLElementResizeObserverState.type";
import type { TickTimerState } from "./TickTimerState.type";

export function HTMLElementResizeObserver(htmlElement: HTMLElement, dimensionsState: Uint16Array, tickTimerState: TickTimerState): IHTMLElementResizeObserver {
  const state: HTMLElementResizeObserverState = Object.seal({
    lastUpdate: 0,
  });
  const _resizeObserver = new ResizeObserver(_onResizeObserverTriggered);

  let _needsUpdating = false;

  function start(): void {
    _resizeObserver.observe(htmlElement);
  }

  function stop(): void {
    _resizeObserver.disconnect();
  }

  function update(): void {
    if (!_needsUpdating) {
      return;
    }

    // ResizeObserver theoretically provides the same values as bounding
    // rect, but in reality sometimes it gives incorrect values, for example
    // when element uses vh / wv units
    const { bottom, left, right, top } = htmlElement.getBoundingClientRect();

    dimensionsState[Dimensions.code.P_BOTTOM] = bottom;
    dimensionsState[Dimensions.code.P_LEFT] = left;
    dimensionsState[Dimensions.code.P_RIGHT] = right;
    dimensionsState[Dimensions.code.P_TOP] = top;
    dimensionsState[Dimensions.code.D_HEIGHT] = bottom - top;
    dimensionsState[Dimensions.code.D_WIDTH] = right - left;

    state.lastUpdate = tickTimerState.currentTick;
    _needsUpdating = false;
  }

  function _onResizeObserverTriggered(): void {
    _needsUpdating = true;
  }

  return Object.freeze({
    state: state,

    start: start,
    stop: stop,
    update: update,
  });
}
