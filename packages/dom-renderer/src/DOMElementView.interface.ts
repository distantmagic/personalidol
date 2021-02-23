import type { VNode } from "preact";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMUpdatesProps } from "./DOMUpdatesProps.interface";

export interface DOMElementView<U extends UserSettings> extends DOMUpdatesProps, HTMLElement, MainLoopUpdatable {
  css: string;
  domMessagePort: MessagePort;
  inputState: Int32Array;
  needsRender: boolean;
  props: DOMElementProps;
  propsLastUpdate: number;
  uiMessagePort: MessagePort;
  userSettings: U;
  userSettingsLastAcknowledgedVersion: number;
  viewLastUpdate: number;

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void;

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any>;
}
