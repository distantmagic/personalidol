import * as THREE from "three";

import CancelToken from "src/framework/classes/CancelToken";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import HemisphereLight from "src/framework/classes/CanvasView/HemisphereLight";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";

import QuakeWorkerLightHemisphere from "src/framework/types/QuakeWorkerLightHemisphere";

test("is cleanly attached and disposed", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(loggerBreadcrumbs, canvasViewBus);
  const group = new THREE.Group();
  const entity: QuakeWorkerLightHemisphere = {
    classname: "light_hemisphere",
    light: 1.0,
  };

  const ambientLight = new HemisphereLight(loggerBreadcrumbs, canvasViewBag, group, entity);

  expect(ambientLight.getChildren().children).toHaveLength(0);

  await ambientLight.attach(cancelToken);

  expect(ambientLight.getChildren().children).toHaveLength(1);

  await ambientLight.dispose(cancelToken);

  expect(ambientLight.getChildren().children).toHaveLength(0);
});
