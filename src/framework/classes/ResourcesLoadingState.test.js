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

it("throws when arguments make no sense", () => {
  expect(function() {
    new ResourcesLoadingState(10, 2);
  }).toThrow();
});
