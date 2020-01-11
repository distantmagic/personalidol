// @flow strict

import { Map } from "immutable";

import EventListenerSet from "./EventListenerSet";

import type { Debugger as DebuggerInterface } from "../interfaces/Debugger";
import type { DebuggerState } from "../types/DebuggerState";
import type { DebuggerStateChangeCallback } from "../types/DebuggerStateChangeCallback";
import type { DebuggerStateValue } from "../types/DebuggerStateValue";
import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class Debugger implements DebuggerInterface {
  +callbacks: EventListenerSetInterface<[DebuggerState]>;
  _isEnabled: boolean;
  state: DebuggerState;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, state: DebuggerState = Map<LoggerBreadcrumbs, DebuggerStateValue>()) {
    this._isEnabled = false;
    this.callbacks = new EventListenerSet<[DebuggerState]>(loggerBreadcrumbs);
    this.state = state;
  }

  deleteState(loggerBreadcrumbs: LoggerBreadcrumbs): void {
    const state = this.getState();

    return this.setState(state.delete(loggerBreadcrumbs));
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
    if (this.state === state) {
      return;
    }

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
