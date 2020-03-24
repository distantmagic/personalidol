import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeMapLoader from "src/framework/classes/QuakeMapLoader";

import type QuakeBrush from "src/framework/interfaces/QuakeBrush";

import type QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import type QuakeWorkerFuncGroup from "src/framework/types/QuakeWorkerFuncGroup";
import type QuakeWorkerWorldspawn from "src/framework/types/QuakeWorkerWorldspawn";

import * as fixtures from "src/fixtures";

test("parses map content and extracts entities and geometries", async function () {
  const quakeMapContent = await fixtures.file("map-test.map");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeMapLoader = new QuakeMapLoader(loggerBreadcrumbs);

  quakeMapLoader.onEntity.add(function (entity: QuakeWorkerAny) {
    // console.log(entity);
  });

  quakeMapLoader.onStaticBrush.add(function (brush: QuakeBrush) {
    // console.log(brush);
  });

  quakeMapLoader.onStaticGeometry.add(function (entity: QuakeWorkerFuncGroup | QuakeWorkerWorldspawn, transferables: Transferable[]) {
    // console.log(entity);
  });

  await quakeMapLoader.processMapContent(loggerBreadcrumbs, quakeMapContent);
});
