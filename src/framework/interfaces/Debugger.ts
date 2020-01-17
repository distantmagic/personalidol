import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import DebuggerState from "src/framework/types/DebuggerState";
import DebuggerStateChangeCallback from "src/framework/types/DebuggerStateChangeCallback";
import DebuggerStateValue from "src/framework/types/DebuggerStateValue";

export default interface Debugger {
  deleteState(loggerBreadcrumbs: LoggerBreadcrumbs): void;

  getState(): DebuggerState;

  isEnabled(): boolean;

  offStateChange(debuggerStateChangeCallback: DebuggerStateChangeCallback): void;

  onStateChange(debuggerStateChangeCallback: DebuggerStateChangeCallback): void;

  setIsEnabled(isEnabled: boolean): void;

  setState(debuggerState: DebuggerState): void;

  updateState(loggerBreadcrumbs: LoggerBreadcrumbs, debuggerStateValue: DebuggerStateValue): void;
}
