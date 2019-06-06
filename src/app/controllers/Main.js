// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasController } from "../../framework/interfaces/CanvasController";
import type { Debugger } from "../../framework/interfaces/Debugger";
import type { ElementSize } from "../../framework/interfaces/ElementSize";
import type { ExceptionHandler } from "../../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { PointerState } from "../../framework/interfaces/PointerState";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";

export default class Main implements CanvasController {
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(
    exceptionHandler: ExceptionHandler,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    threeLoadingManager: THREELoadingManager,
    keyboardState: KeyboardState,
    pointerState: PointerState,
    queryBus: QueryBus,
    debug: Debugger
  ) {
    autoBind(this);

    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    console.log("attach main controller");
  }

  begin(): void {}

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {}

  draw(renderer: THREE.WebGLRenderer, interpolationPercentage: number): void {}

  end(fps: number, isPanicked: boolean): void {
    this.debug.updateState(this.loggerBreadcrumbs.add("end").add("fps"), fps);
  }

  resize(elementSize: ElementSize<"px">): void {}

  async start(): Promise<void> {}

  async stop(): Promise<void> {}

  update(delta: number): void {}
}
