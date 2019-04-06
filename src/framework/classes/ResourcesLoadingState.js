// @flow

import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../interfaces/ResourcesLoadingState";

export default class ResourcesLoadingState
  implements ResourcesLoadingStateInterface {
  +itemsLoaded: number;
  +itemsTotal: number;

  constructor(itemsLoaded: number = 0, itemsTotal: number = 0) {
    if (itemsLoaded > itemsTotal) {
      throw new Error(
        "Invalid resources loading state. There are more loaded items than total items."
      );
    }

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

  isLoading(): boolean {
    return this.getItemsLoaded() < this.getItemsTotal();
  }

  setProgress(
    itemsLoaded: number,
    itemsTotal: number
  ): ResourcesLoadingStateInterface {
    return new ResourcesLoadingState(itemsLoaded, itemsTotal);
  }
}
