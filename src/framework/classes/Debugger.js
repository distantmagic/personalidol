// @flow

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
  state: DebuggerState;

  constructor(state: DebuggerState = Map<LoggerBreadcrumbs, DebuggerStateValue>()) {
    this.callbacks = new EventListenerSet<[DebuggerState]>();
    this.state = state;
  }

  deleteState(loggerBreadcrumbs: LoggerBreadcrumbs): void {
    const state = this.getState();

    return this.setState(state.delete(loggerBreadcrumbs));
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

    this.callbacks.notify([state]);
  }

  updateState(loggerBreadcrumbs: LoggerBreadcrumbs, value: DebuggerStateValue): void {
    const state = this.getState();

    return this.setState(state.set(loggerBreadcrumbs, value));
  }
}
