// @flow

import { Map } from "immutable";

import type { Debugger as DebuggerInterface } from "../interfaces/Debugger";
import type { DebuggerState } from "../types/DebuggerState";
import type { DebuggerStateChangeCallback } from "../types/DebuggerStateChangeCallback";
import type { DebuggerStateValue } from "../types/DebuggerStateValue";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class Debugger implements DebuggerInterface {
  +callbacks: Set<DebuggerStateChangeCallback>;
  state: DebuggerState;

  constructor(
    state: DebuggerState = Map<LoggerBreadcrumbs, DebuggerStateValue>()
  ) {
    this.callbacks = new Set();
    this.state = state;
  }

  getState(): DebuggerState {
    return this.state;
  }

  offStateChange(callback: DebuggerStateChangeCallback): void {
    this.callbacks.delete(callback);
  }

  onStateChange(callback: DebuggerStateChangeCallback): void {
    this.callbacks.add(callback);
  }

  setState(state: DebuggerState): void {
    if (this.state === state) {
      return;
    }

    this.state = state;
    for (let callback of this.callbacks.values()) {
      callback(state);
    }
  }

  updateState(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    value: DebuggerStateValue
  ): void {
    const state = this.getState();

    return this.setState(state.set(loggerBreadcrumbs, value));
  }
}
