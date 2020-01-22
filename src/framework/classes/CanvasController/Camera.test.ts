import * as THREE from "three";

import Camera from "src/framework/classes/CanvasController/Camera";
import CanvasViewBag from "src/framework/classes/CanvasViewBag";
import CanvasViewBus from "src/framework/classes/CanvasViewBus";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import Scheduler from "src/framework/classes/Scheduler";

test("camera controller uses control token", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const scheduler = new Scheduler(loggerBreadcrumbs);
  const canvasViewBus = new CanvasViewBus(loggerBreadcrumbs, scheduler);
  const canvasViewBag = new CanvasViewBag(loggerBreadcrumbs, canvasViewBus);
  const camera = new Camera(loggerBreadcrumbs, canvasViewBag, new THREE.OrthographicCamera(0, 0, 0, 0));
});
