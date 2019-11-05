// @flow

import filter from "lodash/filter";

import EventListenerSet from "./EventListenerSet";
import LoadingManagerState from "./LoadingManagerState";

import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { LoadingManager as LoadingManagerInterface } from "../interfaces/LoadingManager";
import type { LoadingManagerState as LoadingManagerStateInterface } from "../interfaces/LoadingManagerState";
import type { LoadingManagerStateChangeCallback } from "../types/LoadingManagerStateChangeCallback";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class LoadingManager implements LoadingManagerInterface {
  #isLoading: boolean;
  +backgroundItems: Map<Promise<any>, string>;
  +blockingItems: Map<Promise<any>, string>;
  +callbacks: EventListenerSetInterface<[LoadingManagerStateInterface]>;
  +failedItems: Map<Promise<any>, string>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.backgroundItems = new Map<Promise<any>, string>();
    this.blockingItems = new Map<Promise<any>, string>();
    this.callbacks = new EventListenerSet<[LoadingManagerStateInterface]>();
    this.failedItems = new Map<Promise<any>, string>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  async background<T>(blocker: Promise<T>, comment?: string = ""): Promise<T> {
    this.backgroundItems.set(blocker, comment);
    this.callbacks.notify([this.getState()]);

    try {
      return await blocker;
    } catch (err) {
      this.failedItems.set(blocker, comment);
      throw err;
    } finally {
      this.backgroundItems.delete(blocker);
      this.callbacks.notify([this.getState()]);
    }
  }

  async blocking<T>(blocker: Promise<T>, comment?: string = ""): Promise<T> {
    this.blockingItems.set(blocker, comment);
    this.callbacks.notify([this.getState()]);

    try {
      return await blocker;
    } catch (err) {
      this.failedItems.set(blocker, comment);
      throw err;
    } finally {
      this.blockingItems.delete(blocker);
      this.callbacks.notify([this.getState()]);
    }
  }

  getState(): LoadingManagerStateInterface {
    return new LoadingManagerState(
      this.backgroundItems.size,
      this.blockingItems.size,
      this.failedItems.size,
      filter(Array.from(this.blockingItems.values()).concat(Array.from(this.backgroundItems.values())))
    );
  }

  onChange(callback: LoadingManagerStateChangeCallback): void {
    this.callbacks.add(callback);
  }

  offChange(callback: LoadingManagerStateChangeCallback): void {
    this.callbacks.delete(callback);
  }
}
