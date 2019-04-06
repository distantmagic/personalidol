// @flow

import { Equatable } from "./Equatable";

export interface ResourcesLoadingState
  extends Equatable<ResourcesLoadingState> {
  isLoading(): boolean;

  getItemsLoaded(): number;

  getItemsTotal(): number;

  getProgressPercentage(): number;

  setProgress(itemsLoaded: number, itemsTotal: number): ResourcesLoadingState;
}
