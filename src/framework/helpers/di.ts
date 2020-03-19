import * as THREE from "three";
import assert from "assert";

import CameraFrustumBus from "src/framework/classes/CameraFrustumBus";
import CancelToken from "src/framework/classes/CancelToken";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";
import ServiceBuilder from "src/framework/classes/ServiceBuilder";
import ServiceContainer from "src/framework/classes/ServiceContainer";

import { default as CameraFrustumBusInterface } from "src/framework/interfaces/CameraFrustumBus";
import { default as CancelTokenInterface } from "src/framework/interfaces/CancelToken";
import { default as CanvasViewBagInterface } from "src/framework/interfaces/CanvasViewBag";
import { default as CanvasViewBusInterface } from "src/framework/interfaces/CanvasViewBus";
import { default as LoggerBreadcrumbsInterface } from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as SchedulerInterface } from "src/framework/interfaces/Scheduler";

type Services = {
  cameraFrustumBus: CameraFrustumBusInterface;
  cancelToken: CancelTokenInterface;
  canvasViewBag: CanvasViewBagInterface;
  canvasViewBus: CanvasViewBusInterface;
  loggerBreadcrumbs: LoggerBreadcrumbsInterface;
  scheduler: SchedulerInterface;
};

const container = new ServiceContainer<Services>();

type CameraFrustumBusBuilderParameters = {
  camera: THREE.PerspectiveCamera;
};

container.register(
  new (class extends ServiceBuilder<
    Services,
    "cameraFrustumBus",
    {
      loggerBreadcrumbs: LoggerBreadcrumbsInterface;
    },
    CameraFrustumBusBuilderParameters
  > {
    readonly dependencies: ["loggerBreadcrumbs"] = ["loggerBreadcrumbs"];
    readonly key: "cameraFrustumBus" = "cameraFrustumBus";

    build(dependencies: Pick<Services, "loggerBreadcrumbs">, parameters: CameraFrustumBusBuilderParameters): CameraFrustumBusInterface {
      assert(dependencies.loggerBreadcrumbs instanceof LoggerBreadcrumbs);
      assert(parameters.camera instanceof THREE.PerspectiveCamera);

      return new CameraFrustumBus(dependencies.loggerBreadcrumbs, parameters.camera);
    }
  })()
);

container.register(
  new (class extends ServiceBuilder<
    Services,
    "cancelToken",
    {
      loggerBreadcrumbs: LoggerBreadcrumbsInterface;
    }
  > {
    readonly dependencies: ["loggerBreadcrumbs"] = ["loggerBreadcrumbs"];
    readonly key: "cancelToken" = "cancelToken";

    build(dependencies: Pick<Services, "loggerBreadcrumbs">): CancelTokenInterface {
      assert(dependencies.loggerBreadcrumbs instanceof LoggerBreadcrumbs);

      return new CancelToken(dependencies.loggerBreadcrumbs);
    }
  })()
);

container.register(
  new (class extends ServiceBuilder<
    Services,
    "canvasViewBag",
    {
      canvasViewBus: CanvasViewBusInterface;
      loggerBreadcrumbs: LoggerBreadcrumbsInterface;
    },
    CameraFrustumBusBuilderParameters
  > {
    readonly dependencies: ["canvasViewBus", "loggerBreadcrumbs"] = ["canvasViewBus", "loggerBreadcrumbs"];
    readonly key: "canvasViewBag" = "canvasViewBag";

    build(dependencies: Pick<Services, "canvasViewBus" | "loggerBreadcrumbs">): CanvasViewBagInterface {
      assert(dependencies.canvasViewBus instanceof CanvasViewBus);
      assert(dependencies.loggerBreadcrumbs instanceof LoggerBreadcrumbs);

      return new CanvasViewBag(dependencies.loggerBreadcrumbs, dependencies.canvasViewBus);
    }
  })()
);

container.register(
  new (class extends ServiceBuilder<
    Services,
    "canvasViewBus",
    {
      cameraFrustumBus: CameraFrustumBusInterface;
      loggerBreadcrumbs: LoggerBreadcrumbsInterface;
      scheduler: SchedulerInterface;
    },
    CameraFrustumBusBuilderParameters
  > {
    readonly dependencies: ["cameraFrustumBus", "loggerBreadcrumbs", "scheduler"] = ["cameraFrustumBus", "loggerBreadcrumbs", "scheduler"];
    readonly key: "canvasViewBus" = "canvasViewBus";

    build(dependencies: Pick<Services, "cameraFrustumBus" | "loggerBreadcrumbs" | "scheduler">): CanvasViewBusInterface {
      assert(dependencies.cameraFrustumBus instanceof CameraFrustumBus);
      assert(dependencies.loggerBreadcrumbs instanceof LoggerBreadcrumbs);
      assert(dependencies.scheduler instanceof Scheduler);

      return new CanvasViewBus(dependencies.loggerBreadcrumbs, dependencies.cameraFrustumBus, dependencies.scheduler);
    }
  })()
);

container.register(
  new (class LoggerBreadcrumbsBuilder extends ServiceBuilder<Services, "loggerBreadcrumbs"> {
    readonly key: "loggerBreadcrumbs" = "loggerBreadcrumbs";
    private static readonly loggerBreadcrumbs: LoggerBreadcrumbsInterface = new LoggerBreadcrumbs();

    build(): LoggerBreadcrumbsInterface {
      return LoggerBreadcrumbsBuilder.loggerBreadcrumbs;
    }
  })()
);

container.register(
  new (class extends ServiceBuilder<
    Services,
    "scheduler",
    {
      loggerBreadcrumbs: LoggerBreadcrumbsInterface;
    }
  > {
    readonly dependencies: ["loggerBreadcrumbs"] = ["loggerBreadcrumbs"];
    readonly key: "scheduler" = "scheduler";

    build(dependencies: Pick<Services, "loggerBreadcrumbs">): SchedulerInterface {
      assert(dependencies.loggerBreadcrumbs instanceof LoggerBreadcrumbs);

      return new Scheduler(dependencies.loggerBreadcrumbs);
    }
  })()
);

export default container;
