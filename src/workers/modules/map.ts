import Exception from "src/framework/classes/Exception";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeMapLoader from "src/framework/classes/QuakeMapLoader";

import QuakeBrush from "src/framework/interfaces/QuakeBrush";

import QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import QuakeWorkerFuncGroup from "src/framework/types/QuakeWorkerFuncGroup";
import QuakeWorkerWorldspawn from "src/framework/types/QuakeWorkerWorldspawn";

declare var self: DedicatedWorkerGlobalScope;

const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker", "map"]);

let isConsumed = false;

self.onmessage = function (evt) {
  if (isConsumed) {
    throw new Exception(loggerBreadcrumbs, "Map worker is already consumed. To load another map spawn a different worker.");
  }

  isConsumed = true;

  const quakeMapLoader = new QuakeMapLoader(loggerBreadcrumbs.add("QuakeMapLoader"));

  quakeMapLoader.onEntity.add(function (entity: QuakeWorkerAny) {
    self.postMessage(entity);
  });

  quakeMapLoader.onStaticBrush.add(function (brush: QuakeBrush) {
    // const boundingBox = brush.getBoundingBox();
    // // push all static geometries to physics worker to check for collisions
    // evt.data.physicsMessagePort.postMessage({
    //   max: boundingBox.max.toArray(),
    //   min: boundingBox.min.toArray(),
    // });
  });

  quakeMapLoader.onStaticGeometry.add(function (entity: QuakeWorkerFuncGroup | QuakeWorkerWorldspawn, transferables: Transferable[]) {
    self.postMessage(entity, transferables);
  });

  fetch(evt.data.source)
    .then((response) => response.text())
    .then((quakeMapContent) => quakeMapLoader.processMapContent(loggerBreadcrumbs.add("processMapContent"), quakeMapContent))
    .then(() => self.postMessage(null));
};
