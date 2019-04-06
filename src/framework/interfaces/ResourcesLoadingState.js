// @flow

import { Equatable } from "./Equatable";

export interface ResourcesLoadingState
  extends Equatable<ResourcesLoadingState> {
  isFailed(): boolean;

  isLoading(): boolean;

  getItemsLoaded(): number;

  getItemsTotal(): number;

  getProgressPercentage(): number;

  setError(error: Error): ResourcesLoadingState;

  setProgress(itemsLoaded: number, itemsTotal: number): ResourcesLoadingState;
}
