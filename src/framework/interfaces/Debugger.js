// @flow

import type { DebuggerState } from "../types/DebuggerState";
import type { DebuggerStateChangeCallback } from "../types/DebuggerStateChangeCallback";

export interface Debugger {
  getState(): DebuggerState;

  offStateChange(DebuggerStateChangeCallback): void;

  onStateChange(DebuggerStateChangeCallback): void;

  setState(DebuggerState): void;
}
