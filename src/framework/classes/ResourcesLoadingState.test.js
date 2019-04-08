// @flow

import ResourcesLoadingState from "./ResourcesLoadingState";

it("is not loading by default", () => {
  const resourcesLoadingState = new ResourcesLoadingState();

  expect(resourcesLoadingState.isLoading()).toBe(false);
});

it("has 100% by default", () => {
  const state = new ResourcesLoadingState();

  expect(state.getProgressPercentage()).toBe(100);
});

it("has adequate progress percentage", () => {
  const state = new ResourcesLoadingState(2, 10);

  expect(state.getProgressPercentage()).toBe(20);
});

it("can fail", () => {
  const state1 = new ResourcesLoadingState(1, 10);

  expect(state1.isFailed()).toBe(false);
  expect(state1.isLoading()).toBe(true);

  const state2 = state1.setError(new Error(":("));

  expect(state2.isFailed()).toBe(true);
  expect(state2.isLoading()).toBe(false);
  expect(state2.getItemsLoaded()).toBe(1);
  expect(state2.getItemsTotal()).toBe(10);
});

it("propagates failure", () => {
  const state1 = new ResourcesLoadingState(1, 10);

  expect(state1.isFailed()).toBe(false);

  const state2 = state1.setError(new Error(":("));

  expect(state2.isFailed()).toBe(true);

  const state3 = state2.setProgress(2, 10);

  expect(state3.isLoading()).toBe(false);
  expect(state3.isFailed()).toBe(true);
  expect(state3.getItemsLoaded()).toBe(2);
  expect(state3.getItemsTotal()).toBe(10);
});

it("is equatable", () => {
  const state1 = new ResourcesLoadingState();
  const state2 = state1.setProgress(2, 10);
  const state3 = state1.setProgress(4, 20);
  const state4 = state1.setProgress(4, 20);

  expect(state1.isEqual(state2)).toBe(false);
  expect(state2.isEqual(state2)).toBe(true);
  expect(state2.isEqual(state3)).toBe(false);
  expect(state3.isEqual(state4)).toBe(true);
});

it("is loading when there are items left", () => {
  const state = new ResourcesLoadingState(2, 10);

  expect(state.isLoading()).toBe(true);
});

it("is immutable", () => {
  const state1 = new ResourcesLoadingState();
  const state2 = state1.setProgress(2, 10);

  expect(state1).not.toBe(state2);
});

it("is immutable and preserves objects", () => {
  const state1 = new ResourcesLoadingState(2, 10);
  const state2 = state1.setProgress(2, 10);

  expect(state1).toBe(state2);
});

it("throws when arguments make no sense", () => {
  expect(function() {
    new ResourcesLoadingState(10, 2);
  }).toThrow();
});
