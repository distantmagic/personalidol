/// <reference lib="webworker" />

import * as THREE from "three";

import bootstrapWorker from "src/framework/helpers/bootstrapWorker";

import CancelToken from "src/framework/interfaces/CancelToken";
import JSONRPCRequest from "src/framework/interfaces/JSONRPCRequest";
import JSONRPCServer from "src/framework/interfaces/JSONRPCServer";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QueryBus from "src/framework/interfaces/QueryBus";

import QuakeWorkerAny from "src/framework/types/QuakeWorkerAny";

import { default as routeMap } from "src/workers/modules/quakeMap/routes/map";

declare var self: DedicatedWorkerGlobalScope;

self.onmessage = bootstrapWorker(function(serverCancelToken: CancelToken, loggerBreadcrumbs: LoggerBreadcrumbs, jsonRpcServer: JSONRPCServer, queryBus: QueryBus) {
  const threeLoadingManager = new THREE.LoadingManager();

  jsonRpcServer.returnGenerator<QuakeWorkerAny>(serverCancelToken, "/map", function(cancelToken: CancelToken, request: JSONRPCRequest) {
    return routeMap(cancelToken, request, loggerBreadcrumbs, queryBus, threeLoadingManager);
  });
});
