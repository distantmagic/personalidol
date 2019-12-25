// @flow

import CancelToken from "../../framework/classes/CancelToken";
import LoggerBreadcrumbs from "../../framework/classes/LoggerBreadcrumbs";
import QuakeBrushGeometryBuilder from "../../framework/classes/QuakeBrushGeometryBuilder";
import { default as QuakeMapQuery } from "../../framework/classes/Query/QuakeMap";

declare var self: DedicatedWorkerGlobalScope;

const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker", "QuakeMap"]);

self.onmessage = function(oEvent) {
  const data = oEvent.data;

  if ("string" === typeof data) {
    self.postMessage('Hi ' + data);
  }
};

// export async function loadMap(source: string) {
//   const breadcrumbs = loggerBreadcrumbs.add("loadMap");
//   const cancelToken = new CancelToken(breadcrumbs);
//   const quakeMapQuery = new QuakeMapQuery(breadcrumbs, source);
//   const quakeMap = await quakeMapQuery.execute(cancelToken);

//   // console.time("BRUSH");
//   // for (let entity of quakeMap.getEntities()) {
//   //   const entityClassName = entity.getClassName();

//   //   if ("worldspawn" === entityClassName) {
//   //     const quakeBrushGeometryBuilder = new QuakeBrushGeometryBuilder();

//   //     for (let brush of entity.getBrushes()) {
//   //       quakeBrushGeometryBuilder.addBrush(brush);
//   //     }
//   //   }
//   // }
//   // console.timeEnd("BRUSH");
// }
