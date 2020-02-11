import * as THREE from "three";
import autoBind from "auto-bind";
import raf from "raf";

import Controllable from "src/framework/classes/Controllable";

import controlled from "src/framework/decorators/controlled";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import Scheduler from "src/framework/interfaces/Scheduler";
import { default as IControllable } from "src/framework/interfaces/Controllable";
import { default as IControlToken } from "src/framework/interfaces/ControlToken";
import { default as IMainLoop } from "src/framework/interfaces/MainLoop";

export default class MainLoop implements IMainLoop {
  readonly clock: THREE.Clock;
  readonly scheduler: Scheduler;
  private readonly controllable: IControllable;
  private rafHandle: null | ReturnType<typeof raf> = null;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, scheduler: Scheduler) {
    autoBind(this);

    this.clock = new THREE.Clock(false);
    this.controllable = new Controllable(loggerBreadcrumbs);
    this.scheduler = scheduler;
  }

  getControllable(): IControllable {
    return this.controllable;
  }

  @controlled(true)
  start(controlToken: IControlToken): void {
    this.clock.start();

    const animate = () => {
      this.scheduler.update.notify([this.clock.getDelta()]);
      this.scheduler.draw.notify([]);
      this.rafHandle = raf(animate);
    };

    this.rafHandle = raf(animate);
  }

  @controlled(true)
  stop(controlToken: IControlToken): void {
    this.clock.stop();

    const rafHandle = this.rafHandle;

    if (rafHandle) {
      raf.cancel(rafHandle);
    }
  }
}
