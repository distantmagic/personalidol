// @flow

import * as THREE from "three";

import ResourceLoadError from "./Exception/ResourceLoadError";
import ResourcesLoadingState from "./ResourcesLoadingState";

import type {
  LoadingManagerOnErrorCallback,
  LoadingManagerOnLoadCallback,
  LoadingManagerOnProgressCallback,
  LoadingManagerOnStartCallback,
} from "three";

import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { THREELoadingManager as THREELoadingManagerInterface } from "../interfaces/THREELoadingManager";
import type { THREELoadingManagerResourcesLoadingStateChangeCallback } from "../types/THREELoadingManagerResourcesLoadingStateChangeCallback";

export default class THREELoadingManager implements THREELoadingManagerInterface {
  +errorCallbacks: Set<LoadingManagerOnErrorCallback>;
  +exceptionHandler: ExceptionHandler;
  +loadCallbacks: Set<LoadingManagerOnLoadCallback>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +progressCallbacks: Set<LoadingManagerOnProgressCallback>;
  +resourcesLoadingStateChangeCallbacks: Set<THREELoadingManagerResourcesLoadingStateChangeCallback>;
  +startCallbacks: Set<LoadingManagerOnStartCallback>;
  +threeLoadingManager: THREE.LoadingManager;
  itemsLoaded: number;
  itemsTotal: number;
  resourcesLoadError: ?ResourceLoadError;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, exceptionHandler: ExceptionHandler) {
    this.errorCallbacks = new Set<LoadingManagerOnErrorCallback>();
    this.exceptionHandler = exceptionHandler;
    this.itemsLoaded = 0;
    this.itemsTotal = 0;
    this.loadCallbacks = new Set<LoadingManagerOnLoadCallback>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.progressCallbacks = new Set<LoadingManagerOnProgressCallback>();
    this.resourcesLoadingStateChangeCallbacks = new Set<THREELoadingManagerResourcesLoadingStateChangeCallback>();
    this.startCallbacks = new Set<LoadingManagerOnStartCallback>();
    this.threeLoadingManager = new THREE.LoadingManager();

    const notifyResourcesLoadingStateChange = () => {
      const event = new ResourcesLoadingState(this.itemsLoaded, this.itemsTotal, this.resourcesLoadError);

      for (let callback of this.resourcesLoadingStateChangeCallbacks.values()) {
        callback(event);
      }
    };

    this.threeLoadingManager.onError = (url: string): void => {
      const breadcrumbs = loggerBreadcrumbs.add("threeLoadingManager.onError");
      const error = new ResourceLoadError(breadcrumbs, url);

      exceptionHandler.captureException(breadcrumbs, error);

      this.resourcesLoadError = error;

      notifyResourcesLoadingStateChange();
      for (let callback of this.errorCallbacks.values()) {
        callback(url);
      }
    };
    this.threeLoadingManager.onLoad = (): void => {
      for (let callback of this.loadCallbacks.values()) {
        callback();
      }
    };
    this.threeLoadingManager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number): void => {
      this.itemsLoaded = itemsLoaded;
      this.itemsTotal = itemsTotal;

      notifyResourcesLoadingStateChange();
      for (let callback of this.progressCallbacks.values()) {
        callback(url, itemsLoaded, itemsTotal);
      }
    };
    this.threeLoadingManager.onStart = (url: string, itemsLoaded: number, itemsTotal: number): void => {
      this.itemsLoaded = itemsLoaded;
      this.itemsTotal = itemsTotal;

      notifyResourcesLoadingStateChange();
      for (let callback of this.startCallbacks.values()) {
        callback(url, itemsLoaded, itemsTotal);
      }
    };
  }

  getLoadingManager(): THREE.LoadingManager {
    return this.threeLoadingManager;
  }

  offError(callback: LoadingManagerOnErrorCallback): void {
    this.errorCallbacks.delete(callback);
  }

  offLoad(callback: LoadingManagerOnLoadCallback): void {
    this.loadCallbacks.delete(callback);
  }

  offProgress(callback: LoadingManagerOnProgressCallback): void {
    this.progressCallbacks.delete(callback);
  }

  offResourcesLoadingStateChange(callback: THREELoadingManagerResourcesLoadingStateChangeCallback): void {
    this.resourcesLoadingStateChangeCallbacks.delete(callback);
  }

  offStart(callback: LoadingManagerOnStartCallback): void {
    this.startCallbacks.delete(callback);
  }

  onError(callback: LoadingManagerOnErrorCallback): void {
    this.errorCallbacks.add(callback);
  }

  onLoad(callback: LoadingManagerOnLoadCallback): void {
    this.loadCallbacks.add(callback);
  }

  onProgress(callback: LoadingManagerOnProgressCallback): void {
    this.progressCallbacks.add(callback);
  }

  onResourcesLoadingStateChange(callback: THREELoadingManagerResourcesLoadingStateChangeCallback): void {
    this.resourcesLoadingStateChangeCallbacks.add(callback);
  }

  onStart(callback: LoadingManagerOnStartCallback): void {
    this.startCallbacks.add(callback);
  }
}
