import * as THREE from "three";
import autoBind from "auto-bind";
import raf from "raf";

import Controllable from "src/framework/classes/Controllable";

import controlled from "src/framework/decorators/controlled";

import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type Scheduler from "src/framework/interfaces/Scheduler";
import type { default as IControllable } from "src/framework/interfaces/Controllable";
import type { default as IControlToken } from "src/framework/interfaces/ControlToken";
import type { default as IMainLoop } from "src/framework/interfaces/MainLoop";

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
    const delta: [number] = [0];

    this.clock.start();

    const animate = () => {
      delta[0] = this.clock.getDelta();

      this.scheduler.update.notify(delta);
      this.scheduler.draw.notify(delta);
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
