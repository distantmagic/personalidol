// @flow

import type {
  LoadingManager,
  LoadingManagerOnErrorCallback,
  LoadingManagerOnLoadCallback,
  LoadingManagerOnProgressCallback,
  LoadingManagerOnStartCallback,
} from "three";

import type { ResourcesLoadingStateObserver } from "./ResourcesLoadingStateObserver";

export interface THREELoadingManager extends ResourcesLoadingStateObserver {
  getLoadingManager(): LoadingManager;

  offError(LoadingManagerOnErrorCallback): void;

  offLoad(LoadingManagerOnLoadCallback): void;

  offProgress(LoadingManagerOnProgressCallback): void;

  offStart(LoadingManagerOnStartCallback): void;

  onError(LoadingManagerOnErrorCallback): void;

  onLoad(LoadingManagerOnLoadCallback): void;

  onProgress(LoadingManagerOnProgressCallback): void;

  onStart(LoadingManagerOnStartCallback): void;
}
