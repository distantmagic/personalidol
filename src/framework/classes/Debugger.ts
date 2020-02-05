import EventListenerSet from "src/framework/classes/EventListenerSet";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IDebugger } from "src/framework/interfaces/Debugger";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";

import DebuggerState from "src/framework/types/DebuggerState";
import DebuggerStateChangeCallback from "src/framework/types/DebuggerStateChangeCallback";
import DebuggerStateValue from "src/framework/types/DebuggerStateValue";

export default class Debugger implements IDebugger {
  readonly callbacks: IEventListenerSet<[DebuggerState]>;
  private _isEnabled: boolean = false;
  private state: DebuggerState;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, state: DebuggerState = new Map<LoggerBreadcrumbs, DebuggerStateValue>()) {
    this.callbacks = new EventListenerSet<[DebuggerState]>(loggerBreadcrumbs);
    this.state = state;
  }

  deleteState(loggerBreadcrumbs: LoggerBreadcrumbs): void {
    this.getState().delete(loggerBreadcrumbs);
  }

  getState(): DebuggerState {
    return this.state;
  }

  isEnabled(): boolean {
    return this._isEnabled;
  }

  offStateChange(callback: DebuggerStateChangeCallback): void {
    this.callbacks.delete(callback);
  }

  onStateChange(callback: DebuggerStateChangeCallback): void {
    this.callbacks.add(callback);
  }

  setIsEnabled(isEnabled: boolean): void {
    this._isEnabled = isEnabled;
  }

  setState(state: DebuggerState): void {
    this.state = state;

    if (this.isEnabled()) {
      this.callbacks.notify([state]);
    }
  }

  updateState(loggerBreadcrumbs: LoggerBreadcrumbs, value: DebuggerStateValue): void {
    const state = this.getState();

    return this.setState(state.set(loggerBreadcrumbs, value));
  }
}
