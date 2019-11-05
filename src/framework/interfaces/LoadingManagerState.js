// @flow

export interface LoadingManagerState {
  getComments(): $ReadOnlyArray<string>;

  getTotalFailed(): number;

  getTotalLoading(): number;

  isBackgroundLoading(): boolean;

  isBlocking(): boolean;

  isFailed(): boolean;

  isLoading(): boolean;
}
