import type { VNode } from "preact";

import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMUpdatesProps } from "./DOMUpdatesProps.interface";
import type { ReplaceableStyleSheet } from "./ReplaceableStyleSheet.interface";

export interface DOMElementView<U extends UserSettings> extends DOMUpdatesProps, HTMLElement, MainLoopUpdatable {
  domMessagePort: null | MessagePort;
  inputState: Int32Array;
  needsRender: boolean;
  props: DOMElementProps;
  propsLastUpdate: number;
  styleSheet: null | ReplaceableStyleSheet;
  uiMessagePort: null | MessagePort;
  userSettings: null | U;
  userSettingsLastAcknowledgedVersion: number;
  viewLastUpdate: number;

  beforeRender(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void;

  render(delta: number, elapsedTime: number, tickTimerState: TickTimerState): null | VNode<any>;
}
