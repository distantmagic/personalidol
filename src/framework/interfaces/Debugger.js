// @flow

import type { DebuggerState } from "../types/DebuggerState";
import type { DebuggerStateChangeCallback } from "../types/DebuggerStateChangeCallback";
import type { DebuggerStateValue } from "../types/DebuggerStateValue";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface Debugger {
  getState(): DebuggerState;

  offStateChange(DebuggerStateChangeCallback): void;

  onStateChange(DebuggerStateChangeCallback): void;

  setState(DebuggerState): void;

  updateState(LoggerBreadcrumbs, DebuggerStateValue): void;
}
