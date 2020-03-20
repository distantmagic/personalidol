import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeMapLoader from "src/framework/classes/QuakeMapLoader";

import QuakeBrush from "src/framework/interfaces/QuakeBrush";

import QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import QuakeWorkerFuncGroup from "src/framework/types/QuakeWorkerFuncGroup";
import QuakeWorkerWorldspawn from "src/framework/types/QuakeWorkerWorldspawn";

import * as fixtures from "src/fixtures";

test("parses map content and extracts entities and geometries", async function() {
  const quakeMapContent = await fixtures.file("map-test.map");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeMapLoader = new QuakeMapLoader(loggerBreadcrumbs);

  quakeMapLoader.onEntity.add(function(entity: QuakeWorkerAny) {
    // console.log(entity);
  });

  quakeMapLoader.onStaticBrush.add(function(brush: QuakeBrush) {
    // console.log(brush);
  });

  quakeMapLoader.onStaticGeometry.add(function(entity: QuakeWorkerFuncGroup | QuakeWorkerWorldspawn, transferables: Transferable[]) {
    // console.log(entity);
  });

  await quakeMapLoader.processMapContent(loggerBreadcrumbs, quakeMapContent);
});
