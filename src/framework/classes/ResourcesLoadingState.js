// @flow

import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../interfaces/ResourcesLoadingState";

export default class ResourcesLoadingState
  implements ResourcesLoadingStateInterface {
  +error: ?Error;
  +itemsLoaded: number;
  +itemsTotal: number;

  constructor(itemsLoaded: number = 0, itemsTotal: number = 0, error: ?Error) {
    if (itemsLoaded > itemsTotal) {
      throw new Error(
        "Invalid resources loading state. There are more loaded items than total items."
      );
    }

    this.error = error;
    this.itemsLoaded = itemsLoaded;
    this.itemsTotal = itemsTotal;
  }

  getItemsLoaded(): number {
    return this.itemsLoaded;
  }

  getItemsTotal(): number {
    return this.itemsTotal;
  }

  getProgressPercentage(): number {
    const total = this.getItemsTotal();

    if (0 === total) {
      return 100;
    }

    return Math.round((this.getItemsLoaded() / total) * 100);
  }

  isEqual(other: ResourcesLoadingStateInterface): boolean {
    return (
      this.getItemsLoaded() === other.getItemsLoaded() &&
      this.getItemsTotal() === other.getItemsTotal()
    );
  }

  isFailed(): boolean {
    return !!this.error;
  }

  isLoading(): boolean {
    return !this.isFailed() && this.getItemsLoaded() < this.getItemsTotal();
  }

  setError(error: Error): ResourcesLoadingStateInterface {
    return new ResourcesLoadingState(
      this.getItemsLoaded(),
      this.getItemsTotal(),
      error
    );
  }

  setProgress(
    itemsLoaded: number,
    itemsTotal: number
  ): ResourcesLoadingStateInterface {
    const updated = new ResourcesLoadingState(
      itemsLoaded,
      itemsTotal,
      this.error
    );

    if (this.isEqual(updated)) {
      return this;
    }

    return updated;
  }
}
