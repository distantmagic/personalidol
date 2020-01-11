// @flow strict

import type { DebuggerState } from "../types/DebuggerState";
import type { DebuggerStateChangeCallback } from "../types/DebuggerStateChangeCallback";
import type { DebuggerStateValue } from "../types/DebuggerStateValue";
import type { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface Debugger {
  deleteState(LoggerBreadcrumbs): void;

  getState(): DebuggerState;

  isEnabled(): boolean;

  offStateChange(DebuggerStateChangeCallback): void;

  onStateChange(DebuggerStateChangeCallback): void;

  setIsEnabled(boolean): void;

  setState(DebuggerState): void;

  updateState(LoggerBreadcrumbs, DebuggerStateValue): void;
}
