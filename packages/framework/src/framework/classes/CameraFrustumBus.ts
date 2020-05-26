import * as THREE from "three";
import autoBind from "auto-bind";

import Exception from "src/framework/classes/Exception";

import cancelable from "src/framework/decorators/cancelable";

import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type CameraFrustumResponder from "src/framework/interfaces/CameraFrustumResponder";
import type CancelToken from "src/framework/interfaces/CancelToken";
import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as ICameraFrustumBus } from "src/framework/interfaces/CameraFrustumBus";

export default class CameraFrustumBus implements HasLoggerBreadcrumbs, ICameraFrustumBus {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly camera: THREE.PerspectiveCamera;
  private cameraFrustum: THREE.Frustum = new THREE.Frustum();
  private cameraFrustumResponders: CameraFrustumResponder[] = [];
  private cameraProjectionMatrix: THREE.Matrix4 = new THREE.Matrix4();

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, camera: THREE.PerspectiveCamera) {
    autoBind(this);

    this.camera = camera;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  // @cancelable()
  async add(cancelToken: CancelToken, cameraFrustumResponder: CameraFrustumResponder): Promise<void> {
    if (this.cameraFrustumResponders.includes(cameraFrustumResponder)) {
      throw new Exception(this.loggerBreadcrumbs.add("add"), "Camera frustum responder is already a part of responders collection.");
    }

    this.cameraFrustumResponders.push(cameraFrustumResponder);
  }

  // @cancelable()
  async delete(cancelToken: CancelToken, cameraFrustumResponder: CameraFrustumResponder): Promise<void> {
    if (!this.cameraFrustumResponders.includes(cameraFrustumResponder)) {
      throw new Exception(this.loggerBreadcrumbs.add("delete"), "Camera frustum responder is not a part of responders collection.");
    }
  }

  update(delta: number): void {
    this.cameraFrustum.setFromProjectionMatrix(this.cameraProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));

    for (let cameraFrustumResponder of this.cameraFrustumResponders) {
      const isInCameraFrustum = cameraFrustumResponder.isInFrustum(this.cameraFrustum);

      cameraFrustumResponder.setIsInCameraFrustum(isInCameraFrustum);
    }
  }

  useUpdate(): SchedulerUpdateScenario.Always {
    return SchedulerUpdateScenario.Always;
  }
}
