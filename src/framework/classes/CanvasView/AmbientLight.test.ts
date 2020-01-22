import * as THREE from "three";

import AmbientLight from "src/framework/classes/CanvasView/AmbientLight";
import CancelToken from "src/framework/classes/CancelToken";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";

import QuakeWorkerLightAmbient from "src/framework/types/QuakeWorkerLightAmbient";

test("is cleanly attached and disposed", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(loggerBreadcrumbs, canvasViewBus);
  const group = new THREE.Group();
  const entity: QuakeWorkerLightAmbient = {
    classname: "light_ambient",
    light: 0.3,
  };

  const ambientLight = new AmbientLight(loggerBreadcrumbs, canvasViewBag, group, entity);

  expect(ambientLight.getChildren().children).toHaveLength(0);

  await ambientLight.attach(cancelToken);

  expect(ambientLight.getChildren().children).toHaveLength(1);

  await ambientLight.dispose(cancelToken);

  expect(ambientLight.getChildren().children).toHaveLength(0);
});
