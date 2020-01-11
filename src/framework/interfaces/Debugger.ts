import { DebuggerState } from "../types/DebuggerState";
import { DebuggerStateChangeCallback } from "../types/DebuggerStateChangeCallback";
import { DebuggerStateValue } from "../types/DebuggerStateValue";
import { LoggerBreadcrumbs } from "./LoggerBreadcrumbs";

export interface Debugger {
  deleteState(loggerBreadcrumbs: LoggerBreadcrumbs): void;

  getState(): DebuggerState;

  isEnabled(): boolean;

  offStateChange(debuggerStateChangeCallback: DebuggerStateChangeCallback): void;

  onStateChange(debuggerStateChangeCallback: DebuggerStateChangeCallback): void;

  setIsEnabled(isEnabled: boolean): void;

  setState(debuggerState: DebuggerState): void;

  updateState(loggerBreadcrumbs: LoggerBreadcrumbs, debuggerStateValue: DebuggerStateValue): void;
}
