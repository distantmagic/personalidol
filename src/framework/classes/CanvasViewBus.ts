import isEmpty from "lodash/isEmpty";

import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CameraFrustumBus from "src/framework/interfaces/CameraFrustumBus";
import type CancelToken from "src/framework/interfaces/CancelToken";
import type CanvasView from "src/framework/interfaces/CanvasView";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type PhysicsWorld from "src/framework/interfaces/PhysicsWorld";
import type Scheduler from "src/framework/interfaces/Scheduler";
import type { default as ICanvasViewBus } from "src/framework/interfaces/CanvasViewBus";

export default class CanvasViewBus implements HasLoggerBreadcrumbs, ICanvasViewBus {
  readonly cameraFrustumBus: CameraFrustumBus;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly physicsWorld: PhysicsWorld;
  readonly scheduler: Scheduler;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, cameraFrustumBus: CameraFrustumBus, physicsWorld: PhysicsWorld, scheduler: Scheduler) {
    this.cameraFrustumBus = cameraFrustumBus;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.physicsWorld = physicsWorld;
    this.scheduler = scheduler;
  }

  @cancelable()
  async add(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    const canvasViewName: string = canvasView.getName();

    if (canvasView.isAttached()) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("add"), `Canvas view is already attached and cannot be attached again: ${canvasViewName}`);
    }

    await canvasView.attach(cancelToken);

    if (!canvasView.isAttached()) {
      throw new CanvasViewException(
        this.loggerBreadcrumbs.add("add"),
        `Canvas view is not properly attached. Did you forget to call parent 'super.attach' method?: ${canvasViewName}`
      );
    }

    if (canvasView.useCameraFrustum()) {
      await this.cameraFrustumBus.add(cancelToken, canvasView);
    }

    if (canvasView.usePhysics()) {
      canvasView.computeBoundingBox(false);
      canvasView.computeBoundingSphere(false);
      this.physicsWorld.addPhysicsController(canvasView);
    }

    if (SchedulerUpdateScenario.Always === canvasView.useUpdate()) {
      this.scheduler.update.add(canvasView.update);
    }
  }

  @cancelable()
  async delete(cancelToken: CancelToken, canvasView: CanvasView): Promise<void> {
    const canvasViewName: string = canvasView.getName();

    if (canvasView.isDisposed()) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("delete"), `Canvas view cannot is already disposed and cannot be disposed again: ${canvasViewName}`);
    }

    if (SchedulerUpdateScenario.Always === canvasView.useUpdate()) {
      this.scheduler.update.delete(canvasView.update);
    }

    if (canvasView.usePhysics()) {
      this.physicsWorld.removePhysicsController(canvasView);
    }

    if (canvasView.useCameraFrustum()) {
      await this.cameraFrustumBus.delete(cancelToken, canvasView);
    }

    await canvasView.dispose(cancelToken);

    if (!canvasView.isDisposed()) {
      throw new CanvasViewException(
        this.loggerBreadcrumbs.add("delete"),
        `Canvas view wasn't properly disposed. Did you forget to call parent 'super.dispose' method?: ${canvasViewName}`
      );
    }

    if (!isEmpty(canvasView.getChildren().children)) {
      throw new CanvasViewException(this.loggerBreadcrumbs.add("delete"), `Canvas view is not properly disposed. It still contains attached children: ${canvasViewName}`);
    }
  }
}
