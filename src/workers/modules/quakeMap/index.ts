/// <reference lib="webworker" />

import bootstrapWorker from "src/framework/helpers/bootstrapWorker";

import Exception from "src/framework/classes/Exception";
import JSONRPCResponseData from "src/framework/classes/JSONRPCResponseData";

import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCServer from "src/framework/interfaces/JSONRPCServer";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QueryBus from "src/framework/interfaces/QueryBus";

import QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";

import { default as routeMap } from "src/workers/modules/quakeMap/routes/map";

declare var self: DedicatedWorkerGlobalScope;

let messagePort: null | MessagePort = null;

self.onmessage = bootstrapWorker(function(serverCancelToken: CancelToken, loggerBreadcrumbs: LoggerBreadcrumbs, jsonRpcServer: JSONRPCServer, queryBus: QueryBus) {
  jsonRpcServer.returnGenerator<string, QuakeWorkerAny>(serverCancelToken, "/map", function(cancelToken: CancelToken, request: JSONRPCRequest<string>) {
    if (!messagePort) {
      throw new Exception(loggerBreadcrumbs, "Physics message port must be set before consuming map file.");
    }

    return routeMap(cancelToken, request, loggerBreadcrumbs, messagePort, queryBus);
  });

  jsonRpcServer.returnPromise<MessagePort, boolean>(serverCancelToken, "/message_channel", async function(cancelToken: CancelToken, request: JSONRPCRequest<MessagePort>) {
    messagePort = request.getParams().getResult();

    if (!(messagePort instanceof MessagePort)) {
      throw new Exception(loggerBreadcrumbs, "Message channel must be an instance of MessagePort.");
    }

    return new JSONRPCResponseData(true);
  });
});
