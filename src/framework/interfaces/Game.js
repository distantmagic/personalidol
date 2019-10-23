// @flow

import type { CancelToken } from "./CancelToken";
import type { ExceptionHandler } from "./ExceptionHandler";
import type { FPSController } from "./FPSController";
import type { KeyboardState } from "./KeyboardState";
import type { MainLoop } from "./MainLoop";
import type { PointerState } from "./PointerState";
import type { QueryBus } from "./QueryBus";
import type { ResourcesLoadingState } from "./ResourcesLoadingState";
import type { SceneManager } from "./SceneManager";
import type { SceneManagerChangeCallback } from "../types/SceneManagerChangeCallback";

export interface Game extends FPSController {
  getMainLoop(): MainLoop;

  getSceneManager(): SceneManager;

  hasSceneManager(): boolean;

  offSceneManagerChange(SceneManagerChangeCallback): void;

  onSceneManagerChange(SceneManagerChangeCallback): void;

  run(CancelToken): Promise<void>;
  // setPrimaryController(CanvasController): Promise<void>;
}
