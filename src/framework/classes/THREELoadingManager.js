// @flow

import * as THREE from "three";

import EventListenerSet from "./EventListenerSet";
import ResourceLoadError from "./Exception/ResourceLoadError";
import ResourcesLoadingState from "./ResourcesLoadingState";

import type {
  LoadingManagerOnErrorCallback,
  LoadingManagerOnLoadCallback,
  LoadingManagerOnProgressCallback,
  LoadingManagerOnStartCallback,
} from "three";

import type { EventListenerSet as EventListenerSetInterface } from "../interfaces/EventListenerSet";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../interfaces/ResourcesLoadingState";
import type { ResourcesLoadingStateChangeCallback } from "../types/ResourcesLoadingStateChangeCallback";
import type { THREELoadingManager as THREELoadingManagerInterface } from "../interfaces/THREELoadingManager";

export default class THREELoadingManager implements THREELoadingManagerInterface {
  +errorCallbacks: EventListenerSetInterface<[string]>;
  +exceptionHandler: ExceptionHandler;
  +loadCallbacks: EventListenerSetInterface<[]>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +progressCallbacks: EventListenerSetInterface<[string, number, number]>;
  +resourcesLoadingStateChangeCallbacks: EventListenerSetInterface<[ResourcesLoadingStateInterface]>;
  +startCallbacks: EventListenerSetInterface<[string, number, number]>;
  +threeLoadingManager: THREE.LoadingManager;
  itemsLoaded: number;
  itemsTotal: number;
  resourcesLoadError: ?ResourceLoadError;
  resourcesLoadingState: ResourcesLoadingStateInterface;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, exceptionHandler: ExceptionHandler) {
    this.errorCallbacks = new EventListenerSet<[string]>();
    this.exceptionHandler = exceptionHandler;
    this.itemsLoaded = 0;
    this.itemsTotal = 0;
    this.loadCallbacks = new EventListenerSet<[]>();
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.progressCallbacks = new EventListenerSet<[string, number, number]>();
    this.resourcesLoadingState = new ResourcesLoadingState();
    this.resourcesLoadingStateChangeCallbacks = new EventListenerSet<[ResourcesLoadingStateInterface]>();
    this.startCallbacks = new EventListenerSet<[string, number, number]>();
    this.threeLoadingManager = new THREE.LoadingManager();

    const notifyResourcesLoadingStateChange = () => {
      const resourcesLoadingState = new ResourcesLoadingState(
        this.itemsLoaded,
        this.itemsTotal,
        this.resourcesLoadError
      );

      this.resourcesLoadingState = resourcesLoadingState;
      this.resourcesLoadingStateChangeCallbacks.notify([resourcesLoadingState]);
    };

    this.threeLoadingManager.onError = (url: string): void => {
      const breadcrumbs = loggerBreadcrumbs.add("threeLoadingManager.onError");
      const error = new ResourceLoadError(breadcrumbs, url);

      exceptionHandler.captureException(breadcrumbs, error);

      this.resourcesLoadError = error;

      notifyResourcesLoadingStateChange();
      this.errorCallbacks.notify([url]);
    };
    this.threeLoadingManager.onLoad = (): void => {
      this.loadCallbacks.notify([]);
    };
    this.threeLoadingManager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number): void => {
      this.itemsLoaded = itemsLoaded;
      this.itemsTotal = itemsTotal;

      notifyResourcesLoadingStateChange();
      this.progressCallbacks.notify([url, itemsLoaded, itemsTotal]);
    };
    this.threeLoadingManager.onStart = (url: string, itemsLoaded: number, itemsTotal: number): void => {
      this.itemsLoaded = itemsLoaded;
      this.itemsTotal = itemsTotal;

      notifyResourcesLoadingStateChange();
      this.startCallbacks.notify([url, itemsLoaded, itemsTotal]);
    };
  }

  getLoadingManager(): THREE.LoadingManager {
    return this.threeLoadingManager;
  }

  getResourcesLoadingState(): ResourcesLoadingStateInterface {
    return this.resourcesLoadingState;
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

  offResourcesLoadingStateChange(callback: ResourcesLoadingStateChangeCallback): void {
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

  onResourcesLoadingStateChange(callback: ResourcesLoadingStateChangeCallback): void {
    this.resourcesLoadingStateChangeCallbacks.add(callback);
  }

  onStart(callback: LoadingManagerOnStartCallback): void {
    this.startCallbacks.add(callback);
  }
}
