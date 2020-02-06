import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import cancelable from "src/framework/decorators/cancelable";

import CameraFrustumResponder from "src/framework/interfaces/CameraFrustumResponder";
import CancelToken from "src/framework/interfaces/CancelToken";
import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as ICameraController } from "src/framework/interfaces/CanvasController/Camera";
import { default as ICameraFrustumBus } from "src/framework/interfaces/CameraFrustumBus";

export default class CameraFrustumBus implements HasLoggerBreadcrumbs, ICameraFrustumBus {
  readonly cameraController: ICameraController;
  readonly cameraFrustumResponders: CameraFrustumResponder[] = [];
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, cameraController: ICameraController) {
    this.cameraController = cameraController;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  @cancelable()
  async add(cancelToken: CancelToken, cameraFrustumResponder: CameraFrustumResponder): Promise<void> {}

  @cancelable()
  async delete(cancelToken: CancelToken, cameraFrustumResponder: CameraFrustumResponder): Promise<void> {}

  update(delta: number): void {}

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
