// @flow

import type { Observer } from "./Observer";
import type { SceneManager } from "./SceneManager";
import type { THREELoadingManager } from "./THREELoadingManager";

export interface SceneLoader extends Observer {
  getSceneManager(): SceneManager;

  getTHREELoadingManager(): THREELoadingManager;
}
