import filter from "lodash/filter";

import EventListenerSet from "src/framework/classes/EventListenerSet";
import LoadingManagerState from "src/framework/classes/LoadingManagerState";

import ExceptionHandler from "src/framework/interfaces/ExceptionHandler";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IEventListenerSet } from "src/framework/interfaces/EventListenerSet";
import { default as ILoadingManager } from "src/framework/interfaces/LoadingManager";
import { default as ILoadingManagerState } from "src/framework/interfaces/LoadingManagerState";

import LoadingManagerStateChangeCallback from "src/framework/types/LoadingManagerStateChangeCallback";

export default class LoadingManager implements ILoadingManager {
  readonly backgroundItems: Map<Promise<any>, string>;
  readonly blockingItems: Map<Promise<any>, string>;
  readonly callbacks: IEventListenerSet<[ILoadingManagerState]>;
  readonly exceptionHandler: ExceptionHandler;
  readonly failedItems: Map<Promise<any>, string>;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, exceptionHandler: ExceptionHandler) {
    this.backgroundItems = new Map<Promise<any>, string>();
    this.blockingItems = new Map<Promise<any>, string>();
    this.callbacks = new EventListenerSet<[ILoadingManagerState]>(loggerBreadcrumbs.add("EventListenerSet"));
    this.exceptionHandler = exceptionHandler;
    this.failedItems = new Map<Promise<any>, string>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  async background<T>(blocker: Promise<T>, comment: string = ""): Promise<T> {
    this.backgroundItems.set(blocker, comment);
    this.callbacks.notify([this.getState()]);

    try {
      return await blocker;
    } catch (err) {
      this.failedItems.set(blocker, comment);
      await this.exceptionHandler.captureException(this.loggerBreadcrumbs.add("background"), err);
      throw err;
    } finally {
      this.backgroundItems.delete(blocker);
      this.callbacks.notify([this.getState()]);
    }
  }

  async blocking<T>(blocker: Promise<T>, comment: string = ""): Promise<T> {
    this.blockingItems.set(blocker, comment);
    this.callbacks.notify([this.getState()]);

    try {
      return await blocker;
    } catch (err) {
      this.failedItems.set(blocker, comment);
      await this.exceptionHandler.captureException(this.loggerBreadcrumbs.add("blocking"), err);
      throw err;
    } finally {
      this.blockingItems.delete(blocker);
      this.callbacks.notify([this.getState()]);
    }
  }

  getState(): ILoadingManagerState {
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
