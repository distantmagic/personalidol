// @flow

import autoBind from "auto-bind";

import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { SceneLoader as SceneLoaderInterface } from "../interfaces/SceneLoader";
import type { SceneManager } from "../interfaces/SceneManager";
import type { THREELoadingManager } from "../interfaces/THREELoadingManager";

export default class SceneLoader implements SceneLoaderInterface {
  +exceptionHandler: ExceptionHandler;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +sceneManager: SceneManager;
  +threeLoadingManager: THREELoadingManager;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    exceptionHandler: ExceptionHandler,
    sceneManager: SceneManager,
    threeLoadingManager: THREELoadingManager
  ) {
    autoBind(this);

    this.exceptionHandler = exceptionHandler;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.sceneManager = sceneManager;
    this.threeLoadingManager = threeLoadingManager;
  }

  disconnect(): void {
    const threeLoadingManager = this.getTHREELoadingManager();

    threeLoadingManager.offError(this.onError);
    threeLoadingManager.offLoad(this.onLoad);
    threeLoadingManager.offProgress(this.onProgress);
    // threeLoadingManager.offResourcesLoadingStateChange(this.setLoadingState);
    threeLoadingManager.offStart(this.onStart);
  }

  getSceneManager(): SceneManager {
    return this.sceneManager;
  }

  getTHREELoadingManager(): THREELoadingManager {
    return this.threeLoadingManager;
  }

  observe(): void {
    const threeLoadingManager = this.getTHREELoadingManager();

    this.getSceneManager().start();

    threeLoadingManager.onError(this.onError);
    threeLoadingManager.onLoad(this.onLoad);
    threeLoadingManager.onProgress(this.onProgress);
    // threeLoadingManager.onResourcesLoadingStateChange(this.setLoadingState);
    threeLoadingManager.onStart(this.onStart);
  }

  onError(url: string): void {
    this.getSceneManager()
      .stop()
      .catch(this.exceptionHandler.expectException(this.loggerBreadcrumbs.add("threeLoadingManager.onError")));
  }

  onLoad(): void {
    this.getSceneManager()
      .start()
      .catch(this.exceptionHandler.expectException(this.loggerBreadcrumbs.add("threeLoadingManager.onLoad")));
  }

  onProgress(url: string, itemsLoaded: number, itemsTotal: number): void {
    this.getSceneManager()
      .stop()
      .catch(this.exceptionHandler.expectException(this.loggerBreadcrumbs.add("threeLoadingManager.onProgress")));
  }

  onStart(url: string, itemsLoaded: number, itemsTotal: number): void {
    this.getSceneManager()
      .stop()
      .catch(this.exceptionHandler.expectException(this.loggerBreadcrumbs.add("threeLoadingManager.onStart")));
  }
}
