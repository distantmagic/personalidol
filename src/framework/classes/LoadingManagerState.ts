import { LoadingManagerState as LoadingManagerStateInterface } from "../interfaces/LoadingManagerState";

export default class LoadingManagerState implements LoadingManagerStateInterface {
  readonly comments: ReadonlyArray<string>;
  readonly totalBackgroundLoading: number;
  readonly totalBlockingLoading: number;
  readonly totalFailed: number;

  constructor(totalBackgroundLoading: number, totalBlockingLoading: number, totalFailed: number, comments: ReadonlyArray<string>) {
    this.comments = comments;
    this.totalBackgroundLoading = totalBackgroundLoading;
    this.totalBlockingLoading = totalBlockingLoading;
    this.totalFailed = totalFailed;
  }

  getComments(): ReadonlyArray<string> {
    return this.comments;
  }

  getTotalFailed(): number {
    return this.totalFailed;
  }

  getTotalLoading(): number {
    return this.totalBackgroundLoading + this.totalBlockingLoading;
  }

  isBackgroundLoading(): boolean {
    return this.totalBackgroundLoading > 0;
  }

  isFailed(): boolean {
    return this.getTotalFailed() > 0;
  }

  isBlocking(): boolean {
    return this.totalBlockingLoading > 0;
  }

  isLoading(): boolean {
    return this.isBackgroundLoading() || this.isBlocking();
  }
}
