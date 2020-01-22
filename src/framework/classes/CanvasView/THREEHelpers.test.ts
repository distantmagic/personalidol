import * as THREE from "three";

import CancelToken from "src/framework/classes/CancelToken";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";
import THREEHelpers from "src/framework/classes/CanvasView/THREEHelpers";

test("is cleanly attached and disposed", async function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(loggerBreadcrumbs, canvasViewBus);
  const group = new THREE.Group();

  const helpers = new THREEHelpers(loggerBreadcrumbs, canvasViewBag, group);

  expect(helpers.getChildren().children).toHaveLength(0);

  await helpers.attach(cancelToken);

  expect(helpers.getChildren().children).toHaveLength(2);

  await helpers.dispose(cancelToken);

  expect(helpers.getChildren().children).toHaveLength(0);
});
