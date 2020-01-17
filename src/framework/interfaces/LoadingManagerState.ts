export default interface LoadingManagerState {
  getComments(): ReadonlyArray<string>;

  getTotalFailed(): number;

  getTotalLoading(): number;

  isBackgroundLoading(): boolean;

  isBlocking(): boolean;

  isFailed(): boolean;

  isLoading(): boolean;
}
