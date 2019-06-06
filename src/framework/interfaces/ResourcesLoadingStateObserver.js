// @flow

import type { ResourcesLoadingState } from "./ResourcesLoadingState";
import type { ResourcesLoadingStateChangeCallback } from "../types/ResourcesLoadingStateChangeCallback";

export interface ResourcesLoadingStateObserver {
  getResourcesLoadingState(): ResourcesLoadingState;

  offResourcesLoadingStateChange(ResourcesLoadingStateChangeCallback): void;

  onResourcesLoadingStateChange(ResourcesLoadingStateChangeCallback): void;
}
