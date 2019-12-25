// @flow

import CancelToken from "../../framework/classes/CancelToken";
import JSONRPCServer from "../../framework/classes/JSONRPCServer";
import LoggerBreadcrumbs from "../../framework/classes/LoggerBreadcrumbs";
import QuakeBrushGeometryBuilder from "../../framework/classes/QuakeBrushGeometryBuilder";
import QuakeMapParser from "../../framework/classes/QuakeMapParser";
import { default as PlainTextQuery } from "../../framework/classes/Query/PlainText";

import type { CancelToken as CancelTokenInterface } from "../../framework/interfaces/CancelToken";
import type { JSONRPCRequest } from "../../framework/interfaces/JSONRPCRequest";

declare var self: DedicatedWorkerGlobalScope;

const loggerBreadcrumbs = new LoggerBreadcrumbs(["worker", "QuakeMap"]);
const cancelToken = new CancelToken(loggerBreadcrumbs);
const jsonRpcServer = new JSONRPCServer(loggerBreadcrumbs, self.postMessage.bind(self));

jsonRpcServer.returnPromise(cancelToken, "/map/load", async function(cancelToken: CancelTokenInterface, request: JSONRPCRequest): Promise<void> {
  const breadcrumbs = loggerBreadcrumbs.add("/map/load");
  const [source: string] = request.getParams();
  const quakeMapQuery = new PlainTextQuery(source);
  const quakeMapContent = await quakeMapQuery.execute(cancelToken);
  const quakeMapParser = new QuakeMapParser(breadcrumbs, quakeMapContent);

  console.time("BRUSH");
  for (let entity of quakeMapParser.parse()) {
    const entityClassName = entity.getClassName();

    if ("worldspawn" === entityClassName) {
      const quakeBrushGeometryBuilder = new QuakeBrushGeometryBuilder();

      for (let brush of entity.getBrushes()) {
        quakeBrushGeometryBuilder.addBrush(brush);
      }
    }
  }
  console.timeEnd("BRUSH");
});

self.onmessage = jsonRpcServer.useMessageHandler(cancelToken);
