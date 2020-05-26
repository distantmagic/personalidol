import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import QuakeMapLoader from "src/framework/classes/QuakeMapLoader";

import type QuakeBrush from "src/framework/interfaces/QuakeBrush";

import type QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";
import type QuakeWorkerBrush from "src/framework/types/QuakeWorkerBrush";

import * as fixtures from "src/fixtures";

test("parses map content and extracts entities and geometries", async function () {
  const quakeMapContent = await fixtures.file("map-test.map");
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const quakeMapLoader = new QuakeMapLoader(loggerBreadcrumbs);

  const entities: QuakeWorkerAny[] = [];
  const staticBrushes: QuakeBrush[] = [];
  const staticGeometries: QuakeWorkerBrush[] = [];

  quakeMapLoader.onEntity.add(function (entity: QuakeWorkerAny) {
    entities.push(entity);
  });

  quakeMapLoader.onStaticBrush.add(function (brush: QuakeBrush) {
    staticBrushes.push(brush);
  });

  quakeMapLoader.onStaticGeometry.add(function (entity: QuakeWorkerBrush, transferables: Transferable[]) {
    staticGeometries.push(entity);
  });

  await quakeMapLoader.processMapContent(quakeMapContent);

  expect(entities).toHaveLength(2);
  expect(staticBrushes).toHaveLength(1);
  expect(staticGeometries).toHaveLength(1);
});
