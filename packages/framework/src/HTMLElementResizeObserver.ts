/// <reference types="@types/resize-observer-browser" />

import { MathUtils } from "three/src/math/MathUtils";

import { DimensionsIndices } from "./DimensionsIndices.enum";

import type { HTMLElementResizeObserver as IHTMLElementResizeObserver } from "./HTMLElementResizeObserver.interface";
import type { TickTimerState } from "./TickTimerState.type";

export function HTMLElementResizeObserver(htmlElement: HTMLElement, dimensionsState: Uint32Array, tickTimerState: TickTimerState): IHTMLElementResizeObserver {
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

    dimensionsState[DimensionsIndices.P_BOTTOM] = bottom;
    dimensionsState[DimensionsIndices.P_LEFT] = left;
    dimensionsState[DimensionsIndices.P_RIGHT] = right;
    dimensionsState[DimensionsIndices.P_TOP] = top;
    dimensionsState[DimensionsIndices.D_HEIGHT] = bottom - top;
    dimensionsState[DimensionsIndices.D_WIDTH] = right - left;

    dimensionsState[DimensionsIndices.LAST_UPDATE] = tickTimerState.currentTick;

    _needsUpdating = false;
  }

  function _onResizeObserverTriggered(): void {
    _needsUpdating = true;
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "HTMLElementResizeObserver",

    start: start,
    stop: stop,
    update: update,
  });
}
