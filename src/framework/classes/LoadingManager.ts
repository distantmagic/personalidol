import filter from "lodash/filter";

import ExceptionHandler from "src/framework/interfaces/ExceptionHandler";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ILoadingManager } from "src/framework/interfaces/LoadingManager";

async function awaitBlocker<T>(self: LoadingManager, collection: Map<Promise<any>, string>, blocker: Promise<T>, comment: string): Promise<T> {
  collection.set(blocker, comment);

  try {
    self.totalEnqueued += 1;

    const ret = await blocker;

    self.totalLoaded += 1;

    return ret;
  } catch (err) {
    self.failedItems.set(blocker, comment);
    await self.exceptionHandler.captureException(self.loggerBreadcrumbs.add("background"), err);
    throw err;
  } finally {
    collection.delete(blocker);

    if (!self.isLoading()) {
      self.totalEnqueued = 0;
      self.totalLoaded = 0;
    }
  }
}

export default class LoadingManager implements HasLoggerBreadcrumbs, ILoadingManager {
  readonly backgroundItems: Map<Promise<any>, string> = new Map<Promise<any>, string>();
  readonly blockingItems: Map<Promise<any>, string> = new Map<Promise<any>, string>();
  readonly exceptionHandler: ExceptionHandler;
  readonly failedItems: Map<Promise<any>, string> = new Map<Promise<any>, string>();
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  totalEnqueued: number = 0;
  totalLoaded: number = 0;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, exceptionHandler: ExceptionHandler) {
    this.exceptionHandler = exceptionHandler;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  background<T>(blocker: Promise<T>, comment: string = ""): Promise<T> {
    return awaitBlocker<T>(this, this.backgroundItems, blocker, comment);
  }

  async blocking<T>(blocker: Promise<T>, comment: string = ""): Promise<T> {
    return awaitBlocker<T>(this, this.blockingItems, blocker, comment);
  }

  getComments(): ReadonlyArray<string> {
    const blocking = Array.from(this.blockingItems.values());
    const background = Array.from(this.backgroundItems.values());

    return filter(blocking).concat(filter(background));
  }

  getProgress(): number {
    if (!this.isLoading()) {
      return 1;
    }

    return this.getTotalLoaded() / this.getTotalEnqueued();
  }

  getTotalEnqueued(): number {
    return this.totalEnqueued;
  }

  getTotalFailed(): number {
    return this.failedItems.size;
  }

  getTotalLoaded(): number {
    return this.totalLoaded;
  }

  getTotalLoading(): number {
    return this.blockingItems.size + this.backgroundItems.size;
  }

  isBackgroundLoading(): boolean {
    return this.backgroundItems.size > 0;
  }

  isBlocking(): boolean {
    return this.blockingItems.size > 0;
  }

  isFailed(): boolean {
    return this.failedItems.size > 0;
  }

  isLoading(): boolean {
    return this.isBackgroundLoading() || this.isBlocking();
  }
}
