// @flow

import type { CancelToken } from "./CancelToken";
import type { CanvasController } from "./CanvasController";
import type { ExceptionHandler } from "./ExceptionHandler";
import type { ExpressionBus } from "./ExpressionBus";
import type { ExpressionContext } from "./ExpressionContext";
import type { FPSController } from "./FPSController";
import type { KeyboardState } from "./KeyboardState";
import type { MainLoop } from "./MainLoop";
import type { PointerState } from "./PointerState";
import type { QueryBus } from "./QueryBus";
import type { ResourcesLoadingState } from "./ResourcesLoadingState";
import type { SceneManager } from "./SceneManager";
import type { SceneManagerChangeCallback } from "../types/SceneManagerChangeCallback";
import type { Scheduler } from "./Scheduler";
import type { THREELoadingManager } from "./THREELoadingManager";

export interface Game extends FPSController {
  getExceptionHandler(): ExceptionHandler;

  getExpressionBus(): ExpressionBus;

  getExpressionContext(): ExpressionContext;

  getKeyboardState(): KeyboardState;

  getMainLoop(): MainLoop;

  getPointerState(): PointerState;

  getQueryBus(): QueryBus;

  getSceneManager(): SceneManager;

  getScheduler(): Scheduler;

  getTHREELoadingManager(): THREELoadingManager;

  hasSceneManager(): boolean;

  isHidden(): boolean;

  offSceneManagerChange(SceneManagerChangeCallback): void;

  onSceneManagerChange(SceneManagerChangeCallback): void;

  run(CancelToken): Promise<void>;

  setIsHidden(boolean): void;

  setPrimaryController(CanvasController): Promise<void>;
}
