// @flow

import type {
  LoadingManager,
  LoadingManagerOnErrorCallback,
  LoadingManagerOnLoadCallback,
  LoadingManagerOnProgressCallback,
  LoadingManagerOnStartCallback
} from "three";

import type { THREELoadingManagerResourcesLoadingStateChangeCallback } from "../types/THREELoadingManagerResourcesLoadingStateChangeCallback";

export interface THREELoadingManager {
  getLoadingManager(): LoadingManager;

  offError(LoadingManagerOnErrorCallback): void;

  offLoad(LoadingManagerOnLoadCallback): void;

  offProgress(LoadingManagerOnProgressCallback): void;

  offResourcesLoadingStateChange(
    THREELoadingManagerResourcesLoadingStateChangeCallback
  ): void;

  offStart(LoadingManagerOnStartCallback): void;

  onError(LoadingManagerOnErrorCallback): void;

  onLoad(LoadingManagerOnLoadCallback): void;

  onProgress(LoadingManagerOnProgressCallback): void;

  onResourcesLoadingStateChange(
    THREELoadingManagerResourcesLoadingStateChangeCallback
  ): void;

  onStart(LoadingManagerOnStartCallback): void;
}
