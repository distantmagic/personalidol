import { MathUtils } from "three/src/math/MathUtils";

import type { ProgressManager as IProgressManager } from "./ProgressManager.interface";
import type { ProgressManagerComment } from "./ProgressManagerComment.type";
import type { ProgressManagerItem } from "./ProgressManagerItem.type";
import type { ProgressManagerState } from "./ProgressManagerState.type";

function _isLoaded(itemsLoaded: Set<ProgressManagerItem>, itemToCheck: ProgressManagerItem): boolean {
  for (let item of itemsLoaded) {
    if (item.id === itemToCheck.id) {
      return true;
    }
  }

  return false;
}

function _createProgressComment(itemsLoaded: Set<ProgressManagerItem>, itemsToLoad: Set<ProgressManagerItem>): Array<ProgressManagerComment> {
  const resources: {
    [key: string]: Array<string>;
  } = {};
  let comments: Array<ProgressManagerComment> = [];

  for (let item of itemsToLoad) {
    if (!_isLoaded(itemsLoaded, item)) {
      if (!resources.hasOwnProperty(item.resourceType)) {
        resources[item.resourceType] = [];
      }

      resources[item.resourceType].push(item.resourceUri);
    }
  }

  const resourceTypes = Object.keys(resources).sort();

  for (let resourceType of resourceTypes) {
    comments.push(<ProgressManagerComment>{
      resourceType: resourceType,
      resourceQuantity: resources[resourceType].length,
    });
  }

  return comments;
}

function _sumWeights(items: Set<ProgressManagerItem>): number {
  let _sum = 0;

  for (let item of items) {
    _sum += item.weight;
  }

  return _sum;
}

export function ProgressManager(): IProgressManager {
  const state: ProgressManagerState = Object.seal({
    comment: [],
    expectsAtLeast: 0,
    needsUpdates: true,
    progress: 0,
    version: 0,
  });

  const _itemsLoaded: Set<ProgressManagerItem> = new Set();
  const _itemsToLoad: Set<ProgressManagerItem> = new Set();
  let _startProgress: boolean = false;

  function done(item: ProgressManagerItem) {
    _itemsLoaded.add(item);
  }

  function expectAtLeast(expectAtLeast: number) {
    state.expectsAtLeast = expectAtLeast;
    _startProgress = true;
    update();
  }

  function update() {
    const itemsToLoadWeights = _sumWeights(_itemsToLoad);
    const totalWeights = Math.max(state.expectsAtLeast, itemsToLoadWeights);

    if (totalWeights < 1) {
      return;
    }

    const itemsLoadedWeights = _sumWeights(_itemsLoaded);

    if (itemsLoadedWeights > itemsToLoadWeights) {
      throw new Error("There are more items loaded than items that are pending to load.");
    }

    state.comment = _createProgressComment(_itemsLoaded, _itemsToLoad);

    if (_startProgress) {
      state.progress = Math.max(state.progress, itemsLoadedWeights / totalWeights);
    }

    state.version += 1;
  }

  function reset() {
    _itemsLoaded.clear();
    _itemsToLoad.clear();
    _startProgress = false;
    state.comment = [];
    state.expectsAtLeast = 0;
    state.progress = 0;
    state.version += 1;
  }

  function start() {}

  function stop() {}

  function waitFor(item: ProgressManagerItem) {
    _itemsToLoad.add(item);
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "ProgressManager",
    state: state,

    done: done,
    expectAtLeast: expectAtLeast,
    reset: reset,
    start: start,
    stop: stop,
    update: update,
    waitFor: waitFor,
  });
}
