// @flow

import * as THREE from "three";
import autoBind from "auto-bind";

import CanvasViewGroup from "../../framework/classes/CanvasViewGroup";
import TilesView from "./TilesView";

import type { CancelToken } from "../../framework/interfaces/CancelToken";
import type { CanvasController } from "../../framework/interfaces/CanvasController";
import type { CanvasViewGroup as CanvasViewGroupInterface } from "../../framework/interfaces/CanvasViewGroup";
import type { Debugger } from "../../framework/interfaces/Debugger";
import type { ElementSize } from "../../framework/interfaces/ElementSize";
import type { ExceptionHandler } from "../../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../../framework/interfaces/LoggerBreadcrumbs";
import type { PointerState } from "../../framework/interfaces/PointerState";
import type { QueryBus } from "../../framework/interfaces/QueryBus";
import type { THREELoadingManager } from "../../framework/interfaces/THREELoadingManager";
import type { TilesView as TilesViewInterface } from "../interfaces/TilesView";

export default class MainController implements CanvasController {
  +canvasViewGroup: CanvasViewGroupInterface;
  +debug: Debugger;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tilesView: TilesViewInterface;

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

    this.canvasViewGroup = new CanvasViewGroup(loggerBreadcrumbs.add("CanvasViewGroup"));
    this.debug = debug;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tilesView = new TilesView(exceptionHandler, loggerBreadcrumbs.add("TilesView"), threeLoadingManager);

    this.canvasViewGroup.add(this.tilesView);
  }

  async attach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    await this.canvasViewGroup.attach(cancelToken, renderer);
    await this.tilesView.loadMap(cancelToken, {
      filename: "/assets/map-outlands-01.tmx",
    });
  }

  begin(): void {
    return this.canvasViewGroup.begin();
  }

  async detach(cancelToken: CancelToken, renderer: THREE.WebGLRenderer): Promise<void> {
    await this.canvasViewGroup.detach(cancelToken, renderer);
  }

  draw(renderer: THREE.WebGLRenderer, interpolationPercentage: number): void {}

  end(fps: number, isPanicked: boolean): void {
    this.debug.updateState(this.loggerBreadcrumbs.add("end").add("fps"), fps);
  }

  resize(elementSize: ElementSize<"px">): void {}

  async start(): Promise<void> {
    await this.canvasViewGroup.start();
  }

  async stop(): Promise<void> {
    await this.canvasViewGroup.stop();
  }

  update(delta: number): void {
    this.canvasViewGroup.update(delta);
  }
}
