import type { i18n, TFunction } from "i18next";
import type { VNode } from "preact";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

export interface DOMElementView<U extends UserSettings> extends HTMLElement, MainLoopUpdatable {
  readonly t: TFunction;

  css: string;
  dimensionsState: Uint32Array;
  domMessagePort: MessagePort;
  i18next: i18n;
  keyboardState: Uint8Array;
  mouseState: Int32Array;
  touchState: Int32Array;
  lastRenderedLanguage: string;
  needsRender: boolean;
  uiMessagePort: MessagePort;
  userSettings: U;

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void;

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any>;
}
